#!/usr/bin/env python3
"""Persistence for LLM Tycoon 1.0. Mechanics are resolved from Rules in Python."""
from __future__ import annotations

import argparse
import copy
import json
import math
import os
import re
import tempfile
import uuid
import zipfile
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

SCRIPT_ROOT = Path(__file__).resolve().parent
VERSION = "1.0.0"
SCHEMA = "llm-tycoon.save.v1"
VIEWS = {"S0", "S1", "S2", "S3", "S4", "S5", "S6", "S6-B", "S7", "S8",
         "S9", "S10", "S11", "S12", "S13", "S14", "S15", "S16", "S17"}
PHASES = {"events", "action", "streams", "costs", "completions", "checks", "report"}
EVENT_TYPES = {"new_game", "navigation", "instant_action", "checkpoint", "choice",
               "month_completed", "import", "repair"}


class StateError(ValueError):
    pass


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def round_half_up(value, places=0):
    result = Decimal(str(value)).quantize(Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP)
    return int(result) if places == 0 else float(result)


def _need(condition, message):
    if not condition:
        raise StateError(message)


def _keys(value, keys, label):
    _need(isinstance(value, dict), label + " must be an object")
    _need(set(keys).issubset(value), label + " missing: " + ", ".join(sorted(set(keys) - set(value))))


def _number(value, label, low=None, high=None, integer=False):
    _need(isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value),
          label + " must be a finite number")
    if integer:
        _need(isinstance(value, int), label + " must be an integer")
    if low is not None:
        _need(value >= low, label + " is below minimum")
    if high is not None:
        _need(value <= high, label + " exceeds maximum")


def _date(value):
    _need(isinstance(value, str) and re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", value) is not None,
          "date must be YYYY-MM")
    year, month = map(int, value.split("-"))
    _need(year >= 2013, "date precedes the scenario")
    return (year - 2013) * 12 + month


def _ids(items, label):
    _need(isinstance(items, list), label + " must be an array")
    identifiers = []
    for item in items:
        _keys(item, ["id"], label + " record")
        _need(isinstance(item["id"], str) and bool(item["id"]), label + " ID is invalid")
        identifiers.append(item["id"])
    _need(len(set(identifiers)) == len(identifiers), label + " IDs must be unique")


def _strings(items, label, unique=False):
    _need(isinstance(items, list) and all(isinstance(x, str) and bool(x) for x in items),
          label + " must contain nonempty strings")
    if unique:
        _need(len(set(items)) == len(items), label + " must be unique")


def _json_value(value):
    """Reject unsupported values and NaN/Infinity anywhere, even in optional fields."""
    try:
        json.dumps(value, ensure_ascii=False, allow_nan=False)
    except (TypeError, ValueError) as exc:
        raise StateError("State must contain finite JSON values") from exc


