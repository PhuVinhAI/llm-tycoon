import copy
import importlib.util
import tempfile
import unittest
from pathlib import Path

SOURCE = Path(__file__).resolve().parents[2] / 'game' / 'runtime' / 'state.py'
SPEC = importlib.util.spec_from_file_location('tycoon_gameplay_tests', SOURCE)
rt = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(rt)
gp = rt._gameplay


class GameplayTests(unittest.TestCase):
    def state(self, date='2013-01'):
        state = rt.new_state('Player', 'Lab', 'vi')
        state['clock'] = {'date': date, 'turn': gp.month_number(date) - gp.month_number('2013-01') + 1}
        return state

    def mark_and_show(self, state):
        while rt.due_events(state):
            rt.queue_due_events(state)
            state['world']['firedEvents'].extend(e['id'] for e in rt.due_events(state))
        rt.acknowledge_news(state, {c['id']: 'Actually displayed source headline: ' + c['title']
                                    for c in state['flow']['newsOutbox'] if not c['shown']})

    def declaration(self, state, arch='BOW', scale='Tiny', months=1):
        return {'name': 'Experiment', 'architecture': arch, 'scale': scale, 'task': 'CLS',
                'datasets': copy.deepcopy(state['data']['datasets']), 'inheritModelId': None,
                'monthsTotal': months, 'focus': gp.architecture(arch)['focus']}

    def test_every_calendar_date_and_historical_row_is_scheduled(self):
        for _, row in gp.rows('content/08_events_calendar.md', 'Dated events'):
            if row[0] != '#':
                self.assertIn(row[0], [e['id'] for e in rt.scheduled_events(gp.content_date(row[1]))])
        for benchmark in gp.benchmarks():
            events = rt.scheduled_events(benchmark['date'])
            self.assertTrue(any(e['kind'] == 'benchmark' and e['title'] == benchmark['id'] for e in events))
        for rival in gp.rivals():
            self.assertTrue(any(e['kind'] == 'rival' and e['title'] == rival['name']
                                for e in rt.scheduled_events(rival['date'])))
            number = gp.month_number(rival['date']) - 3
            year, month = divmod(number, 12)
            rumor_date = '%04d-%02d' % (year, month + 1)
            self.assertTrue(any(e['kind'] == 'rumor' and e['releaseDate'] == rival['date']
                                and rival['name'] in e['title'] for e in rt.scheduled_events(rumor_date)))

    def test_zero_effect_news_and_multiple_simultaneous_sources_are_not_omitted(self):
        events = rt.scheduled_events('2018-06')
        self.assertIn('E21', [e['id'] for e in events])
        self.assertTrue(any(e['kind'] == 'benchmark' and e['title'] == 'SQuAD 2.0' for e in events))
        self.assertTrue(any(e['kind'] == 'rival' and 'GPT-1' in e['title'] for e in events))
        self.assertEqual(len({e['id'] for e in events}), len(events))
        self.assertEqual(rt.scheduled_events('2025-02'), [])

    def test_news_is_independent_of_action_and_queue_is_idempotent(self):
        queued = []
        for action in ('research', 'freelance', 'continue_project', 'fine_tuning'):
            state = self.state('2018-06')
            cards = rt.begin_month(state, {'action': action})
            rt.queue_due_events(state)
            self.assertEqual(len(cards), len(state['flow']['newsOutbox']))
            queued.append([e['id'] for e in cards])
        self.assertTrue(all(x == queued[0] for x in queued))

    def test_month_cannot_finish_with_fired_but_unshown_news(self):
        state = self.state()
        rt.begin_month(state, {'action': 'research'})
        state['world']['firedEvents'].extend(e['id'] for e in rt.due_events(state))
        state['flow']['month']['nextPhase'] = 'report'
        with self.assertRaisesRegex(rt.StateError, 'News not resolved/displayed'):
            rt.finish_month(state, {})
        self.mark_and_show(state)
        rt.finish_month(state, {})
        self.assertEqual(state['clock']['date'], '2013-02')
        self.assertTrue(state['flow']['lastReport']['eventCards'])

    def test_receipt_does_not_replace_effect_resolution_or_player_choice(self):
        state = self.state()
        rt.begin_month(state, {'action': 'research'})
        rt.acknowledge_news(state, {c['id']: 'Displayed source: ' + c['title'] for c in state['flow']['newsOutbox']})
        state['flow']['month']['nextPhase'] = 'report'
        with self.assertRaisesRegex(rt.StateError, 'Unresolved monthly events'):
            rt.finish_month(state, {})
        with self.assertRaises(rt.StateError):
            rt.acknowledge_news(state, {'E0': 'ok'})

    def test_commit_rejects_manual_clock_skip_and_news_deletion(self):
        with tempfile.TemporaryDirectory() as temp:
            runtime = rt.Runtime(temp)
            event = {'actionId': 'start', 'type': 'new_game', 'label': 'start', 'date': '2013-01', 'turn': 1}
            state = runtime.commit(self.state(), event, 0)
            bad = copy.deepcopy(state)
            bad['clock'] = {'date': '2013-02', 'turn': 2}
            with self.assertRaises(rt.StateError):
                runtime.commit(bad, dict(event, actionId='skip', type='checkpoint'), 1)
            rt.begin_month(state, {'action': 'research'})
            state = runtime.commit(state, dict(event, actionId='begin', type='checkpoint'), 1)
            bad = copy.deepcopy(state)
            bad['flow']['month']['newsRequiredIds'] = []
            with self.assertRaises(rt.StateError):
                runtime.commit(bad, dict(event, actionId='delete', type='checkpoint'), 2)
            bad = copy.deepcopy(state)
            bad['world']['firedEvents'].extend(e['id'] for e in rt.due_events(bad))
            bad['flow']['month']['nextPhase'] = 'action'
            with self.assertRaises(rt.StateError):
                runtime.commit(bad, dict(event, actionId='ignore-display', type='checkpoint'), 2)
            bundle = runtime.export_bundle()
            imported = rt.Runtime(Path(temp) / 'imported').import_save(bundle)
            self.assertEqual(imported['flow']['newsOutbox'], state['flow']['newsOutbox'])
            self.assertTrue(all(not c['shown'] for c in imported['flow']['newsOutbox']))

    def test_cpu_project_works_from_opening_without_gpu(self):
        state = self.state()
        state['technology']['owned'].append('BOW')
        project = rt.create_project(state, self.declaration(state))
        self.assertEqual(project['fixedComputeRequirement'], 0)
        rt.advance_project(state)
        model = rt.complete_project(state, release_raw=True)
        self.assertGreater(model['quality'], 40)
        self.assertEqual(state['counters']['models'], 1)
        state['active']['project'] = None
        with self.assertRaisesRegex(ValueError, 'Tiny/Base'):
            rt.create_project(state, self.declaration(state, scale='Massive'))

    def test_cancel_forfeits_pending_research_and_fame(self):
        state = self.state()
        state['technology']['owned'].append('BOW')
        project = rt.create_project(state, self.declaration(state, months=2))
        project['completionResearchBonus'] = 2000
        rt.advance_project(state)
        rt.cancel_commitment(state, 'project')
        self.assertEqual(state['resources']['researchPoints'], 0)
        self.assertEqual(state['counters']['models'], 0)
        state['active']['paper'] = {'completionFameBonus': 500}
        rt.cancel_commitment(state, 'paper')
        self.assertEqual(state['resources']['fame'], 0)

    def test_diminishing_quality_keeps_focus_meaningful(self):
        self.assertLess(gp.normalize_quality(113), 100)
        self.assertGreater(gp.normalize_quality(113), gp.normalize_quality(103))
        self.assertLess(gp.normalize_quality(200), 100)

    def test_recollected_identical_data_does_not_reset_novelty(self):
        state = self.state()
        state['technology']['owned'].append('BOW')
        rt.create_project(state, self.declaration(state))
        rt.advance_project(state)
        first = rt.complete_project(state, True)
        state['data']['datasets'][0]['id'] = 'D2'
        state['data']['nextDatasetId'] = 3
        rt.create_project(state, self.declaration(state))
        rt.advance_project(state)
        second = rt.complete_project(state, True)
        self.assertEqual(second['noveltyMultiplier'], .5)
        self.assertLess(second['quality'], first['quality'])
        self.assertEqual(state['counters']['models'], 1)

    def test_duplicate_coverage_and_last_moment_optimizer_are_blocked(self):
        state = self.state()
        state['technology']['owned'].append('BOW')
        declaration = self.declaration(state)
        declaration['datasets'] *= 2
        with self.assertRaises(ValueError):
            rt.create_project(state, declaration)
        before = rt.training_compute(100, [2, 2, 4, 2], [.85])
        after = rt.training_compute(100, [2, 2, 4, 2], [.65])
        self.assertGreater(after, before)

    def test_new_benchmark_does_not_change_frozen_task_quality(self):
        state = self.state('2015-07')
        state['technology']['owned'].append('BOW')
        project = rt.create_project(state, self.declaration(state))
        rt.advance_project(state)
        before = rt.project_quality(project, [], '2015-07')
        after = rt.project_quality(project, [], '2015-08')
        self.assertEqual(before['quality'], after['quality'])
        self.assertTrue(any(b['id'] == 'SNLI (Stanford Inference)' and not b['target'] for b in after['benchmarks']))

    def test_logs_name_does_not_grant_perfect_domain_fit(self):
        state = self.state()
        state['technology']['owned'].append('BOW')
        project = rt.create_project(state, self.declaration(state))
        rt.advance_project(state)
        before = rt.project_quality(project, [], '2013-01')
        project['datasets'][0]['name'] = 'User Logs - CLS'
        self.assertEqual(before['quality'], rt.project_quality(project, [], '2013-01')['quality'])

    def test_seeded_dilemma_sequence_does_not_depend_on_waiting_month(self):
        first = self.state()
        second = copy.deepcopy(first)
        second['clock'] = {'date': '2020-01', 'turn': 85}
        a = [rt.draw_dilemma(first, 'freelance') for _ in range(6)]
        b = [rt.draw_dilemma(second, 'freelance') for _ in range(6)]
        self.assertEqual(a, b)
        self.assertEqual(sorted(a), list(range(6)))

    def test_investment_does_not_change_campaign_financial_score(self):
        state = self.state('2019-01')
        before = rt.campaign_score(state)
        state['resources']['cash'] += 2000000
        state['counters']['capitalRaised'] += 2000000
        self.assertEqual(rt.campaign_score(state), before)
        state['ending']['winAwarded'] = True
        self.assertLess(rt.campaign_score(state) - before, 10000)

    def test_sota_uses_best_normalized_rival_and_degrades_when_outdated(self):
        self.assertGreaterEqual(gp.rival_at('CNN/DailyMail', '2019-10')['score'], 72)
        model = {'targetBenchmarkIds': ['WikiText'], 'benchmarks': [{'id': 'WikiText', 'score': 77}]}
        self.assertTrue(rt.current_sota(model, '2018-07'))
        self.assertFalse(rt.current_sota(model, '2019-02'))

    def test_two_cloud_units_can_start_llm_in_2017(self):
        state = self.state('2017-01')
        state['technology']['owned'] += ['GPUT', 'PRET', 'SCALE']
        state['resources']['cash'] = 100000
        state['hardware']['cloudUnits'] = 2
        state['data']['datasets'] = [{'id': 'D1', 'name': 'Clean web', 'domain': 'web-mixed',
                                     'size': 5, 'quality': 3, 'sourceId': None, 'taskId': None}]
        declaration = self.declaration(state, arch='PTRF', months=30)
        project = rt.create_project(state, declaration, is_llm=True)
        self.assertEqual(project['fixedComputeRequirement'], 60000)
        self.assertEqual(state['resources']['cash'], 80000)

    def test_fine_tuning_does_not_create_training_compute_or_repeat_midpoint(self):
        state = self.state()
        state['technology']['owned'].append('BOW')
        project = rt.create_project(state, self.declaration(state, months=2))
        rt.advance_project(state)
        first = rt.project_midpoint(project, state['clock']['date'])
        self.assertIn(first, ('smooth', 'complication', 'breakthrough'))
        rt.advance_project(state)
        compute = project['computeAccumulated']
        rt.extend_project(state, fine_tuning=True)
        rt.advance_project(state)
        self.assertEqual(project['computeAccumulated'], compute)
        self.assertEqual(project['trainingMonthsElapsed'], 2)
        self.assertEqual(project['artifacts'], 0)
        self.assertIsNone(rt.project_midpoint(project, state['clock']['date']))
        model = rt.complete_project(state)
        self.assertEqual(model['artifacts'], 0)

    def test_product_quote_has_meaningful_cash_premium_and_preserves_logs_domain(self):
        state = self.state()
        state['technology']['owned'].append('BOW')
        state['data']['datasets'][0].update(domain='reviews', size=2, quality=3)
        rt.create_project(state, self.declaration(state))
        rt.advance_project(state)
        model = rt.complete_project(state, True)
        state['resources']['fame'] = 1000
        license_quote = rt.quote_release(state, model['id'], 'License')
        product_quote = rt.quote_release(state, model['id'], 'Product')
        self.assertGreater(product_quote['monthlyCash'] * 8, license_quote['cash'] * 1.8)
        self.assertEqual(product_quote['reservedVram'], 0)
        rt.release_model(state, model['id'], 'Product')
        with self.assertRaises(ValueError):
            rt.release_model(state, model['id'], 'License')
        with self.assertRaises(ValueError):
            rt.product_logs(state, model['id'])
        state['streams'][0]['monthsRemaining'] = 0
        logs = rt.product_logs(state, model['id'])
        self.assertEqual((logs['domain'], logs['taskId'], logs['sourceId']), ('reviews', 'CLS', model['id']))
        with self.assertRaises(ValueError):
            rt.product_logs(state, model['id'])

    def test_open_source_never_rewards_leaving_artifacts(self):
        state = self.state()
        state['technology']['owned'].append('BOW')
        rt.create_project(state, self.declaration(state))
        rt.advance_project(state)
        model = rt.complete_project(state, True)
        raw = rt.quote_release(state, model['id'], 'Open-source')
        model['artifacts'] = 0  # Keep Q fixed to isolate the removed raw-release bonus.
        clean = rt.quote_release(state, model['id'], 'Open-source')
        self.assertEqual(raw['fame'], clean['fame'])

    def test_contract_completion_pays_bonus_and_returns_canonical_client_data(self):
        state = self.state()
        state['technology']['owned'].append('EMB')
        state['active']['contract'] = {'id': 'C01', 'monthsTotal': 2, 'monthsElapsed': 2,
                                       'payModifierPercent': 10, 'completionFameBonus': -150}
        result = rt.complete_contract(state)
        self.assertEqual(result['cash'], 13000)
        self.assertEqual(result['dataset']['domain'], 'news')
        self.assertEqual(result['dataset']['taskId'], 'CLS')
        self.assertEqual(state['resources']['fame'], 0)
        self.assertEqual(state['counters']['models'], 1)
        with self.assertRaises(ValueError):
            rt.complete_contract(state)

    def test_paper_pending_reward_is_paid_only_once_on_completion(self):
        state = self.state()
        state['technology']['owned'].append('BOW')
        state['data']['datasets'][0].update(domain='reviews', size=2, quality=3)
        rt.create_project(state, self.declaration(state))
        rt.advance_project(state)
        model = rt.complete_project(state, True)
        state['active']['paper'] = {'modelId': model['id'], 'monthsElapsed': 1, 'monthsTotal': 2,
                                    'completionFameBonus': 500, 'researchMultiplier': .5, 'researchBonus': 0}
        before = state['resources'].copy()
        with self.assertRaises(ValueError):
            rt.complete_paper(state)
        self.assertEqual(state['resources'], before)
        state['active']['paper']['monthsElapsed'] = 2
        rt.complete_paper(state)
        self.assertEqual(state['resources']['fame'], before['fame'] + 800)
        self.assertTrue(model['published'] and model['codePublic'])
        with self.assertRaises(ValueError):
            rt.complete_paper(state)
        with self.assertRaises(ValueError):
            rt.quote_release(state, model['id'], 'License')

    def test_term_sheet_decline_then_later_win_and_score_freeze(self):
        state = self.state('2019-01')
        state['models'] = [{'id': 'M1', 'isLlm': True, 'quality': 81, 'targetBenchmarkIds': ['test'],
                            'benchmarks': [{'id': 'test', 'score': 81}], 'noveltyMultiplier': 1,
                            'architecture': 'PTRF', 'task': 'LLM (general)', 'scale': 'Frontier',
                            'datasets': copy.deepcopy(state['data']['datasets']), 'releaseDate': None}]
        rt.resolve_term_sheet(state, 'M1', False)
        self.assertFalse(state['ending']['winAwarded'])
        state['models'].append(dict(state['models'][0], id='M2', termSheetResolved=False))
        rt.resolve_term_sheet(state, 'M2', True)
        self.assertTrue(state['ending']['winAwarded'])
        self.assertEqual(state['counters']['capitalRaised'], 2000000)
        frozen = copy.deepcopy(rt.freeze_campaign(state))
        state['resources']['cash'] += 5000000
        self.assertEqual(rt.freeze_campaign(state), frozen)
        with self.assertRaises(ValueError):
            rt.resolve_term_sheet(state, 'M2', True)

    def test_event_choice_can_interrupt_completions_but_not_finish_unresolved(self):
        with tempfile.TemporaryDirectory() as temp:
            runtime = rt.Runtime(temp)
            event = {'actionId': 'start', 'type': 'new_game', 'label': 'start', 'date': '2013-01', 'turn': 1}
            state = runtime.commit(self.state(), event, 0)
            rt.begin_month(state, {'action': 'research'})
            state = runtime.commit(state, dict(event, actionId='begin', type='checkpoint'), 1)
            self.mark_and_show(state)
            state['resources']['fame'] = 2500
            rt.queue_due_events(state)
            state['world']['firedEvents'].extend(e['id'] for e in rt.due_events(state) if e['id'] != 'T2')
            rt.acknowledge_news(state, {c['id']: 'Displayed source: ' + c['title']
                                        for c in state['flow']['newsOutbox'] if not c['shown']})
            state['flow']['month']['nextPhase'] = 'completions'
            state['flow']['pendingChoice'] = {'id': 'angel', 'kind': 'event_choice', 'eventId': 'T2',
                                              'view': 'S10', 'date': '2013-01', 'turn': 1,
                                              'title': 'Angel', 'sourceFiles': ['content/08_events_calendar.md'],
                                              'options': [{'id': 'yes', 'label': 'Accept', 'effects': {'cash': 25000}}],
                                              'resume': {'phase': 'completions'}}
            state = runtime.commit(state, dict(event, actionId='angel-choice', type='checkpoint'), 2)
            state['flow']['month']['nextPhase'] = 'report'
            with self.assertRaises(rt.StateError):
                rt.finish_month(state, {})

    def test_all_campaign_months_keep_news_in_log_across_resume(self):
        # A persistence/calendar traversal, not an economics or GPT narration playtest.
        with tempfile.TemporaryDirectory() as temp:
            runtime = rt.Runtime(temp)
            state = self.state()
            start = {'actionId': 'new', 'type': 'new_game', 'label': 'new', **state['clock']}
            state = runtime.commit(state, start, 0)
            expected_ids = []
            for turn in range(1, 97):
                clock = dict(state['clock'])
                expected_ids.extend(e['id'] for e in rt.scheduled_events(clock['date']))
                rt.begin_month(state, {'action': 'freelance'})
                event = {'label': 'calendar traversal', **clock}
                state = runtime.commit(state, dict(event, actionId='begin-' + str(turn), type='checkpoint'), state['meta']['revision'])
                self.mark_and_show(state)
                state['flow']['month']['nextPhase'] = 'report'
                rt.finish_month(state, {'action': 'freelance'})
                completion_event = dict(event, actionId='end-' + str(turn), type='month_completed', details={'action': 'freelance'})
                candidate = copy.deepcopy(state)
                state = runtime.commit(state, completion_event, state['meta']['revision'])
                if turn == 1:
                    self.assertEqual(runtime.commit(candidate, completion_event, candidate['meta']['revision']), state)
                if turn == 48:
                    runtime = rt.Runtime(Path(temp) / 'resumed')
                    state = runtime.import_save(rt.Runtime(temp).export_bundle())
            logged_ids = [c['id'] for e in runtime.events() if e['type'] == 'month_completed' for c in e['details']['news']]
            self.assertEqual(sorted(logged_ids), sorted(expected_ids))
            self.assertEqual(len(logged_ids), len(set(logged_ids)))
            self.assertEqual(state['clock']['date'], '2021-01')


if __name__ == '__main__':
    unittest.main()
