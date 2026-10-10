"""Targeted deterministic calculations. Canonical catalogs remain in Content."""
from __future__ import annotations

import hashlib
import copy
import math
import random
import re
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MONTHS = {name: i for i, name in enumerate(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 1)}
SCALES = {
    'Tiny': (2, .5, 1, -10, .8), 'Base': (4, 1, 2, 0, 1),
    'Large': (12, 4, 3, 8, 1.2), 'Massive': (40, 15, 4, 16, 1.5),
    'Frontier': (320, 20, 5, 25, 2),
}


def rounded(value, places=0):
    result = Decimal(str(value)).quantize(Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP)
    return int(result) if places == 0 else float(result)


def month_number(date):
    if not re.fullmatch(r'\d{4}-(0[1-9]|1[0-2])', date):
        raise ValueError('Expected YYYY-MM')
    year, month = map(int, date.split('-'))
    return year * 12 + month - 1


def content_date(value):
    value = value.strip()
    if re.fullmatch(r'\d{4}', value):
        return value + '-01'
    parts = value.split()
    if len(parts) == 2 and parts[0] in MONTHS and parts[1].isdigit():
        return parts[1] + '-%02d' % MONTHS[parts[0]]
    raise ValueError('Unrecognized Content date: ' + value)


def rows(path, heading=None):
    """Parse only canonical Markdown table rows, excluding maintainer comments."""
    text = re.sub(r'<!--[\s\S]*?-->', lambda m: '\n' * m.group(0).count('\n'),
                  (ROOT / path).read_text(encoding='utf-8-sig'))
    active = heading is None
    for line_no, line in enumerate(text.splitlines(), 1):
        if line.startswith('## '):
            if active and heading is not None:
                return
            active = heading is None or line[3:].strip() == heading
        if not active or not line.startswith('|'):
            continue
        cells = [s.strip() for s in line.strip().strip('|').split('|')]
        if not all(re.fullmatch(r'[-: ]*', s) for s in cells):
            yield line_no, cells


def benchmarks(task=None, date=None):
    result = []
    for line, row in rows('content/13_benchmarks.md', '1. Official Benchmarks'):
        if row[0] == 'Benchmark / Dataset':
            continue
        item = {'id': row[0], 'date': content_date(row[1]),
                'tasks': [x.strip() for x in row[2].split(',')],
                'domains': [x.strip() for x in row[3].split(',')],
                'source': 'content/13_benchmarks.md', 'line': line}
        if (task is None or task in item['tasks']) and (
                date is None or month_number(item['date']) <= month_number(date)):
            result.append(item)
    return result


def rivals():
    result = []
    for line, row in rows('content/14_rival_models.md'):
        if row[0] == 'Date':
            continue
        result.append({'date': content_date(row[0]), 'benchmark': row[1],
                       'name': row[2], 'score': float(row[3]),
                       'source': 'content/14_rival_models.md', 'line': line})
    return result


def rival_at(benchmark, date):
    eligible = [r for r in rivals() if r['benchmark'] == benchmark
                and month_number(r['date']) <= month_number(date)]
    return max(eligible, key=lambda r: (r['score'], r['date'])) if eligible else None


def scheduled_events(date):
    """All current dated news, with stable source IDs; no future data dump."""
    current = month_number(date)
    result = []
    for line, row in rows('content/08_events_calendar.md', 'Dated events'):
        if row[0] == '#':
            continue
        if content_date(row[1]) == date:
            result.append({'id': row[0], 'date': date, 'kind': 'calendar',
                           'title': row[2], 'effect': row[3],
                           'source': 'content/08_events_calendar.md', 'line': line})
    for item in benchmarks(date=date):
        if item['date'] == date:
            result.append({'id': 'benchmark:' + item['id'] + ':' + date, 'date': date,
                           'kind': 'benchmark', 'title': item['id'], 'effect': 'News only',
                           'source': item['source'], 'line': item['line'], 'tasks': item['tasks']})
    groups = {}
    mapping = {b['id']: b['tasks'] for b in benchmarks()}
    for rival in rivals():
        delta = month_number(rival['date']) - current
        if delta not in (0, 3):
            continue
        kind = 'rival' if delta == 0 else 'rumor'
        key = (kind, rival['date'], rival['name'])
        if key not in groups:
            digest = hashlib.sha256((rival['date'] + '|' + rival['name']).encode('utf-8')).hexdigest()[:16]
            groups[key] = {'id': kind + ':' + digest, 'date': date, 'kind': kind,
                           'title': rival['name'] if delta == 0 else 'Market rumor: ' + rival['name'],
                           'effect': 'News only', 'releaseDate': rival['date'],
                           'source': rival['source'], 'lines': [], 'benchmarks': [], 'tasks': []}
        entry = groups[key]
        entry['lines'].append(rival['line'])
        entry['benchmarks'].append(rival['benchmark'])
        entry['tasks'] = sorted(set(entry['tasks'] + mapping.get(rival['benchmark'], [])))
    result.extend(groups.values())
    return result