def validate(state):
    _json_value(state)
    _keys(state, ["meta", "settings", "view", "player", "clock", "resources", "counters",
                  "technology", "hardware", "team", "data", "models", "streams",
                  "contractsDone", "active", "world", "flow", "ending", "flavor"], "state")
    meta = state["meta"]
    _keys(meta, ["game", "version", "schema", "runId", "revision", "updatedAt",
                 "lastActionId", "historyAvailableFrom"], "meta")
    _need(meta["game"] == "LLM TYCOON" and meta["version"] == VERSION and meta["schema"] == SCHEMA,
          "Unsupported game version or save schema")
    _need(isinstance(meta["runId"], str) and bool(meta["runId"]), "runId is required")
    _number(meta["revision"], "revision", 0, integer=True)
    _date(meta["historyAvailableFrom"])
    if meta["revision"] > 0:
        _need(isinstance(meta["updatedAt"], str) and bool(meta["updatedAt"]), "updatedAt is required")
        _need(isinstance(meta["lastActionId"], str) and bool(meta["lastActionId"]), "lastActionId is required")
    _keys(state["settings"], ["language", "presentation", "displayPreferences"], "settings")
    _need(isinstance(state["settings"]["language"], str) and bool(state["settings"]["language"].strip())
          and state["settings"]["presentation"] == "adaptive",
          "language and adaptive presentation are required")
    _need(isinstance(state["settings"]["displayPreferences"], dict), "displayPreferences must be object")
    _keys(state["view"], ["current", "returnTo", "context"], "view")
    _need(state["view"]["current"] in VIEWS and state["view"]["returnTo"] in VIEWS, "Invalid view")
    _need(isinstance(state["view"]["context"], dict), "view.context must be object")
    _keys(state["player"], ["name", "company"], "player")
    for field in ["name", "company"]:
        _need(isinstance(state["player"][field], str) and bool(state["player"][field].strip()),
              "player." + field + " is required")
    _keys(state["clock"], ["date", "turn"], "clock")
    _need(_date(state["clock"]["date"]) == state["clock"]["turn"], "Date and turn disagree")
    _number(state["clock"]["turn"], "turn", 1, integer=True)
    _keys(state["resources"], ["cash", "researchPoints", "fame"], "resources")
    _number(state["resources"]["cash"], "cash", integer=True)
    _number(state["resources"]["researchPoints"], "researchPoints", 0, integer=True)
    _number(state["resources"]["fame"], "fame", 0, 5000, integer=True)
    _keys(state["counters"], ["research", "models"], "counters")
    for key in ["research", "models"]:
        _number(state["counters"][key], "counter " + key, 0, integer=True)
    _keys(state["technology"], ["owned"], "technology")
    _strings(state["technology"]["owned"], "technology IDs", unique=True)
    hw = state["hardware"]
    _keys(hw, ["inventory", "cloudUnits", "rewired"], "hardware")
    _number(hw["cloudUnits"], "cloudUnits", 0, 2, integer=True)
    _need(isinstance(hw["rewired"], bool), "rewired must be boolean")
    _ids(hw["inventory"], "hardware")
    for item in hw["inventory"]:
        _keys(item, ["itemId", "quantity", "purchasePrice", "tflops", "vram", "slots"], "hardware item")
        _number(item["quantity"], "hardware quantity", 1, integer=True)
        for key in ["purchasePrice", "tflops", "vram", "slots"]:
            _number(item[key], key, 0)
        _number(item["slots"], "slots", 0, integer=True)
    used_slots = sum(x["slots"] * x["quantity"] for x in hw["inventory"])
    _need(used_slots <= (8 if hw["rewired"] else 4), "Hardware exceeds available slots")
    _keys(state["team"], ["employees", "candidates", "searchArchetype"], "team")
    _ids(state["team"]["employees"], "employees")
    _ids(state["team"]["candidates"], "candidates")
    _need(len(state["team"]["employees"]) <= 2, "Team exceeds two employees")
    _need(len(state["team"]["candidates"]) in (0, 3), "Interview needs exactly three candidates")
    for person in state["team"]["employees"] + state["team"]["candidates"]:
        _keys(person, ["name", "archetype", "salary", "effects", "background"], "person")
        _number(person["salary"], "salary", 0, integer=True)
        _keys(person["effects"], ["researchBonus", "qualityBonus", "datasetQualityBonus", "computeMultiplier"],
              "employee effects")
        for key in ["researchBonus", "qualityBonus", "datasetQualityBonus"]:
            _number(person["effects"][key], key, 0)
        _number(person["effects"]["computeMultiplier"], "computeMultiplier", 0.000001)
    _keys(state["data"], ["datasets", "sourcesUsed", "nextDatasetId"], "data")
    _ids(state["data"]["datasets"], "datasets")
    _strings(state["data"]["sourcesUsed"], "sourcesUsed", unique=True)
    _number(state["data"]["nextDatasetId"], "nextDatasetId", 1, integer=True)

    def check_dataset(dataset):
        _keys(dataset, ["id", "name", "domain", "size", "quality", "sourceId", "taskId"], "dataset")
        _need(isinstance(dataset["id"], str) and re.fullmatch(r"D[1-9]\d*", dataset["id"]) is not None,
              "Invalid dataset ID")
        for key in ["name", "domain"]:
            _need(isinstance(dataset[key], str) and bool(dataset[key]), key + " is required")
        for key in ["sourceId", "taskId"]:
            _need(dataset[key] is None or isinstance(dataset[key], str), key + " must be string or null")
        _number(dataset["size"], "dataset size", 1, 5, integer=True)
        _number(dataset["quality"], "dataset quality", 1, 5, integer=True)

    for dataset in state["data"]["datasets"]:
        check_dataset(dataset)
        _need(int(dataset["id"][1:]) < state["data"]["nextDatasetId"], "nextDatasetId would recycle an ID")
    _ids(state["models"], "models")
    for i, model in enumerate(state["models"], 1):
        _keys(model, ["name", "architecture", "scale", "task", "datasets", "focus", "quality",
                      "artifacts", "completedDate", "release", "releaseDate", "analyzed",
                      "published", "sotaHype", "isLlm", "benchmarks"], "model")
        _need(model["id"] == "M" + str(i), "Models must retain completion order")
        _number(model["quality"], "model quality", 0, 100)
        _number(model["artifacts"], "model artifacts", 0, integer=True)
        _date(model["completedDate"])
        _need(model["release"] in {"Shelved", "Open-source", "License", "Product"}, "Invalid release")
        _need(isinstance(model["focus"], list) and len(model["focus"]) == 4, "Invalid focus")
        for point in model["focus"]:
            _number(point, "focus", 0, 10, integer=True)
        _need(sum(model["focus"]) == 10, "Focus must sum to 10")
        _need(isinstance(model["datasets"], list) and 1 <= len(model["datasets"]) <= 3, "Invalid model datasets")
        for dataset in model["datasets"]:
            check_dataset(dataset)
            _need(int(dataset["id"][1:]) < state["data"]["nextDatasetId"], "Model snapshot ID would be recycled")
        for key in ["analyzed", "published", "sotaHype", "isLlm"]:
            _need(isinstance(model[key], bool), key + " must be boolean")
        _need(isinstance(model["benchmarks"], list), "benchmarks must be array")
        if model["releaseDate"] is not None:
            _date(model["releaseDate"])
    _ids(state["streams"], "streams")
    for stream in state["streams"]:
        _keys(stream, ["modelId", "monthlyCash", "monthsRemaining", "reservedVram", "task", "quality"], "stream")
        _need(stream["modelId"] in [m["id"] for m in state["models"]], "Stream references unknown model")
        _number(stream["monthlyCash"], "monthlyCash", 0, integer=True)
        _number(stream["monthsRemaining"], "monthsRemaining", 0, 8, integer=True)
        if stream["monthsRemaining"] == 0:
            checkpoint = state["flow"].get("month")
            _need(isinstance(checkpoint, dict) and checkpoint.get("nextPhase") in {"costs", "completions"},
                  "Expired stream must be resolved before finishing the month")
        _number(stream["reservedVram"], "reservedVram", 0)
        _number(stream["quality"], "stream quality", 0, 100)
    installed_vram = sum(x["vram"] * x["quantity"] for x in hw["inventory"])
    _need(sum(x["reservedVram"] for x in state["streams"]) <= installed_vram,
          "Product inference VRAM exceeds local hardware")
    _strings(state["contractsDone"], "contractsDone", unique=True)
    _keys(state["active"], ["project", "contract", "paper"], "active")
    _need(sum(state["active"][k] is not None for k in ("project", "contract", "paper")) <= 1,
          "Only one commitment may be active")
    for kind in ["project", "contract", "paper"]:
        commitment = state["active"][kind]
        if commitment is None:
            continue
        _keys(commitment, ["id", "monthsTotal", "monthsElapsed", "dilemmaDone"], kind)
        _number(commitment["monthsTotal"], "monthsTotal", 1, integer=True)
        _number(commitment["monthsElapsed"], "monthsElapsed", 0, commitment["monthsTotal"], integer=True)
        _need(isinstance(commitment["dilemmaDone"], bool), "dilemmaDone must be boolean")
        required = {
            "project": ["name", "architecture", "scale", "task", "datasets", "inheritModelId", "focus",
                        "computeAccumulated", "qualityModifier", "artifacts", "phase", "isLlm"],
            "contract": ["payModifierPercent"],
            "paper": ["modelId", "researchMultiplier", "researchBonus", "immediateConsequencesApplied"]
        }[kind]
        _keys(commitment, required, kind)
        if kind == "project":
            _need(commitment["phase"] in {"training", "fine-tuning"}, "Invalid project phase")
            _number(commitment["computeAccumulated"], "computeAccumulated", 0)
            _number(commitment["qualityModifier"], "qualityModifier")
            _number(commitment["artifacts"], "artifacts", 0, integer=True)
            _need(isinstance(commitment["isLlm"], bool), "isLlm must be boolean")
            _need(commitment["inheritModelId"] is None or commitment["inheritModelId"]
                  in [m["id"] for m in state["models"]], "Unknown inherited model")
            _need(isinstance(commitment["focus"], list) and len(commitment["focus"]) == 4, "Invalid project focus")
            for point in commitment["focus"]:
                _number(point, "focus", 0, 10, integer=True)
            _need(sum(commitment["focus"]) == 10, "Focus must sum to 10")
            _need(isinstance(commitment["datasets"], list) and 1 <= len(commitment["datasets"]) <= 3,
                  "Invalid project datasets")
            for dataset in commitment["datasets"]:
                check_dataset(dataset)
                _need(int(dataset["id"][1:]) < state["data"]["nextDatasetId"], "Project snapshot ID would be recycled")
        elif kind == "contract":
            _number(commitment["payModifierPercent"], "payModifierPercent")
        else:
            _need(commitment["modelId"] in [m["id"] for m in state["models"]], "Paper references unknown model")
            _number(commitment["researchMultiplier"], "researchMultiplier", 0)
            _number(commitment["researchBonus"], "researchBonus")
            _need(isinstance(commitment["immediateConsequencesApplied"], bool),
                  "immediateConsequencesApplied must be boolean")
    _keys(state["world"], ["firedEvents", "effects", "unlocks", "competitions", "llmUnlocked"], "world")
    for key in ["firedEvents", "effects", "unlocks", "competitions"]:
        _need(isinstance(state["world"][key], list), "world." + key + " must be array")
    for key in ["firedEvents", "unlocks"]:
        _strings(state["world"][key], key, unique=True)
    _ids(state["world"]["effects"], "world effects")
    for effect in state["world"]["effects"]:
        _keys(effect, ["sourceEventId", "kind", "target", "value", "starts", "ends"], "world effect")
        _date(effect["starts"])
        if effect["ends"] is not None:
            _need(_date(effect["ends"]) >= _date(effect["starts"]), "Effect ends before it starts")
    _ids(state["world"]["competitions"], "competitions")
    for competition in state["world"]["competitions"]:
        _keys(competition, ["tasks", "openedDate", "closesDate", "threshold", "thresholdRevealed",
                            "submittedModelIds", "won", "prizeCash", "prizeFame"], "competition")
        _strings(competition["tasks"], "competition tasks", unique=True)
        _need(_date(competition["closesDate"]) >= _date(competition["openedDate"]), "Invalid competition dates")
        for key in ["thresholdRevealed", "won"]:
            _need(isinstance(competition[key], bool), key + " must be boolean")
        _number(competition["threshold"], "threshold", 0, 100)
        _strings(competition["submittedModelIds"], "submitted models", unique=True)
        _need(all(x in [m["id"] for m in state["models"]] for x in competition["submittedModelIds"]),
              "Competition references unknown model")
        for key in ["prizeCash", "prizeFame"]:
            _number(competition[key], key, 0, integer=True)
    _need(isinstance(state["world"]["llmUnlocked"], bool), "llmUnlocked must be boolean")
    _keys(state["flow"], ["draft", "month", "pendingChoice", "lastReport"], "flow")
    _need(isinstance(state["flow"]["draft"], dict), "draft must be object")
    month = state["flow"]["month"]
    if month is not None:
        _keys(month, ["date", "turn", "mainAction", "nextPhase", "appliedSteps", "ledger", "eventCards"], "month")
        _need(month["date"] == state["clock"]["date"] and month["turn"] == state["clock"]["turn"],
              "Month checkpoint disagrees with clock")
        _need(month["nextPhase"] in PHASES, "Invalid next phase")
        _need(isinstance(month["mainAction"], dict), "mainAction must be object")
        for key in ["appliedSteps", "ledger", "eventCards"]:
            _need(isinstance(month[key], list), key + " must be array")
        _strings(month["appliedSteps"], "appliedSteps", unique=True)
    pending = state["flow"]["pendingChoice"]
    if pending is not None:
        _keys(pending, ["id", "kind", "view", "date", "turn", "title", "sourceFiles", "options", "resume"], "choice")
        _need(pending["view"] in VIEWS and pending["date"] == state["clock"]["date"]
              and pending["turn"] == state["clock"]["turn"], "Invalid choice view or clock")
        _need(isinstance(pending["resume"], dict), "choice resume must be object")
        _need(isinstance(pending["id"], str) and bool(pending["id"]), "choice ID is required")
        _strings(pending["sourceFiles"], "choice sourceFiles")
        _need(pending["kind"] in {"freelance", "research", "project_dilemma", "fine_tuning",
                                   "contract_dilemma", "paper_dilemma", "event_choice", "term_sheet",
                                   "release", "interview"}, "Unknown choice kind")
        _ids(pending["options"], "choice options")
        _need(bool(pending["options"]), "choice options are required")
        for option in pending["options"]:
            _keys(option, ["label", "effects"], "choice option")
            _need(isinstance(option["effects"], dict), "choice effects must be object")
    _keys(state["ending"], ["bankruptcy", "winAwarded", "lastResult"], "ending")
    _need(isinstance(state["ending"]["bankruptcy"], bool) and isinstance(state["ending"]["winAwarded"], bool),
          "Ending status must be boolean")
    _need(isinstance(state["flavor"], dict), "flavor must be object")
    return state


