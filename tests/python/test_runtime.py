import copy
import importlib.util
import json
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

SOURCE = Path(__file__).resolve().parents[2] / "game" / "runtime" / "state.py"
SPEC = importlib.util.spec_from_file_location("tycoon", SOURCE)
rt = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(rt)


class RuntimeTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="llmt-runtime-")
        self.root = Path(self.temporary.name)
        self.runtime = rt.Runtime(self.root / "active")
        self.initial = rt.new_state("Người chơi", "Công ty AI", "vi")

    def tearDown(self):
        self.temporary.cleanup()

    def event(self, action_id="new", kind="new_game", **details):
        value = {"actionId": action_id, "type": kind, "label": kind, "date": "2013-01", "turn": 1}
        if details:
            value["details"] = details
        return value

    def start(self):
        return self.runtime.commit(self.initial, self.event(), 0)

    def pending(self, state):
        state = copy.deepcopy(state)
        state["view"]["current"] = "S10"
        state["flow"]["month"] = {
            "date": "2013-01", "turn": 1, "mainAction": {"action": "research"},
            "nextPhase": "action", "appliedSteps": ["E0", "E1"],
            "ledger": [{"resource": "researchPoints", "delta": 0}], "eventCards": [{"id": "E1"}]
        }
        state["flow"]["pendingChoice"] = {
            "id": "research-1", "kind": "research", "view": "S10", "date": "2013-01", "turn": 1,
            "title": "Chọn hướng", "sourceFiles": ["content/11_research_events.md"],
            "options": [{"id": "one", "label": "A", "effects": {"rp": 600}},
                        {"id": "two", "label": "B", "effects": {"rp": 1200}}],
            "resume": {"phase": "action", "target": "research"}
        }
        return state

    def test_rounding_uses_decimal_half_up(self):
        self.assertEqual(rt.round_half_up(2.5), 3)
        self.assertEqual(rt.round_half_up(-2.5), -3)
        self.assertEqual(rt.round_half_up("74.85", 1), 74.9)
        self.assertEqual(rt.round_half_up("1.005", 2), 1.01)

    def test_default_runtime_is_separate_from_immutable_package(self):
        self.assertEqual(rt.runtime.root, SOURCE.parent.parent / "session")
        self.assertEqual(rt.runtime.save_path, SOURCE.parent.parent / "session" / "state" / "save.json")

    def test_section_reader_includes_subheadings_and_ignores_fenced_headings(self):
        document = self.root / "example.md"
        document.write_text(
            "# File\n\n## First\nBody\n### Child\nKeep me\n~~~python\n## Fake\n~~~\n"
            "## Second\nOther\n", encoding="utf-8")
        with patch.object(rt, "PACKAGE_ROOT", self.root):
            selected = rt.read_document("example.md", "First")
            self.assertTrue(selected.startswith("## First"))
            self.assertIn("### Child", selected)
            self.assertIn("## Fake", selected)
            self.assertNotIn("## Second", selected)
            self.assertEqual(rt.read_document("example.md"), document.read_text(encoding="utf-8"))
            with self.assertRaises(rt.StateError):
                rt.read_document("example.md", "Missing")
            with self.assertRaises(rt.StateError):
                rt.read_document("example.md", "Fake")
            with self.assertRaises(rt.StateError):
                rt.read_document("../outside.md")
            with self.assertRaises(rt.StateError):
                rt.read_document(str(document.resolve()))

    def test_inspect_save_validates_before_any_replacement_without_writes(self):
        self.start()
        path = self.runtime.export_bundle()
        before = self.runtime.save_path.read_bytes()
        before_events = self.runtime.events_path.read_bytes()
        inspected = rt.inspect_save(path)
        self.assertEqual(inspected["state"], self.runtime.load())
        self.assertEqual(inspected["events"], self.runtime.events())
        self.assertEqual(self.runtime.save_path.read_bytes(), before)
        self.assertEqual(self.runtime.events_path.read_bytes(), before_events)
        self.assertFalse(self.runtime.journal_path.exists())
        bad = self.root / "bad.json"
        corrupted = copy.deepcopy(inspected["state"])
        corrupted["meta"]["version"] = "wrong"
        bad.write_text(json.dumps(corrupted), encoding="utf-8")
        with self.assertRaises(rt.StateError):
            rt.inspect_save(bad)
        self.assertEqual(self.runtime.save_path.read_bytes(), before)

    def test_new_state_matches_scenario_and_has_unique_run(self):
        self.assertEqual(self.initial["resources"], {"cash": 10000, "researchPoints": 0, "fame": 0})
        self.assertEqual(self.initial["clock"], {"date": "2013-01", "turn": 1})
        self.assertEqual(self.initial["technology"]["owned"], ["BTP"])
        self.assertEqual(self.initial["hardware"]["inventory"], [])
        self.assertEqual(self.initial["data"]["nextDatasetId"], 2)
        self.assertNotEqual(self.initial["meta"]["runId"], rt.new_state("A", "B", "vi")["meta"]["runId"])
        self.assertFalse(self.runtime.save_path.exists())

    def test_invalid_inputs_are_rejected_before_any_write(self):
        corruptions = [
            ("meta", "version", "0.4.0"), ("meta", "schema", "wrong"),
            ("resources", "fame", 5001), ("resources", "fame", -1),
            ("resources", "cash", float("nan")), ("resources", "researchPoints", True),
            ("clock", "turn", 2), ("settings", "language", 7),
            ("data", "nextDatasetId", 1), ("world", "firedEvents", ["E1", "E1"])
        ]
        for group, key, value in corruptions:
            with self.subTest(group=group, key=key, value=value):
                state = copy.deepcopy(self.initial)
                state[group][key] = value
                with self.assertRaises(rt.StateError):
                    self.runtime.commit(state, self.event(), 0)
                self.assertFalse(self.runtime.journal_path.exists())
                self.assertFalse(self.runtime.save_path.exists())

    def test_commit_populates_revision_and_actual_resource_history(self):
        state = self.start()
        self.assertEqual(state["meta"]["revision"], 1)
        self.assertIsNone(self.initial["meta"]["lastActionId"])
        candidate = copy.deepcopy(state)
        candidate["resources"]["cash"] -= 1000
        result = self.runtime.commit(candidate, self.event("buy", "instant_action"), 1)
        log = self.runtime.events()
        self.assertEqual(result["resources"]["cash"], 9000)
        self.assertEqual(log[-1]["before"]["cash"], 10000)
        self.assertEqual(log[-1]["after"]["cash"], 9000)
        self.assertFalse(self.runtime.journal_path.exists())

    def test_retry_after_later_action_returns_latest_state_without_replaying(self):
        state = self.start()
        candidate = copy.deepcopy(state)
        candidate["resources"]["cash"] -= 1000
        self.runtime.commit(candidate, self.event("buy", "instant_action"), 1)
        resumed = self.runtime.commit(self.initial, self.event(), 0)
        self.assertEqual(resumed["resources"]["cash"], 9000)
        self.assertEqual(len(self.runtime.events()), 2)
        with self.assertRaises(rt.StateError):
            self.runtime.commit(candidate, self.event("buy", "navigation"), 1)

    def test_stale_click_cannot_write_or_replace_save(self):
        state = self.start()
        self.runtime.commit(copy.deepcopy(state), self.event("view", "navigation"), 1)
        before = self.runtime.save_path.read_bytes()
        with self.assertRaises(rt.StateError):
            self.runtime.commit(state, self.event("stale", "instant_action"), 1)
        self.assertEqual(self.runtime.save_path.read_bytes(), before)

    def test_commit_cannot_replace_run_identity(self):
        state = self.start()
        state["meta"]["runId"] = "other-run"
        with self.assertRaises(rt.StateError):
            self.runtime.commit(state, self.event("replace", "navigation"), 1)

    def test_pending_choice_resume_keeps_exact_options_and_month_checkpoint(self):
        state = self.start()
        candidate = self.pending(state)
        saved = self.runtime.commit(candidate, self.event("pause", "checkpoint"), 1)
        reloaded = rt.Runtime(self.runtime.root).load()
        self.assertEqual(reloaded["flow"], saved["flow"])
        self.assertEqual(reloaded["view"]["current"], "S10")
        bundle = self.runtime.export_bundle()
        imported = rt.Runtime(self.root / "resumed").import_save(bundle)
        self.assertEqual(imported["flow"], saved["flow"])
        self.assertEqual(imported["view"], saved["view"])

    def test_invalid_pending_choice_and_duplicate_phase_are_rejected(self):
        for bad in ["options", "phase"]:
            with self.subTest(bad=bad):
                state = self.pending(self.initial)
                if bad == "options":
                    state["flow"]["pendingChoice"]["options"].append(
                        copy.deepcopy(state["flow"]["pendingChoice"]["options"][0]))
                else:
                    state["flow"]["month"]["appliedSteps"].append("E1")
                with self.assertRaises(rt.StateError):
                    rt.validate(state)

    def test_final_stream_payout_can_pause_before_expiry_handling(self):
        state = self.pending(self.initial)
        state["flow"]["month"]["nextPhase"] = "completions"
        state["models"] = [{
            "id": "M1", "name": "Classifier", "architecture": "BOW", "scale": "Tiny", "task": "CLS",
            "datasets": copy.deepcopy(state["data"]["datasets"]), "focus": [3, 3, 2, 2],
            "quality": 60, "artifacts": 0, "completedDate": "2013-01", "release": "Product",
            "releaseDate": "2013-01", "analyzed": False, "published": False,
            "sotaHype": False, "isLlm": False, "benchmarks": []
        }]
        state["streams"] = [{
            "id": "stream-M1", "modelId": "M1", "monthlyCash": 1000, "monthsRemaining": 0,
            "reservedVram": 0, "task": "CLS", "quality": 60
        }]
        self.assertIs(rt.validate(state), state)
        state["flow"]["month"] = None
        state["flow"]["pendingChoice"] = None
        with self.assertRaises(rt.StateError):
            rt.validate(state)

    def test_recovery_finishes_each_interrupted_write_once(self):
        for phase in ["log", "save", "cleanup"]:
            with self.subTest(phase=phase):
                runtime = rt.Runtime(self.root / phase)
                state = runtime.commit(rt.new_state("A", "B", "vi"), self.event(), 0)
                candidate = copy.deepcopy(state)
                candidate["resources"]["cash"] -= 1000
                original_atomic = rt._atomic_bytes
                original_unlink = Path.unlink

                def interrupted_write(path, payload):
                    if (phase == "log" and path == runtime.events_path) or (
                            phase == "save" and path == runtime.save_path):
                        raise OSError("injected interruption")
                    return original_atomic(path, payload)

                def interrupted_unlink(path, *args, **kwargs):
                    if phase == "cleanup" and path == runtime.journal_path:
                        raise OSError("injected interruption")
                    return original_unlink(path, *args, **kwargs)

                with patch.object(rt, "_atomic_bytes", side_effect=interrupted_write), \
                        patch.object(Path, "unlink", interrupted_unlink):
                    with self.assertRaises(OSError):
                        runtime.commit(candidate, self.event("pay", "instant_action"), 1)
                self.assertTrue(runtime.journal_path.exists())
                resumed = rt.Runtime(runtime.root)
                self.assertEqual(resumed.load()["resources"]["cash"], 9000)
                self.assertEqual(len(resumed.events()), 2)
                self.assertEqual(resumed.load()["meta"]["revision"], 2)
                self.assertFalse(resumed.journal_path.exists())

    def test_failed_journal_write_leaves_original_save_intact(self):
        state = self.start()
        before = self.runtime.save_path.read_bytes()
        with patch.object(rt, "_atomic_bytes", side_effect=OSError("disk full")):
            with self.assertRaises(OSError):
                self.runtime.commit(state, self.event("next", "navigation"), 1)
        self.assertEqual(self.runtime.save_path.read_bytes(), before)
        self.assertEqual(len(self.runtime.events()), 1)

    def test_bundle_import_preserves_history_and_never_overwrites_existing_run(self):
        state = self.start()
        bundle = self.runtime.export_bundle()
        with zipfile.ZipFile(str(bundle)) as archive:
            self.assertIsNone(archive.testzip())
            self.assertEqual(set(archive.namelist()), {"save.json", "events.jsonl", "README.md"})
        target = rt.Runtime(self.root / "target")
        imported = target.import_save(bundle)
        self.assertEqual(imported["resources"], state["resources"])
        self.assertEqual(imported["meta"]["revision"], 2)
        self.assertEqual(target.events()[0], self.runtime.events()[0])
        before = target.save_path.read_bytes()
        with self.assertRaises(rt.StateError):
            target.import_save(bundle)
        self.assertEqual(target.save_path.read_bytes(), before)

    def test_import_recovery_preserves_imported_history(self):
        self.start()
        bundle = self.runtime.export_bundle()
        target = rt.Runtime(self.root / "target")
        original = rt._atomic_bytes

        def fail_save(path, payload):
            if path == target.save_path:
                raise OSError("interrupted import")
            return original(path, payload)

        with patch.object(rt, "_atomic_bytes", side_effect=fail_save):
            with self.assertRaises(OSError):
                target.import_save(bundle)
        self.assertEqual(target.load()["meta"]["revision"], 2)
        self.assertEqual(len(target.events()), 2)

    def test_json_import_marks_history_gap_and_preserves_current_state(self):
        self.start()
        candidate = self.runtime.load()
        candidate["clock"] = {"date": "2013-02", "turn": 2}
        self.runtime.commit(candidate, self.event("month", "month_completed", action="research"), 1)
        incoming = self.runtime.export_json()
        original = incoming.read_bytes()
        target = rt.Runtime(self.root / "target")
        imported = target.import_save(incoming)
        self.assertEqual(imported["meta"]["historyAvailableFrom"], "2013-02")
        self.assertEqual(imported["clock"]["date"], "2013-02")
        self.assertEqual(len(target.events()), 1)
        self.assertEqual(incoming.read_bytes(), original)

    def test_rejects_out_of_order_or_mismatched_imported_history(self):
        self.start()
        state = self.runtime.load()
        self.runtime.commit(state, self.event("second", "navigation"), 1)
        save = self.runtime.load()
        entries = self.runtime.events()
        for kind in ["order", "run", "balance", "action"]:
            with self.subTest(kind=kind):
                corrupt = copy.deepcopy(entries)
                if kind == "order":
                    corrupt.reverse()
                elif kind == "run":
                    corrupt[0]["runId"] = "other"
                elif kind == "balance":
                    corrupt[-1]["after"]["cash"] = 0
                else:
                    corrupt[-1]["actionId"] = "wrong"
                incoming = self.root / (kind + ".zip")
                with zipfile.ZipFile(str(incoming), "w") as archive:
                    archive.writestr("save.json", json.dumps(save))
                    archive.writestr("events.jsonl", "\n".join(json.dumps(e) for e in corrupt))
                target = rt.Runtime(self.root / (kind + "-target"))
                with self.assertRaises(rt.StateError):
                    target.import_save(incoming)
                self.assertFalse(target.save_path.exists())

    def test_zip_import_reads_known_entries_without_extracting_other_paths(self):
        self.start()
        incoming = self.root / "hostile-path.zip"
        with zipfile.ZipFile(str(incoming), "w") as archive:
            archive.writestr("save.json", json.dumps(self.runtime.load()))
            archive.writestr("../escape.txt", "must not be written")
        target = rt.Runtime(self.root / "target")
        target.import_save(incoming)
        self.assertFalse((self.root / "escape.txt").exists())
        self.assertEqual(target.load()["resources"]["cash"], 10000)

    def test_history_counts_completed_months_not_choice_checkpoints(self):
        state = self.start()
        for action, kind, detail in [
            ("checkpoint", "checkpoint", {}), ("choice", "choice", {}),
            ("month", "month_completed", {"action": "research", "technologyUnlocked": ["NGRAM"]})
        ]:
            state = self.runtime.commit(state, self.event(action, kind, **detail), state["meta"]["revision"])
        history = self.runtime.history_export().read_text(encoding="utf-8")
        self.assertIn("research ×1", history)
        self.assertIn("Technology: NGRAM", history)
        self.assertNotIn("checkpoint ×", history)
        self.assertEqual(len(self.runtime.events(year=2013)), 4)
        self.assertEqual(self.runtime.events(year=2014), [])

    def test_corrupt_canonical_log_is_not_silently_reset(self):
        self.start()
        before = self.runtime.save_path.read_bytes()
        self.runtime.events_path.write_text("broken JSON\n", encoding="utf-8")
        with self.assertRaises(ValueError):
            self.runtime.load()
        self.assertEqual(self.runtime.save_path.read_bytes(), before)

    def test_explicit_archive_preserves_download_and_allows_new_run(self):
        state = self.start()
        archived = self.runtime.archive_current()
        self.assertTrue(archived["download"].exists())
        self.assertEqual(rt._read_json(archived["archive"] / "save.json"), state)
        self.assertFalse(self.runtime.save_path.exists())
        new = self.runtime.commit(rt.new_state("C", "D", "en"), self.event(), 0)
        self.assertNotEqual(new["meta"]["runId"], state["meta"]["runId"])
        self.assertTrue((archived["archive"] / "events.jsonl").exists())


if __name__ == "__main__":
    unittest.main()