def milestone_events(state):
    date, fame = state['clock']['date'], state['resources']['fame']
    result = []

    catalog = {row[0]: (line, row) for line, row in rows('content/08_events_calendar.md')
               if row[0].startswith(('T', 'M')) and row[0][1:2].isdigit()}

    def add(identifier):
        line, row = catalog[identifier.split(':')[0]]
        result.append({'id': identifier, 'date': date, 'kind': 'milestone', 'title': row[2],
                       'effect': row[3], 'source': 'content/08_events_calendar.md', 'line': line})

    for threshold in (800, 1500, 2200):
        if fame >= threshold:
            add('T1:' + str(threshold))
    if fame >= 2500:
        add('T2')
    models = state['models']
    if any(m['sotaHype'] for m in models):
        add('M1')
    if any(m['quality'] >= 85 for m in models):
        add('M2')
    if any(m['release'] in ('License', 'Product') and m['artifacts'] >= 15 for m in models):
        add('M3')
    if state['resources']['cash'] < 0:
        add('M4')
    if any(d['size'] == 5 and d.get('combined', False) for d in state['data']['datasets']):
        add('M5')
    if any(m['quality'] >= 55 for m in models):
        add('M6')
    return result


def due_events(state):
    fired = set(state['world']['firedEvents'])
    return [e for e in scheduled_events(state['clock']['date']) + milestone_events(state)
            if e['id'] not in fired]


def draw_dilemma(state, kind):
    """Consume one seeded deck item only when persisting a new pending choice."""
    sizes = {'freelance': 6, 'research': 6, 'contract': 4, 'paper': 4}
    if kind not in sizes:
        raise ValueError('Unknown dilemma deck')
    count = state['counters']['dilemmas'][kind]
    cycle, position = divmod(count, sizes[kind])
    seed = state['meta']['runId'] + ':' + kind + ':' + str(cycle)
    deck = list(range(sizes[kind]))
    random.Random(int(hashlib.sha256(seed.encode('utf-8')).hexdigest(), 16)).shuffle(deck)
    state['counters']['dilemmas'][kind] += 1
    return deck[position]


def dataset_key(dataset):
    return (dataset['domain'], dataset['size'], dataset['quality'], dataset.get('taskId') or '')


def setup_key(model):
    return (model['architecture'], model['task'], model['scale'],
            tuple(sorted(dataset_key(d) for d in model['datasets'])))


def normalize_quality(raw):
    raw = Decimal(str(raw))
    if raw <= 70:
        return rounded(max(Decimal(0), raw), 1)
    return rounded(70 + 30 * (raw - 70) / (raw - 70 + 40), 1)


def architecture(identifier):
    for _, row in rows('content/01_architectures.md'):
        if row[0] == identifier:
            return {'base': int(row[2]), 'compute': int(row[3]), 'months': int(row[4]),
                    'size': int(row[5]), 'focus': list(map(int, row[6].split('/')))}
    raise ValueError('Unknown architecture')


def match(arch, task):
    table = list(rows('content/02_tasks_and_matching.md', 'Architecture × Task match matrix'))
    headers = table[0][1]
    column = headers.index(task)
    for _, row in table[1:]:
        if row[0].strip('*') == arch:
            return int(row[column])
    raise ValueError('Unknown architecture/task pairing')