def new_state(player, company, language):
    template = SCRIPT_ROOT.parent / "scenarios" / "00_home_lab.json"
    state = json.loads(template.read_text(encoding="utf-8"))
    state["meta"]["runId"] = uuid.uuid4().hex
    state["player"] = {"name": player, "company": company}
    state["settings"]["language"] = language
    return validate(state)


def _read_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def _atomic_bytes(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=path.name + ".", suffix=".tmp", dir=str(path.parent))
    try:
        with os.fdopen(fd, "wb") as handle:
            handle.write(payload)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, str(path))
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def _atomic_json(path, value):
    _atomic_bytes(path, (json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n").encode("utf-8"))


def _parse_log(raw):
    entries = [json.loads(line) for line in raw.splitlines() if line.strip()]
    ids = []
    for entry in entries:
        _keys(entry, ["actionId", "revision", "runId", "date", "turn", "type", "label", "before", "after",
                      "loggedAt", "view"], "log event")
        _need(_date(entry["date"]) == entry["turn"], "Log date/turn mismatch")
        _number(entry["revision"], "log revision", 1, integer=True)
        _need(isinstance(entry["actionId"], str) and bool(entry["actionId"]), "Invalid log action ID")
        _need(entry["type"] in EVENT_TYPES and entry["view"] in VIEWS, "Invalid log type or view")
        if ids:
            previous = entries[len(ids) - 1]
            _need(entry["revision"] == previous["revision"] + 1, "History revisions must be consecutive")
            _need(entry["runId"] == previous["runId"], "Mixed runs in history")
        ids.append(entry["actionId"])
    _need(len(set(ids)) == len(ids), "Duplicate action IDs in history")
    return entries


class Runtime:
    def __init__(self, root=None):
        self.root = Path(root) if root is not None else SCRIPT_ROOT
        self.state_dir = self.root / "state"
        self.save_path = self.state_dir / "save.json"
        self.events_path = self.state_dir / "events.jsonl"
        self.journal_path = self.state_dir / "transaction.json"
        self.exports_dir = self.root / "exports"

    def _events(self):
        return _parse_log(self.events_path.read_text(encoding="utf-8")) if self.events_path.exists() else []

    def _recover(self):
        if not self.journal_path.exists():
            return
        journal = _read_json(self.journal_path)
        _keys(journal, ["expectedRevision", "state", "event"], "journal")
        candidate = validate(journal["state"])
        event = journal["event"]
        _need(event["actionId"] == candidate["meta"]["lastActionId"]
              and event["revision"] == candidate["meta"]["revision"]
              and event["runId"] == candidate["meta"]["runId"], "Journal event mismatch")
        prior = _read_json(self.save_path) if self.save_path.exists() else None
        revision = prior["meta"]["revision"] if prior is not None else 0
        _need(revision in (journal["expectedRevision"], candidate["meta"]["revision"]), "Stale recovery journal")
        if prior is not None:
            _need(prior["meta"]["runId"] == candidate["meta"]["runId"], "Recovery run mismatch")
        entries = self._events()
        if "importedHistory" in journal:
            imported_entries = journal["importedHistory"]
            _parse_log("\n".join(json.dumps(e, allow_nan=False) for e in imported_entries))
            if not entries:
                entries = imported_entries
            else:
                _need(entries[:len(imported_entries)] == imported_entries, "Imported history mismatch")
        matches = [e for e in entries if e["actionId"] == event["actionId"]]
        if matches:
            _need(matches[0] == event, "Action ID collision")
        else:
            _parse_log("\n".join(json.dumps(e, allow_nan=False) for e in entries + [event]))
            payload = "".join(json.dumps(e, ensure_ascii=False, allow_nan=False) + "\n"
                              for e in entries + [event])
            _atomic_bytes(self.events_path, payload.encode("utf-8"))
        _atomic_json(self.save_path, candidate)
        self.journal_path.unlink()

    def load(self):
        self._recover()
        if not self.save_path.exists():
            raise FileNotFoundError("No active run. Choose New Game or import a save.")
        state = validate(_read_json(self.save_path))
        entries = self._events()
        _need(bool(entries), "Committed save has no event log; import a JSON copy to resume without earlier history")
        _need(entries[-1]["runId"] == state["meta"]["runId"]
              and entries[-1]["revision"] == state["meta"]["revision"]
              and entries[-1]["actionId"] == state["meta"]["lastActionId"]
              and entries[-1]["after"] == state["resources"], "Event log does not match current save")
        return state

    def commit(self, candidate, event, expected_revision):
        self._recover()
        validate(candidate)
        _keys(event, ["actionId", "type", "label", "date", "turn"], "event")
        _need(isinstance(event["actionId"], str) and bool(event["actionId"]), "actionId is required")
        _need(event["type"] in EVENT_TYPES, "Invalid event type")
        _need(_date(event["date"]) == event["turn"], "Event date/turn mismatch")
        prior = self.load() if self.save_path.exists() else None
        entries = self._events()
        matches = [e for e in entries if e["actionId"] == event["actionId"]]
        if matches:
            _need(prior is not None and matches[0]["runId"] == prior["meta"]["runId"],
                  "Action ID belongs to another run")
            _need(all(matches[0].get(k) == event.get(k) for k in event), "Action ID reused with different event")
            return prior
        revision = prior["meta"]["revision"] if prior is not None else 0
        _need(revision == expected_revision, "State revision changed; reload before applying this action")
        value = copy.deepcopy(candidate)
        _need(value["meta"]["revision"] == expected_revision, "Candidate has stale revision")
        if prior is not None:
            _need(value["meta"]["runId"] == prior["meta"]["runId"], "Cannot replace run by commit")
        else:
            _need(event["type"] in {"new_game", "import"}, "Initial transaction must create or import a run")
        value["meta"].update(revision=revision + 1, updatedAt=now_iso(), lastActionId=event["actionId"])
        validate(value)
        logged = copy.deepcopy(event)
        logged.update(revision=revision + 1, runId=value["meta"]["runId"], loggedAt=value["meta"]["updatedAt"],
                      view=value["view"]["current"],
                      before=copy.deepcopy(prior["resources"]) if prior is not None else None,
                      after=copy.deepcopy(value["resources"]))
        _json_value(logged)
        _atomic_json(self.journal_path, {"expectedRevision": revision, "state": value, "event": logged})
        self._recover()
        return self.load()

    def events(self, year=None):
        self._recover()
        entries = self._events()
        return entries if year is None else [e for e in entries if e["date"].startswith(str(year) + "-")]

    def export_json(self):
        state = self.load()
        path = self.exports_dir / ("LLM-TYCOON-" + state["clock"]["date"] + "-r"
                                   + str(state["meta"]["revision"]) + ".json")
        _atomic_json(path, state)
        return path

    def export_bundle(self):
        state = self.load()
        self.exports_dir.mkdir(parents=True, exist_ok=True)
        path = self.exports_dir / ("LLM-TYCOON-save-" + state["clock"]["date"] + "-r"
                                   + str(state["meta"]["revision"]) + ".zip")
        fd, temporary = tempfile.mkstemp(suffix=".zip", dir=str(self.exports_dir))
        os.close(fd)
        try:
            with zipfile.ZipFile(temporary, "w", compression=zipfile.ZIP_DEFLATED) as archive:
                archive.writestr("save.json", json.dumps(state, ensure_ascii=False, indent=2))
                if self.events_path.exists():
                    archive.writestr("events.jsonl", self.events_path.read_bytes())
                archive.writestr("README.md", "# LLM Tycoon 1.0 Save\n\nImport this ZIP with the game package's Python helper.\n")
            os.replace(temporary, str(path))
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)
        return path

    def archive_current(self):
        """Preserve the active run before an explicitly requested New Game/import."""
        state = self.load()
        download = self.export_bundle()
        parent = self.root / "archives"
        parent.mkdir(parents=True, exist_ok=True)
        destination = parent / ("r" + str(state["meta"]["revision"]) + "-" + uuid.uuid4().hex)
        resolved_root = self.root.resolve()
        _need(resolved_root in self.state_dir.resolve().parents
              and resolved_root in destination.resolve().parents, "Archive path escapes runtime")
        os.replace(str(self.state_dir), str(destination))
        return {"archive": destination, "download": download}

    def import_save(self, path):
        self._recover()
        _need(not self.save_path.exists() and not self.events_path.exists(),
              "Runtime is not empty; archive the current run before importing")
        source = Path(path)
        history = ""
        if zipfile.is_zipfile(str(source)):
            with zipfile.ZipFile(str(source)) as archive:
                names = archive.namelist()
                _need(names.count("save.json") == 1 and names.count("events.jsonl") <= 1,
                      "Portable ZIP requires one save.json")
                _need(archive.getinfo("save.json").file_size <= 20 * 1024 * 1024, "Save file too large")
                imported = json.loads(archive.read("save.json").decode("utf-8-sig"))
                if "events.jsonl" in names:
                    _need(archive.getinfo("events.jsonl").file_size <= 100 * 1024 * 1024, "History too large")
                    history = archive.read("events.jsonl").decode("utf-8-sig")
        else:
            imported = _read_json(source)
        validate(imported)
        entries = _parse_log(history)
        if entries:
            _need(all(e["runId"] == imported["meta"]["runId"] for e in entries), "History run mismatch")
            _need(entries[-1]["revision"] == imported["meta"]["revision"]
                  and entries[-1]["actionId"] == imported["meta"]["lastActionId"]
                  and entries[-1]["after"] == imported["resources"], "History does not match save")
        candidate = copy.deepcopy(imported)
        if not entries:
            candidate["meta"]["historyAvailableFrom"] = candidate["clock"]["date"]
        import_id = "import-" + uuid.uuid4().hex
        candidate["meta"].update(revision=imported["meta"]["revision"] + 1,
                                 updatedAt=now_iso(), lastActionId=import_id)
        event = {"actionId": import_id, "type": "import", "label": "Import save",
                 "date": candidate["clock"]["date"], "turn": candidate["clock"]["turn"],
                 "revision": candidate["meta"]["revision"], "runId": candidate["meta"]["runId"],
                 "loggedAt": candidate["meta"]["updatedAt"], "view": candidate["view"]["current"],
                 "before": None, "after": copy.deepcopy(candidate["resources"])}
        _atomic_json(self.journal_path, {"expectedRevision": 0, "state": candidate, "event": event,
                                       "importedHistory": entries})
        self._recover()
        return self.load()

    def history_export(self):
        state = self.load()
        entries = self.events()
        groups = {}
        for event in entries:
            groups.setdefault(event["date"][:4], []).append(event)
        lines = ["# LLM Tycoon 1.0 — History", "",
                 "History available from: " + str(state["meta"]["historyAvailableFrom"]), ""]
        for year, records in sorted(groups.items()):
            actions = {}
            models, technologies = [], []
            for event in records:
                details = event.get("details", {})
                if event["type"] == "month_completed":
                    action = details.get("action", event["label"])
                    actions[action] = actions.get(action, 0) + 1
                models.extend(details.get("modelsCompleted", []))
                technologies.extend(details.get("technologyUnlocked", []))
            balance = records[-1]["after"]
            lines.extend(["## " + year, "",
                          "Actions: " + (", ".join(k + " ×" + str(v) for k, v in sorted(actions.items())) or "none"),
                          "Models: " + json.dumps(models, ensure_ascii=False),
                          "Technology: " + ", ".join(dict.fromkeys(technologies)),
                          "Last logged balances: " + json.dumps(balance, ensure_ascii=False), ""])
        path = self.exports_dir / "history-export.md"
        _atomic_bytes(path, ("\n".join(lines) + "\n").encode("utf-8"))
        return path


_default = Runtime()
load = _default.load
commit = _default.commit
events = _default.events
export_bundle = _default.export_bundle
export_json = _default.export_json
import_save = _default.import_save
archive_current = _default.archive_current
history_export = _default.history_export


def main():
    parser = argparse.ArgumentParser(description="LLM Tycoon 1.0 persistence")
    parser.add_argument("--runtime", help="Override runtime directory")
    sub = parser.add_subparsers(dest="command", required=True)
    for name in ["load", "export", "history"]:
        sub.add_parser(name)
    incoming = sub.add_parser("import")
    incoming.add_argument("path")
    args = parser.parse_args()
    runtime = Runtime(args.runtime)
    if args.command == "load":
        print(json.dumps(runtime.load(), ensure_ascii=False, indent=2))
    elif args.command == "export":
        print(runtime.export_bundle())
    elif args.command == "history":
        print(runtime.history_export())
    else:
        print(json.dumps(runtime.import_save(args.path), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