def training_compute(tflops, focus, optimizer_multipliers=()):
    multiplier = math.prod(optimizer_multipliers) if hasattr(math, 'prod') else 1
    if not hasattr(math, 'prod'):
        for value in optimizer_multipliers:
            multiplier *= value
    if multiplier <= 0:
        raise ValueError('Optimizer multiplier must be positive')
    return float(Decimal(str(tflops)) * (Decimal('.8') + Decimal('.05') * focus[2])
                 / Decimal(str(multiplier)))


def create_project(state, declaration, is_llm=False):
    """Validate/snapshot a wizard; caller runs month 1 in the Action phase."""
    if any(state['active'].values()):
        raise ValueError('A commitment is already active')
    project = copy.deepcopy(declaration)
    owned = set(state['technology']['owned'])
    grants = {'NGRAM': 'NGRAM', 'BOW': 'BOW', 'EMB': 'EMB', 'RNN': 'RNN', 'LSTM': 'LSTM',
              'S2S': 'S2S', 'S2SA': 'ATTN', 'TRF': 'TRF', 'PTRF': 'PRET'}
    if is_llm:
        project.update(architecture='PTRF', task='LLM (general)', scale='Frontier')
        if 'SCALE' not in owned or state['resources']['cash'] < 20000:
            raise ValueError('LLM requires SCALE and $20000 upfront')
    arch = architecture(project['architecture'])
    if grants[project['architecture']] not in owned:
        raise ValueError('Architecture technology is not owned')
    cpu = project['architecture'] in ('NGRAM', 'BOW')
    if cpu and project['scale'] not in ('Tiny', 'Base'):
        raise ValueError('CPU architectures only support Tiny/Base')
    if project['scale'] == 'Frontier' and not (is_llm or state['world']['llmUnlocked']):
        raise ValueError('Frontier requires the LLM unlock')
    if project['task'] == 'LLM (general)' and not (is_llm or state['world']['llmUnlocked']):
        raise ValueError('General task requires the LLM unlock')
    # Validate task even before the first benchmark exists.
    match(project['architecture'], project['task'])
    if len(project['focus']) != 4 or any(type(x) is not int or x < 0 for x in project['focus']) or sum(project['focus']) != 10:
        raise ValueError('Focus must be four nonnegative integers summing to ten')
    if type(project['monthsTotal']) is not int or project['monthsTotal'] < 1:
        raise ValueError('Training months must be a positive integer')
    data = project['datasets']
    inventory = {d['id']: d for d in state['data']['datasets']}
    if not 1 <= len(data) <= 3 or len({d['id'] for d in data}) != len(data) or len({dataset_key(d) for d in data}) != len(data):
        raise ValueError('Mixture must contain distinct datasets and coverage')
    if any(inventory.get(d['id']) != d for d in data):
        raise ValueError('Select unchanged owned datasets')
    size, quality = min(5, max(d['size'] for d in data) + len(data) - 1), sum(d['quality'] for d in data) // len(data)
    if is_llm and (size < 5 or quality < 3):
        raise ValueError('LLM data requires combined Size 5 and Quality at least 3')
    parent_id = project.get('inheritModelId')
    if parent_id is not None:
        parent = next((m for m in state['models'] if m['id'] == parent_id), None)
        if project['architecture'] not in ('TRF', 'PTRF') or parent is None or parent['architecture'] not in ('TRF', 'PTRF'):
            raise ValueError('Inheritance requires a completed Transformer model')
    minimum = max(1, arch['months'] - int(parent_id is not None)
                  - int(project['architecture'] == 'PTRF' and 'FINE' in owned))
    if project['monthsTotal'] < (4 if is_llm else minimum):
        raise ValueError('Training duration is below the adjusted minimum')
    cloud = state['hardware']['cloudUnits']
    if cloud and month_number(state['clock']['date']) < month_number('2017-01'):
        raise ValueError('Cloud is not yet available')
    tflops = sum(h['tflops'] * h['quantity'] for h in state['hardware']['inventory']) + cloud * 1000
    vram = sum(h['vram'] * h['quantity'] for h in state['hardware']['inventory']) + cloud * 160
    vram -= sum(s['reservedVram'] for s in state['streams'])
    if not cpu and ('GPUT' not in owned or tflops < 100 or vram < SCALES[project['scale']][0]):
        raise ValueError('Insufficient neural technology, compute or VRAM')
    technology_bonus = 5 * int('BPE' in owned and project['architecture'] in ('S2S', 'S2SA', 'TRF', 'PTRF'))
    technology_bonus += 5 * int('FINE' in owned and project['architecture'] == 'PTRF')
    project.update(id='project-' + str(len(state['models']) + 1), inheritModelId=parent_id,
                   monthsElapsed=0, initialTrainingMonths=project['monthsTotal'],
                   trainingMonthsTotal=project['monthsTotal'], trainingMonthsElapsed=0,
                   engineeringLevel=min(5, 1 + state['counters']['models'] // 2),
                   technologyQualityBonus=technology_bonus, staffQualitySum=0,
                   completionResearchBonus=0, computeAccumulated=0, qualityModifier=0,
                   artifacts=0, dilemmaDone=False, phase='training', isLlm=is_llm,
                   targetBenchmarkIds=[b['id'] for b in benchmarks(project['task'], state['clock']['date'])]
                   or ['Internal QA Metric'])
    project['fixedComputeRequirement'] = fixed_requirement(project)
    multipliers = [p['effects']['computeMultiplier'] for p in state['team']['employees']]
    if is_llm and training_compute(tflops, project['focus'], multipliers) * project['monthsTotal'] < project['fixedComputeRequirement']:
        raise ValueError('Projected LLM compute is insufficient')
    if is_llm:
        state['resources']['cash'] -= 20000
    state['active']['project'] = project
    return project


def advance_project(state):
    project = state['active']['project']
    if project is None or project['monthsElapsed'] >= project['monthsTotal']:
        raise ValueError('Project is absent or needs its completion/fine-tuning choice')
    cpu = project['architecture'] in ('NGRAM', 'BOW')
    cloud = state['hardware']['cloudUnits']
    tflops = sum(h['tflops'] * h['quantity'] for h in state['hardware']['inventory']) + cloud * 1000
    vram = sum(h['vram'] * h['quantity'] for h in state['hardware']['inventory']) + cloud * 160
    vram -= sum(s['reservedVram'] for s in state['streams'])
    if not cpu and vram < SCALES[project['scale']][0]:
        raise ValueError('Training/fine-tuning VRAM must remain available')
    project['monthsElapsed'] += 1
    if project['phase'] == 'fine-tuning':
        project['artifacts'] = max(0, project['artifacts'] - 8 - 3 * project['engineeringLevel'] - project['focus'][3])
    else:
        if project['trainingMonthsElapsed'] >= project['trainingMonthsTotal']:
            raise ValueError('No training months remain')
        project['trainingMonthsElapsed'] += 1
        multipliers = [p['effects']['computeMultiplier'] for p in state['team']['employees']]
        project['computeAccumulated'] += training_compute(tflops, project['focus'], multipliers)
        project['staffQualitySum'] += sum(p['effects']['qualityBonus'] for p in state['team']['employees'])
        project['artifacts'] += max(1, 4 + architecture(project['architecture'])['base'] // 10
                                    - project['engineeringLevel'] - project['focus'][3] // 2)
    return project


def extend_project(state, fine_tuning=False):
    project = state['active']['project']
    if project is None:
        raise ValueError('No active project')
    if fine_tuning:
        if project['monthsElapsed'] != project['monthsTotal'] or project['artifacts'] <= 0:
            raise ValueError('Fine-tuning requires the completed raw training checkpoint')
        project['phase'] = 'fine-tuning'
    else:
        if project['phase'] != 'training':
            raise ValueError('Cannot add training to fine-tuning phase')
        project['trainingMonthsTotal'] += 1
    project['monthsTotal'] += 1
    return project


def project_midpoint(project, date):
    if project['dilemmaDone'] or project['initialTrainingMonths'] < 2 or project['trainingMonthsElapsed'] != project['initialTrainingMonths'] // 2:
        return None
    project['dilemmaDone'] = True
    targets = [b for b in benchmarks(project['task'], date) if b['id'] in project['targetBenchmarkIds']]
    data = project['datasets']
    direct = max([sum(d['domain'] in b['domains'] for d in data) for b in targets] or [0])
    fit = 3 if direct >= math.ceil(len(data) / 2) else 0 if not targets or any(
        d['domain'] == 'web-mixed' or d.get('taskId') == project['task'] for d in data) else -3
    focus = max(0, 10 - sum(abs(x - y) for x, y in zip(project['focus'], architecture(project['architecture'])['focus'])))
    synergy = match(project['architecture'], project['task']) + fit + focus
    return 'breakthrough' if synergy >= 16 else 'complication' if synergy <= 8 else 'smooth'


def complete_project(state, release_raw=False):
    project = state['active']['project']
    if project is None or project['monthsElapsed'] != project['monthsTotal']:
        raise ValueError('Project is not complete')
    if project['artifacts'] and not release_raw:
        raise ValueError('Choose raw completion or continue fine-tuning')
    result = project_quality(project, state['models'], state['clock']['date'])
    model = {k: copy.deepcopy(project[k]) for k in ('name', 'architecture', 'scale', 'task', 'datasets', 'focus', 'artifacts', 'isLlm')}
    model.update({k: result[k] for k in ('quality', 'benchmarks', 'targetBenchmarkIds', 'noveltyMultiplier', 'sotaHype')})
    model.update(id='M' + str(len(state['models']) + 1), completedDate=state['clock']['date'],
                 release='Shelved', releaseDate=None, analyzed=False, published=False, codePublic=False)
    state['resources']['researchPoints'] += result['completionResearchPoints']
    state['counters']['models'] += int(result['engineeringProgress'])
    state['models'].append(model)
    if project['isLlm']:
        state['world']['llmUnlocked'] = True
    state['active']['project'] = None
    state['hardware']['cloudUnits'] = 0
    return model


def cancel_commitment(state, kind):
    if kind not in ('project', 'contract', 'paper') or state['active'][kind] is None:
        raise ValueError('No matching commitment to cancel')
    state['active'][kind] = None
    state['resources']['fame'] = max(0, state['resources']['fame'] - (200 if kind == 'contract' else 100))
    if kind == 'project':
        state['hardware']['cloudUnits'] = 0


def complete_paper(state):
    paper = state['active']['paper']
    if paper is None or paper['monthsElapsed'] != paper['monthsTotal']:
        raise ValueError('Paper is not complete')
    model = next(m for m in state['models'] if m['id'] == paper['modelId'])
    if model['quality'] < 60:
        raise ValueError('Paper requires Q at least 60')
    if model['published']:
        raise ValueError('Paper reward already claimed')
    novelty = model['noveltyMultiplier']
    state['resources']['researchPoints'] += rounded((model['quality'] * 40 * paper['researchMultiplier'] + paper['researchBonus']) * novelty)
    state['resources']['fame'] = min(5000, state['resources']['fame'] + rounded((300 + paper['completionFameBonus']) * novelty))
    model.update(published=True, codePublic=True)
    state['active']['paper'] = None


def demand(task, date, effects=()):
    year = int(date[:4])
    column = 1 if year <= 2014 else 2 if year <= 2016 else 3 if year <= 2018 else 4 if year <= 2020 else 5
    value = None
    for _, row in rows('content/03_market_demand.md'):
        if row[0] == task:
            value = int(row[column]) if row[column].isdigit() else None
    if value is None:
        raise ValueError('Task has no demand in this era')
    for effect in effects:
        if effect['kind'] == 'demand' and effect['target'] == task and effect['starts'] <= date \
                and (effect['ends'] is None or date <= effect['ends']):
            value = effect['value']
    return value


def quote_release(state, model_id, release):
    model = next(m for m in state['models'] if m['id'] == model_id)
    if model['release'] != 'Shelved':
        raise ValueError('Model already released')
    if release not in ('Open-source', 'License', 'Product', 'Shelved'):
        raise ValueError('Unknown release choice')
    paper = state['active']['paper']
    if release in ('License', 'Product') and (model['quality'] < 40 or model['codePublic'] or model['published']
                                             or paper is not None and paper['modelId'] == model_id):
        raise ValueError('This model cannot be commercially released')
    q, novelty = model['quality'], model['noveltyMultiplier']
    base_fame = 800 if q >= 85 else 500 if q >= 70 else 300 if q >= 55 else 100 if q >= 40 else -100
    date = state['clock']['date']
    window = market_window(model['task'], date)
    sota = current_sota(model, date)
    fame = rounded(base_fame * novelty) if base_fame > 0 else base_fame
    cash, rp, monthly, reserved = 0, 0, 0, 0
    if release == 'Shelved':
        fame = 0
    elif release == 'Open-source':
        fame = rounded(base_fame * 1.5 * novelty) if base_fame > 0 else base_fame
        rp = rounded(200 * novelty)
    else:
        segment = SCALES[model['scale']][4]
        income_factor = demand(model['task'], date, state['world']['effects']) * segment * window['multiplier'] * novelty
        income_factor *= 1.25 if sota and window['phase'] != 'First-Mover' else 1
        for effect in state['world']['effects']:
            target_match = effect['target'] in ('all', model['task']) or (
                effect['target'] == 'belowTRF' and model['architecture'] not in ('TRF', 'PTRF'))
            kind_match = effect['kind'] in ('commercial', 'license' if release == 'License' else 'product')
            if target_match and kind_match and effect['starts'] <= date and (effect['ends'] is None or date <= effect['ends']):
                income_factor *= effect['value']
        if window['phase'] == 'Clash' and sota:
            fame += rounded(500 * novelty)
        if release == 'License':
            cash = rounded(q * 90 * income_factor)
        else:
            if state['resources']['fame'] < 1000 or q < 55:
                raise ValueError('Product requires Fame 1000 and Q 55')
            reserved = 0 if model['architecture'] in ('NGRAM', 'BOW') else SCALES[model['scale']][0] / 2
            available = sum(h['quantity'] * h['vram'] for h in state['hardware']['inventory']) - sum(s['reservedVram'] for s in state['streams'])
            if available < reserved:
                raise ValueError('Product needs unreserved installed inference VRAM')
            monthly = rounded(q * 25 * income_factor * max(.5, 1 - model['artifacts'] / 40))
    return {'cash': cash, 'researchPoints': rp, 'fame': fame, 'monthlyCash': monthly,
            'reservedVram': reserved, 'marketPhase': window['phase'], 'currentSota': sota}


def release_model(state, model_id, release):
    quote = quote_release(state, model_id, release)
    model = next(m for m in state['models'] if m['id'] == model_id)
    if release == 'Shelved':
        return quote
    state['resources']['cash'] += quote['cash']
    state['resources']['researchPoints'] += quote['researchPoints']
    state['resources']['fame'] = max(0, min(5000, state['resources']['fame'] + quote['fame']))
    model.update(release=release, releaseDate=state['clock']['date'])
    if release == 'Open-source':
        model['codePublic'] = True
    if release == 'Product':
        state['streams'].append({'id': 'stream-' + model_id, 'modelId': model_id,
                                 'monthlyCash': quote['monthlyCash'], 'monthsRemaining': 8,
                                 'reservedVram': quote['reservedVram'], 'task': model['task'],
                                 'quality': model['quality']})
    return quote


def resolve_term_sheet(state, model_id, accept):
    model = next(m for m in state['models'] if m['id'] == model_id)
    if state['ending']['winAwarded'] or model.get('termSheetResolved'):
        raise ValueError('Term Sheet has already been resolved')
    targets = [b['score'] for b in model['benchmarks'] if b['id'] in model['targetBenchmarkIds']]
    if not model['isLlm'] or model['quality'] < 80 or not targets or min(targets) < 65:
        raise ValueError('LLM does not qualify for the Term Sheet')
    model['termSheetResolved'] = True
    if accept:
        state['resources']['cash'] += 2000000
        state['counters']['capitalRaised'] += 2000000
        state['ending']['winAwarded'] = True
    else:
        state['resources']['fame'] = min(5000, state['resources']['fame'] + rounded(500 * model['noveltyMultiplier']))


def product_logs(state, model_id):
    model = next(m for m in state['models'] if m['id'] == model_id)
    stream = next((s for s in state['streams'] if s['modelId'] == model_id), None)
    if stream is None or stream['monthsRemaining'] != 0 or model.get('logsCollected'):
        raise ValueError('Logs require normal expiry and can be collected only once')
    largest = max(enumerate(model['datasets']), key=lambda p: (p[1]['size'], -p[0]))[1]
    quality = 3 if model['quality'] >= 75 else 2
    dataset = {'id': 'D' + str(state['data']['nextDatasetId']), 'name': 'User Logs - ' + model['task'],
               'domain': largest['domain'], 'size': quality, 'quality': quality,
               'sourceId': model_id, 'taskId': model['task']}
    state['data']['nextDatasetId'] += 1
    state['data']['datasets'].append(dataset)
    model['logsCollected'] = True
    return dataset


def complete_contract(state):
    contract = state['active']['contract']
    if contract is None or contract['monthsElapsed'] != contract['monthsTotal']:
        raise ValueError('Contract is not complete')
    if contract['id'] in state['contractsDone']:
        raise ValueError('Contract reward already claimed')
    catalog = next(row for _, row in rows('content/06_contracts.md') if row[0] == contract['id'])
    base = int(catalog[6].replace('$', '').replace(',', ''))
    bonus = 1.2 if catalog[7] in state['technology']['owned'] else 1
    pay = rounded(base * bonus + base * contract['payModifierPercent'] / 100)
    state['resources']['cash'] += pay
    state['resources']['fame'] = max(0, min(5000, state['resources']['fame'] + 100 + contract['completionFameBonus']))
    state['counters']['models'] += 1
    state['contractsDone'].append(contract['id'])
    client = next(row for _, row in rows('content/06_contracts.md', 'Client dataset on completion')
                  if row[0] == contract['id'])
    dataset = {'id': 'D' + str(state['data']['nextDatasetId']), 'name': 'Client Logs - ' + contract['id'],
               'domain': client[2], 'taskId': client[1], 'size': 2, 'quality': 3, 'sourceId': contract['id']}
    state['data']['nextDatasetId'] += 1
    state['data']['datasets'].append(dataset)
    state['active']['contract'] = None
    return {'cash': pay, 'dataset': dataset}


def freeze_campaign(state):
    if not state['ending']['winAwarded']:
        raise ValueError('Campaign has not been won')
    if state['ending']['lastResult'] is not None:
        return state['ending']['lastResult']
    score = campaign_score(state)
    titles = []
    for _, row in rows('content/09_scoring_titles.md'):
        if row[0] in ('Score', 'Bankruptcy'):
            continue
        lower = 0 if row[0].startswith('<') else int(re.search(r'\d+', row[0]).group())
        titles.append((lower, row[1]))
    title = max((entry for entry in titles if score >= entry[0]), key=lambda entry: entry[0])[1]
    state['ending']['lastResult'] = dict(state['clock'], score=score, title=title)
    return state['ending']['lastResult']


def fixed_requirement(project):
    base = 60000 if project['isLlm'] else architecture(project['architecture'])['compute'] * SCALES[project['scale']][1]
    base *= (1, 1.25, 1.5)[len(project['datasets']) - 1]
    if project['inheritModelId'] is not None:
        base *= .6
    return math.ceil(base)


def current_sota(model, date):
    targets = set(model['targetBenchmarkIds'])
    pairs = [(score['score'], rival_at(score['id'], date)) for score in model['benchmarks']
             if score['id'] in targets]
    valid = [(score, rival['score']) for score, rival in pairs if rival is not None]
    return bool(valid) and sum(score > rival for score, rival in valid) >= math.ceil(len(valid) / 2) \
        and all(score >= rival - 10 for score, rival in valid)


def project_quality(project, models, date):
    arch = architecture(project['architecture'])
    cpu = project['architecture'] in ('NGRAM', 'BOW')
    if cpu and project['scale'] not in ('Tiny', 'Base'):
        raise ValueError('CPU architectures only support Tiny/Base')
    data = project['datasets']
    if not 1 <= len(data) <= 3 or len({d['id'] for d in data}) != len(data) or len({dataset_key(d) for d in data}) != len(data):
        raise ValueError('Mixture contains duplicate dataset IDs or coverage')
    repeats = sum(setup_key(m) == setup_key(project) for m in models)
    size, dq = min(5, max(d['size'] for d in data) + len(data) - 1), sum(d['quality'] for d in data) // len(data)
    req, compute = project['fixedComputeRequirement'], project['computeAccumulated']
    cs = 5 if req == 0 else 8 if compute >= 2 * req else 5 if compute >= req else -5 if compute >= req / 2 else -15
    fs = max(0, 10 - sum(abs(x - y) for x, y in zip(project['focus'], arch['focus'])))
    scale_mod = (0 if project['scale'] == 'Tiny' else 3) if cpu else SCALES[project['scale']][3]
    base = arch['base'] + scale_mod + 2 * dq + (5 if size >= arch['size'] else 0)
    base += (-20 if size < SCALES[project['scale']][2] else 0) + cs + fs + 2 * project['engineeringLevel']
    base += project['technologyQualityBonus'] + project['staffQualitySum'] / max(1, project['trainingMonthsElapsed'])
    base += project['qualityModifier'] - project['artifacts'] // 2
    base -= 15 if len(data) > 1 and project['architecture'] not in ('TRF', 'PTRF') else 0
    base -= 6 * min(3, repeats)
    available = benchmarks(project['task'], date)
    targets = [b['id'] for b in available] if project['isLlm'] else project['targetBenchmarkIds']
    if not targets:
        targets = ['Internal QA Metric']
    if 'Internal QA Metric' in targets or not available:
        available.append({'id': 'Internal QA Metric', 'domains': []})
    if not set(targets).issubset({b['id'] for b in available}):
        raise ValueError('Target benchmark is unavailable')
    parent = next((m for m in models if m['id'] == project['inheritModelId']), None)
    if project['inheritModelId'] is not None and parent is None:
        raise ValueError('Inherited model missing')
    scores = []
    for benchmark in available:
        fits = [12 if d['domain'] in benchmark['domains'] else 3 if d['domain'] == 'web-mixed'
                or d.get('taskId') == project['task'] else -10 for d in data]
        fit = 0 if benchmark['id'] == 'Internal QA Metric' else sum(f * d['size'] for f, d in zip(fits, data)) / sum(d['size'] for d in data)
        score = normalize_quality(base + match(project['architecture'], project['task']) + fit)
        if parent is not None:
            score = rounded(min(score, parent['quality'] + 15), 1)
        scores.append({'id': benchmark['id'], 'score': score, 'target': benchmark['id'] in targets,
                       'rival': rival_at(benchmark['id'], date)})
    target_scores = [b['score'] for b in scores if b['target']]
    result = {'quality': rounded(sum(Decimal(str(x)) for x in target_scores) / len(target_scores), 1),
              'benchmarks': scores, 'targetBenchmarkIds': targets,
              'noveltyMultiplier': max(.25, .5 ** repeats), 'engineeringProgress': repeats == 0}
    result['sotaHype'] = current_sota(result, date)
    result['completionResearchPoints'] = rounded((math.floor(result['quality']) * 15
                                                  + project['completionResearchBonus']) * result['noveltyMultiplier'])
    return result


def market_window(task, date):
    mapping = {b['id']: b['tasks'] for b in benchmarks()}
    dates = sorted({r['date'] for r in rivals() if task in mapping.get(r['benchmark'], [])})
    now = month_number(date)
    upcoming = [d for d in dates if 1 <= month_number(d) - now <= 3]
    if upcoming:
        return {'phase': 'First-Mover', 'multiplier': 1.5}
    past = [d for d in dates if month_number(d) <= now]
    age = now - month_number(past[-1]) if past else None
    if age is not None and age <= 1:
        return {'phase': 'Clash', 'multiplier': 1}
    if age is not None and age <= 7:
        return {'phase': 'Saturated', 'multiplier': .75}
    return {'phase': 'Normal', 'multiplier': 1}


def campaign_score(state):
    if state['ending']['bankruptcy']:
        return 0
    distinct = len({setup_key(m) for m in state['models']}) + len(state['contractsDone'])
    best = max([m['quality'] for m in state['models']] or [0])
    earned = max(0, state['resources']['cash'] - state['counters']['capitalRaised'])
    won = state['ending']['winAwarded']
    score = 3 * state['resources']['fame'] + 100 * best + 400 * min(10, distinct) + 100 * min(50, earned // 1000)
    if won:
        score += 4000 + max(0, 6000 - 75 * (state['clock']['turn'] - 1))
    if any(m['isLlm'] and m['releaseDate'] is not None and m['releaseDate'].startswith('2019-') for m in state['models']):
        score += 1000
    return rounded(score)
