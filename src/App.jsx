import React, { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { BLANK, createTape, runLogic } from './Engine';
import Tape from './Tape';

const PROBLEMS = {
  ANBN: {
    id: 'ANBN',
    title: 'Equal a-b Blocks',
    formal: 'L = { a^n b^n | n >= 1 }',
    description: 'Marks one a and one b on each pass, then verifies the tape is fully matched.',
    alphabet: ['a', 'b'],
    sampleInput: 'aaabbb',
    startState: 'q0',
    acceptState: 'q_accept',
    rejectState: 'q_reject',
    layout: {
      q0: { x: 110, y: 110 },
      q1: { x: 320, y: 80 },
      q2: { x: 525, y: 110 },
      q3: { x: 320, y: 255 },
      q4: { x: 525, y: 255 },
      q_accept: { x: 730, y: 110 },
      q_reject: { x: 730, y: 255 },
    },
    rules: [
      { s: 'q0', r: 'X', w: 'X', m: 'R', n: 'q0' },
      { s: 'q0', r: 'a', w: 'X', m: 'R', n: 'q1' },
      { s: 'q0', r: 'Y', w: 'Y', m: 'R', n: 'q4' },
      { s: 'q0', r: 'b', w: 'b', m: 'R', n: 'q_reject' },
      { s: 'q0', r: BLANK, w: BLANK, m: 'R', n: 'q_reject' },

      { s: 'q1', r: 'a', w: 'a', m: 'R', n: 'q1' },
      { s: 'q1', r: 'X', w: 'X', m: 'R', n: 'q1' },
      { s: 'q1', r: 'Y', w: 'Y', m: 'R', n: 'q1' },
      { s: 'q1', r: 'b', w: 'Y', m: 'L', n: 'q3' },
      { s: 'q1', r: BLANK, w: BLANK, m: 'R', n: 'q_reject' },

      { s: 'q3', r: 'a', w: 'a', m: 'L', n: 'q3' },
      { s: 'q3', r: 'b', w: 'b', m: 'L', n: 'q3' },
      { s: 'q3', r: 'X', w: 'X', m: 'L', n: 'q3' },
      { s: 'q3', r: 'Y', w: 'Y', m: 'L', n: 'q3' },
      { s: 'q3', r: BLANK, w: BLANK, m: 'R', n: 'q0' },

      { s: 'q4', r: 'Y', w: 'Y', m: 'R', n: 'q4' },
      { s: 'q4', r: BLANK, w: BLANK, m: 'R', n: 'q_accept' },
      { s: 'q4', r: 'a', w: 'a', m: 'R', n: 'q_reject' },
      { s: 'q4', r: 'b', w: 'b', m: 'R', n: 'q_reject' },
      { s: 'q4', r: 'X', w: 'X', m: 'R', n: 'q_reject' },
    ],
  },
  PALINDROME: {
    id: 'PALINDROME',
    title: 'Binary Palindrome',
    formal: 'L = { w | w = reverse(w), w in {0,1}* }',
    description: 'Pairs the outermost symbols, marks them, and walks inward until the string is exhausted.',
    alphabet: ['0', '1'],
    sampleInput: '1001',
    startState: 'q0',
    acceptState: 'q_accept',
    rejectState: 'q_reject',
    layout: {
      q0: { x: 105, y: 140 },
      q_seek0: { x: 300, y: 65 },
      q_seek1: { x: 300, y: 220 },
      q_match0: { x: 505, y: 65 },
      q_match1: { x: 505, y: 220 },
      q_back: { x: 685, y: 140 },
      q_accept: { x: 885, y: 75 },
      q_reject: { x: 885, y: 215 },
    },
    rules: [
      { s: 'q0', r: 'X', w: 'X', m: 'R', n: 'q0' },
      { s: 'q0', r: 'Y', w: 'Y', m: 'R', n: 'q0' },
      { s: 'q0', r: '0', w: 'X', m: 'R', n: 'q_seek0' },
      { s: 'q0', r: '1', w: 'Y', m: 'R', n: 'q_seek1' },
      { s: 'q0', r: BLANK, w: BLANK, m: 'R', n: 'q_accept' },

      { s: 'q_seek0', r: '0', w: '0', m: 'R', n: 'q_seek0' },
      { s: 'q_seek0', r: '1', w: '1', m: 'R', n: 'q_seek0' },
      { s: 'q_seek0', r: 'X', w: 'X', m: 'R', n: 'q_seek0' },
      { s: 'q_seek0', r: 'Y', w: 'Y', m: 'R', n: 'q_seek0' },
      { s: 'q_seek0', r: BLANK, w: BLANK, m: 'L', n: 'q_match0' },

      { s: 'q_seek1', r: '0', w: '0', m: 'R', n: 'q_seek1' },
      { s: 'q_seek1', r: '1', w: '1', m: 'R', n: 'q_seek1' },
      { s: 'q_seek1', r: 'X', w: 'X', m: 'R', n: 'q_seek1' },
      { s: 'q_seek1', r: 'Y', w: 'Y', m: 'R', n: 'q_seek1' },
      { s: 'q_seek1', r: BLANK, w: BLANK, m: 'L', n: 'q_match1' },

      { s: 'q_match0', r: 'X', w: 'X', m: 'L', n: 'q_match0' },
      { s: 'q_match0', r: 'Y', w: 'Y', m: 'L', n: 'q_match0' },
      { s: 'q_match0', r: '0', w: 'X', m: 'L', n: 'q_back' },
      { s: 'q_match0', r: '1', w: '1', m: 'R', n: 'q_reject' },
      { s: 'q_match0', r: BLANK, w: BLANK, m: 'R', n: 'q_accept' },

      { s: 'q_match1', r: 'X', w: 'X', m: 'L', n: 'q_match1' },
      { s: 'q_match1', r: 'Y', w: 'Y', m: 'L', n: 'q_match1' },
      { s: 'q_match1', r: '1', w: 'Y', m: 'L', n: 'q_back' },
      { s: 'q_match1', r: '0', w: '0', m: 'R', n: 'q_reject' },
      { s: 'q_match1', r: BLANK, w: BLANK, m: 'R', n: 'q_accept' },

      { s: 'q_back', r: '0', w: '0', m: 'L', n: 'q_back' },
      { s: 'q_back', r: '1', w: '1', m: 'L', n: 'q_back' },
      { s: 'q_back', r: 'X', w: 'X', m: 'L', n: 'q_back' },
      { s: 'q_back', r: 'Y', w: 'Y', m: 'L', n: 'q_back' },
      { s: 'q_back', r: BLANK, w: BLANK, m: 'R', n: 'q0' },
    ],
  },
  EVEN_ONES: {
    id: 'EVEN_ONES',
    title: 'Even Number of 1s',
    formal: 'L = { w in {0,1}* | count(1) is even }',
    description: 'Scans once from left to right and toggles parity every time a 1 is seen.',
    alphabet: ['0', '1'],
    sampleInput: '101100',
    startState: 'q_even',
    acceptState: 'q_accept',
    rejectState: 'q_reject',
    layout: {
      q_even: { x: 155, y: 150 },
      q_odd: { x: 425, y: 150 },
      q_accept: { x: 695, y: 90 },
      q_reject: { x: 695, y: 235 },
    },
    rules: [
      { s: 'q_even', r: '0', w: '0', m: 'R', n: 'q_even' },
      { s: 'q_even', r: '1', w: '1', m: 'R', n: 'q_odd' },
      { s: 'q_even', r: BLANK, w: BLANK, m: 'R', n: 'q_accept' },
      { s: 'q_odd', r: '0', w: '0', m: 'R', n: 'q_odd' },
      { s: 'q_odd', r: '1', w: '1', m: 'R', n: 'q_even' },
      { s: 'q_odd', r: BLANK, w: BLANK, m: 'R', n: 'q_reject' },
    ],
  },
  A_STAR_B_STAR: {
    id: 'A_STAR_B_STAR',
    title: 'Ordered a*b*',
    formal: 'L = { a^m b^n | m,n >= 0 }',
    description: 'Accepts strings with any number of a symbols followed by any number of b symbols, with no a after a b.',
    alphabet: ['a', 'b'],
    sampleInput: 'aaabbb',
    startState: 'q_a',
    acceptState: 'q_accept',
    rejectState: 'q_reject',
    layout: {
      q_a: { x: 150, y: 170 },
      q_b: { x: 420, y: 170 },
      q_accept: { x: 700, y: 95 },
      q_reject: { x: 700, y: 245 },
    },
    rules: [
      { s: 'q_a', r: 'a', w: 'a', m: 'R', n: 'q_a' },
      { s: 'q_a', r: 'b', w: 'b', m: 'R', n: 'q_b' },
      { s: 'q_a', r: BLANK, w: BLANK, m: 'R', n: 'q_accept' },
      { s: 'q_b', r: 'b', w: 'b', m: 'R', n: 'q_b' },
      { s: 'q_b', r: 'a', w: 'a', m: 'R', n: 'q_reject' },
      { s: 'q_b', r: BLANK, w: BLANK, m: 'R', n: 'q_accept' },
    ],
  },
  ENDS_01: {
    id: 'ENDS_01',
    title: 'Ends With 01',
    formal: 'L = { w in {0,1}* | w ends with 01 }',
    description: 'Tracks the last two relevant symbols and accepts only if the string finishes with the suffix 01.',
    alphabet: ['0', '1'],
    sampleInput: '10101',
    startState: 'q_start',
    acceptState: 'q_accept',
    rejectState: 'q_reject',
    layout: {
      q_start: { x: 120, y: 170 },
      q_seen0: { x: 365, y: 90 },
      q_seen1: { x: 365, y: 245 },
      q_accept: { x: 640, y: 90 },
      q_reject: { x: 640, y: 245 },
    },
    rules: [
      { s: 'q_start', r: '0', w: '0', m: 'R', n: 'q_seen0' },
      { s: 'q_start', r: '1', w: '1', m: 'R', n: 'q_seen1' },
      { s: 'q_start', r: BLANK, w: BLANK, m: 'R', n: 'q_reject' },
      { s: 'q_seen0', r: '0', w: '0', m: 'R', n: 'q_seen0' },
      { s: 'q_seen0', r: '1', w: '1', m: 'R', n: 'q_accept' },
      { s: 'q_seen0', r: BLANK, w: BLANK, m: 'R', n: 'q_reject' },
      { s: 'q_seen1', r: '0', w: '0', m: 'R', n: 'q_seen0' },
      { s: 'q_seen1', r: '1', w: '1', m: 'R', n: 'q_seen1' },
      { s: 'q_seen1', r: BLANK, w: BLANK, m: 'R', n: 'q_reject' },
      { s: 'q_accept', r: '0', w: '0', m: 'R', n: 'q_seen0' },
      { s: 'q_accept', r: '1', w: '1', m: 'R', n: 'q_seen1' },
      { s: 'q_accept', r: BLANK, w: BLANK, m: 'R', n: 'q_accept' },
    ],
  },
  BINARY_MOD3: {
    id: 'BINARY_MOD3',
    title: 'Binary Multiple of 3',
    formal: 'L = { w in {0,1}* | value(w) mod 3 = 0 }',
    description: 'Keeps the running remainder modulo 3 while scanning the binary input from left to right.',
    alphabet: ['0', '1'],
    sampleInput: '110',
    startState: 'q0',
    acceptState: 'q_accept',
    rejectState: 'q_reject',
    layout: {
      q0: { x: 140, y: 170 },
      q1: { x: 385, y: 85 },
      q2: { x: 385, y: 255 },
      q_accept: { x: 670, y: 95 },
      q_reject: { x: 670, y: 245 },
    },
    rules: [
      { s: 'q0', r: '0', w: '0', m: 'R', n: 'q0' },
      { s: 'q0', r: '1', w: '1', m: 'R', n: 'q1' },
      { s: 'q0', r: BLANK, w: BLANK, m: 'R', n: 'q_accept' },
      { s: 'q1', r: '0', w: '0', m: 'R', n: 'q2' },
      { s: 'q1', r: '1', w: '1', m: 'R', n: 'q0' },
      { s: 'q1', r: BLANK, w: BLANK, m: 'R', n: 'q_reject' },
      { s: 'q2', r: '0', w: '0', m: 'R', n: 'q1' },
      { s: 'q2', r: '1', w: '1', m: 'R', n: 'q2' },
      { s: 'q2', r: BLANK, w: BLANK, m: 'R', n: 'q_reject' },
    ],
  },
};

const SPEED_MS = 650;

const buildSession = (problem, rawInput) => ({
  tape: createTape(rawInput),
  head: 0,
  state: problem.startState,
  steps: 0,
  history: [],
  verdict: 'pending',
  halted: false,
  haltReason: 'Ready to simulate',
  lastRule: null,
});

const displaySymbol = (symbol) => (symbol === BLANK ? '□' : symbol);

const formatRuleLabel = (rule) => `${displaySymbol(rule.r)}→${displaySymbol(rule.w)}, ${rule.m}`;

const summarizeProblem = (problem) => {
  const states = Object.keys(problem.layout).length;
  return {
    states,
    transitions: problem.rules.length,
    alphabet: problem.alphabet.join(', '),
  };
};

const validateInput = (problem, value) => {
  const symbols = [...value];
  const invalidSymbols = [...new Set(symbols.filter((symbol) => !problem.alphabet.includes(symbol)))];

  return {
    isValid: invalidSymbols.length === 0,
    invalidSymbols,
  };
};

const groupRules = (rules) => {
  const map = new Map();

  rules.forEach((rule) => {
    const key = `${rule.s}|${rule.n}`;
    const group = map.get(key) ?? { from: rule.s, to: rule.n, rules: [] };
    group.rules.push(rule);
    map.set(key, group);
  });

  return [...map.values()].map((group) => ({
    ...group,
    label: group.rules.map(formatRuleLabel).join('  •  '),
  }));
};

const getDiagramViewBox = (layout) => {
  const points = Object.values(layout);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const padding = 120;
  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;

  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
};

const App = () => {
  const [problemKey, setProblemKey] = useState('ANBN');
  const [inputValue, setInputValue] = useState(PROBLEMS.ANBN.sampleInput);
  const [session, setSession] = useState(() => buildSession(PROBLEMS.ANBN, PROBLEMS.ANBN.sampleInput));
  const [isRunning, setIsRunning] = useState(false);

  const problem = PROBLEMS[problemKey];
  const summary = useMemo(() => summarizeProblem(problem), [problem]);
  const groupedEdges = useMemo(() => groupRules(problem.rules), [problem]);
  const validation = useMemo(() => validateInput(problem, inputValue), [problem, inputValue]);
  const canRun = validation.isValid && !session.halted;

  const resetSession = (nextProblem = problem, nextInput = inputValue) => {
    setIsRunning(false);
    setSession(buildSession(nextProblem, nextInput));
  };

  const handleProblemSelect = (nextKey) => {
    const nextProblem = PROBLEMS[nextKey];
    setProblemKey(nextKey);
    setInputValue(nextProblem.sampleInput);
    setIsRunning(false);
    setSession(buildSession(nextProblem, nextProblem.sampleInput));
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    setIsRunning(false);
    setSession(buildSession(problem, value));
  };

  const advanceStep = useEffectEvent(() => {
    if (!validation.isValid) {
      setIsRunning(false);
      return;
    }

    setSession((current) => {
      if (current.halted) {
        return current;
      }

      if (current.state === problem.acceptState) {
        setIsRunning(false);
        return {
          ...current,
          verdict: 'accept',
          halted: true,
          haltReason: 'Input accepted',
        };
      }

      if (current.state === problem.rejectState) {
        setIsRunning(false);
        return {
          ...current,
          verdict: 'reject',
          halted: true,
          haltReason: 'Input rejected',
        };
      }

      const result = runLogic(current.tape, current.head, current.state, problem.rules);

      if (!result) {
        setIsRunning(false);
        return {
          ...current,
          verdict: 'reject',
          halted: true,
          haltReason: 'No valid transition from the current configuration',
        };
      }

      const nextVerdict =
        result.state === problem.acceptState
          ? 'accept'
          : result.state === problem.rejectState
            ? 'reject'
            : 'pending';

      return {
        ...current,
        tape: result.tape,
        head: result.head,
        state: result.state,
        steps: current.steps + 1,
        verdict: nextVerdict,
        halted: nextVerdict !== 'pending',
        haltReason:
          nextVerdict === 'accept'
            ? 'Input accepted'
            : nextVerdict === 'reject'
              ? 'Input rejected'
              : 'Simulation running',
        lastRule: result.rule,
        history: [
          ...current.history,
          {
            step: current.steps + 1,
            from: current.state,
            to: result.state,
            read: result.rule.r,
            write: result.rule.w,
            move: result.rule.m,
          },
        ].slice(-10),
      };
    });
  });

  useEffect(() => {
    if (!isRunning || session.halted) {
      return undefined;
    }

    const timer = setInterval(() => {
      advanceStep();
    }, SPEED_MS);

    return () => clearInterval(timer);
  }, [advanceStep, isRunning, session.halted]);

  useEffect(() => {
    if (session.halted) {
      setIsRunning(false);
    }
  }, [session.halted]);

  useEffect(() => {
    if (!validation.isValid) {
      setIsRunning(false);
    }
  }, [validation.isValid]);

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.18),_transparent_25%),linear-gradient(180deg,_#06131f,_#02060c_58%,_#010307)] px-4 py-6 text-slate-100 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-8">
        <header className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/6 px-7 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-10 md:py-10">
          <div className="absolute inset-y-0 right-0 w-72 bg-[radial-gradient(circle,_rgba(56,189,248,0.22),_transparent_68%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200">
                Decidable Turing Machine Lab
              </p>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                  Interactive language dashboard with animated simulation.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  Choose a formal-language problem, enter your string, and watch the machine decide whether the input is accepted or rejected while the active transition lights up in the state diagram.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <MetricCard label="Problems" value={String(Object.keys(PROBLEMS).length).padStart(2, '0')} tone="cyan" />
              <MetricCard label="States" value={String(summary.states).padStart(2, '0')} tone="emerald" />
              <MetricCard label="Transitions" value={String(summary.transitions).padStart(2, '0')} tone="amber" />
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          <ExperienceCard
            step="01"
            title="Choose a language"
            body="Pick a formal-language problem from the library and inspect its alphabet, states, and transition count."
            tone="cyan"
          />
          <ExperienceCard
            step="02"
            title="Validate your string"
            body="The console now checks every character against the selected language alphabet before any simulation can start."
            tone="emerald"
          />
          <ExperienceCard
            step="03"
            title="Watch the machine decide"
            body="Run continuously or step manually while the tape, trace, and state graph update together."
            tone="amber"
          />
        </section>

        <section className="grid gap-8 2xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[32px] border border-white/10 bg-slate-950/65 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200/80">Problem Library</p>
              <h2 className="text-2xl font-black tracking-tight text-white">Select a language</h2>
            </div>

            <div className="mt-6 space-y-4">
              {Object.values(PROBLEMS).map((item) => {
                const active = item.id === problem.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleProblemSelect(item.id)}
                    className={`group w-full rounded-[26px] border p-5 text-left transition duration-300 ${
                      active
                        ? 'border-cyan-300/60 bg-cyan-300/14 shadow-[0_18px_48px_rgba(8,145,178,0.2)]'
                        : 'border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.formal}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${
                          active ? 'bg-cyan-300/20 text-cyan-100' : 'bg-white/8 text-slate-400'
                        }`}
                      >
                        {item.alphabet.join('')}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-300/80">{item.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Current Problem</p>
              <h3 className="mt-2 text-xl font-black text-white">{problem.title}</h3>
              <p className="mt-2 text-sm text-cyan-100">{problem.formal}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{problem.description}</p>

              <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                <MiniStat label="Alphabet" value={summary.alphabet} />
                <MiniStat label="States" value={String(summary.states)} />
                <MiniStat label="Rules" value={String(summary.transitions)} />
              </div>
            </div>
          </aside>

          <main className="grid gap-8">
            <section className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/65 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl md:p-8">
              <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200/80">Simulation Console</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Enter a string and run the machine</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Allowed symbols: <span className="font-semibold text-white">{problem.alphabet.join(', ')}</span>. The simulator starts from the leftmost cell and halts only when it reaches an explicit accept or reject state.
                  </p>
                </div>

                <StatusBadge verdict={validation.isValid ? session.verdict : 'invalid'} message={validation.isValid ? session.haltReason : 'Invalid symbols detected for this language'} />
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-6">
                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <label className="block flex-1">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Input String</span>
                          <input
                            value={inputValue}
                            onChange={(event) => handleInputChange(event.target.value)}
                            spellCheck="false"
                            className={`h-14 w-full rounded-2xl border px-5 text-lg font-semibold tracking-[0.15em] text-white outline-none transition focus:bg-slate-900 focus:ring-4 ${
                              validation.isValid
                                ? 'border-white/10 bg-slate-900/80 focus:border-cyan-300/60 focus:ring-cyan-400/10'
                                : 'border-rose-400/50 bg-rose-500/10 focus:border-rose-300/70 focus:ring-rose-400/10'
                            }`}
                            placeholder={`Try ${problem.sampleInput}`}
                          />
                        </label>
                        <div className="grid grid-cols-3 gap-3 text-xs md:min-w-[290px]">
                          <MiniStat label="Alphabet" value={summary.alphabet} />
                          <MiniStat label="Length" value={String(inputValue.length)} />
                          <MiniStat label="Status" value={validation.isValid ? 'Ready' : 'Fix input'} />
                        </div>
                      </div>

                      <ValidationBanner validation={validation} alphabet={problem.alphabet} />
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Controls</span>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap gap-4">
                        <button
                          type="button"
                          onClick={() => setIsRunning((value) => !value)}
                          disabled={!canRun}
                          className={`h-14 rounded-2xl px-6 text-sm font-bold uppercase tracking-[0.3em] transition ${
                            !canRun
                              ? 'cursor-not-allowed border border-white/10 bg-white/5 text-slate-500'
                              : isRunning
                                ? 'bg-rose-500 text-white shadow-[0_15px_40px_rgba(244,63,94,0.28)] hover:bg-rose-400'
                                : 'bg-cyan-400 text-slate-950 shadow-[0_15px_40px_rgba(34,211,238,0.25)] hover:scale-[1.02] hover:bg-cyan-300'
                          }`}
                        >
                          {isRunning ? 'Pause' : 'Start'}
                        </button>
                        <button
                          type="button"
                          onClick={() => advanceStep()}
                          disabled={!canRun}
                          className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                            !canRun
                              ? 'cursor-not-allowed border-white/10 bg-white/5 text-slate-500'
                              : 'border-emerald-400/30 bg-emerald-400/12 text-emerald-100 hover:border-emerald-300/50 hover:bg-emerald-300/16'
                          }`}
                        >
                          Step Once
                        </button>
                        <button
                          type="button"
                          onClick={() => resetSession(problem, inputValue)}
                          className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                        >
                          Reset Machine
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange(problem.sampleInput)}
                          className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                        >
                          Load Example
                        </button>
                      </div>
                      <p className="max-w-sm text-sm leading-6 text-slate-400">
                        The machine only runs when the string uses symbols from the selected alphabet. Invalid characters are flagged before execution.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Tape View</span>
                    <Tape cells={session.tape} pointer={session.head} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <PanelStat label="Current State" value={session.state} accent="cyan" />
                  <PanelStat label="Head Position" value={String(session.head)} accent="emerald" />
                  <PanelStat label="Steps Executed" value={String(session.steps)} accent="amber" />
                  <PanelStat
                    label="Last Transition"
                    value={session.lastRule ? formatRuleLabel(session.lastRule) : 'Not started'}
                    accent="rose"
                  />
                </div>
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_360px]">
              <div className="rounded-[32px] border border-white/10 bg-slate-950/65 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl md:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200/80">State Diagram</p>
                    <h2 className="mt-2 text-2xl font-black text-white">Directed transition graph</h2>
                  </div>
                  <p className="text-sm text-slate-400">Clearer labels, stronger arrows, and highlighted execution flow.</p>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,24,0.98),rgba(5,10,18,0.92))] p-4 md:p-6">
                  <StateDiagram
                    problem={problem}
                    edges={groupedEdges}
                    currentState={session.state}
                    lastRule={session.lastRule}
                  />
                </div>
                  <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Diagram Guide</p>
                    <div className="mt-4 space-y-4 text-sm text-slate-300">
                      <LegendRow swatch="border-cyan-300 bg-cyan-300/10" label="Active state" />
                      <LegendRow swatch="border-emerald-400 bg-emerald-400/10" label="Accept state" />
                      <LegendRow swatch="border-rose-400 bg-rose-400/10" label="Reject state" />
                      <LegendLine label="Highlighted arrow = last transition used" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-slate-950/65 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200/80">Execution Trace</p>
                <h2 className="mt-2 text-2xl font-black text-white">Recent machine steps</h2>

                <div className="mt-5 space-y-3">
                  {session.history.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-sm leading-6 text-slate-400">
                      The machine is ready. Press <span className="font-semibold text-white">Start</span> or <span className="font-semibold text-white">Step Once</span> to begin.
                    </div>
                  ) : (
                    session.history.map((item) => (
                      <div
                        key={`${item.step}-${item.from}-${item.to}`}
                        className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-white">Step {item.step}</p>
                          <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-300">
                            {item.from} → {item.to}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                          Read <span className="font-semibold text-cyan-200">{displaySymbol(item.read)}</span>, wrote{' '}
                          <span className="font-semibold text-emerald-200">{displaySymbol(item.write)}</span>, then moved{' '}
                          <span className="font-semibold text-amber-200">{item.move}</span>.
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </main>
        </section>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, tone }) => {
  const tones = {
    cyan: 'from-cyan-300/25 text-cyan-100',
    emerald: 'from-emerald-300/25 text-emerald-100',
    amber: 'from-amber-300/25 text-amber-100',
  };

  return (
    <div className={`min-w-[120px] rounded-[24px] border border-white/10 bg-gradient-to-br ${tones[tone]} to-white/[0.03] px-4 py-3`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-white">{value}</p>
    </div>
  );
};

const ExperienceCard = ({ step, title, body, tone }) => {
  const tones = {
    cyan: 'from-cyan-300/18 to-cyan-300/4 text-cyan-100',
    emerald: 'from-emerald-300/18 to-emerald-300/4 text-emerald-100',
    amber: 'from-amber-300/18 to-amber-300/4 text-amber-100',
  };

  return (
    <div className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${tones[tone]} p-5 shadow-[0_16px_50px_rgba(0,0,0,0.2)]`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/55">Step {step}</p>
      <h3 className="mt-3 text-xl font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-200/85">{body}</p>
    </div>
  );
};

const MiniStat = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
    <p className="mt-2 text-sm font-semibold text-white">{value}</p>
  </div>
);

const PanelStat = ({ label, value, accent }) => {
  const accents = {
    cyan: 'text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]',
    emerald: 'text-emerald-100 shadow-[0_0_0_1px_rgba(52,211,153,0.15)]',
    amber: 'text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.15)]',
    rose: 'text-rose-100 shadow-[0_0_0_1px_rgba(251,113,133,0.15)]',
  };

  return (
    <div className={`rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 ${accents[accent]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">{label}</p>
      <p className="mt-3 break-words font-mono text-lg font-semibold text-white">{value}</p>
    </div>
  );
};

const StatusBadge = ({ verdict, message }) => {
  const style =
    verdict === 'accept'
      ? 'border-emerald-400/30 bg-emerald-400/12 text-emerald-100'
      : verdict === 'reject'
        ? 'border-rose-400/30 bg-rose-400/12 text-rose-100'
        : verdict === 'invalid'
          ? 'border-amber-400/30 bg-amber-400/12 text-amber-100'
        : 'border-cyan-400/25 bg-cyan-400/10 text-cyan-100';

  const title =
    verdict === 'accept'
      ? 'Accepted'
      : verdict === 'reject'
        ? 'Rejected'
        : verdict === 'invalid'
          ? 'Validation'
          : 'Waiting';

  return (
    <div className={`rounded-[22px] border px-4 py-3 ${style}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em]">{title}</p>
      <p className="mt-2 text-sm font-medium">{message}</p>
    </div>
  );
};

const ValidationBanner = ({ validation, alphabet }) => {
  if (validation.isValid) {
    return (
      <div className="rounded-[22px] border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
        Input is valid for this language. Allowed alphabet: <span className="font-semibold">{alphabet.join(', ')}</span>.
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
      Invalid symbol{validation.invalidSymbols.length > 1 ? 's' : ''}:{' '}
      <span className="font-semibold">{validation.invalidSymbols.join(', ')}</span>. Use only{' '}
      <span className="font-semibold">{alphabet.join(', ')}</span> for this problem.
    </div>
  );
};

const LegendRow = ({ swatch, label }) => (
  <div className="flex items-center gap-3">
    <span className={`inline-flex h-4 w-4 rounded-full border-2 ${swatch}`} />
    <span>{label}</span>
  </div>
);

const LegendLine = ({ label }) => (
  <div className="flex items-center gap-3">
    <span className="inline-flex h-[3px] w-10 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
    <span>{label}</span>
  </div>
);

const StateDiagram = ({ problem, edges, currentState, lastRule }) => {
  const nodes = problem.layout;
  const viewBox = getDiagramViewBox(nodes);
  const reversePairs = new Set(
    edges
      .filter((edge) => edge.from !== edge.to)
      .map((edge) => `${edge.to}|${edge.from}`)
  );

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="h-[700px] w-full">
      <defs>
        <linearGradient id="edgeDefault" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(203,213,225,0.95)" />
          <stop offset="100%" stopColor="rgba(148,163,184,0.62)" />
        </linearGradient>
        <linearGradient id="edgeActive" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <marker id="arrowDefault" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(148,163,184,0.8)" />
        </marker>
        <marker id="arrowActive" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#67e8f9" />
        </marker>
        <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edges.map((edge) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const isActive = lastRule && lastRule.s === edge.from && lastRule.n === edge.to;
        const isReversePair = reversePairs.has(`${edge.from}|${edge.to}`);

        if (edge.from === edge.to) {
          const loopPath = `M ${from.x - 18} ${from.y - 34} C ${from.x - 62} ${from.y - 96}, ${from.x + 62} ${from.y - 96}, ${from.x + 18} ${from.y - 34}`;
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <path
                d={loopPath}
                fill="none"
                stroke={isActive ? 'url(#edgeActive)' : 'url(#edgeDefault)'}
                strokeWidth={isActive ? 4 : 2.3}
                markerEnd={isActive ? 'url(#arrowActive)' : 'url(#arrowDefault)'}
              />
              <text x={from.x} y={from.y - 98} textAnchor="middle" className={`fill-current text-[11px] font-medium ${isActive ? 'text-cyan-100' : 'text-slate-200'}`}>
                {edge.label}
              </text>
            </g>
          );
        }

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const ux = dx / distance;
        const uy = dy / distance;
        const radius = 36;
        const startX = from.x + ux * radius;
        const startY = from.y + uy * radius;
        const endX = to.x - ux * radius;
        const endY = to.y - uy * radius;
        const offset = isReversePair ? 32 : 0;
        const normalX = -uy * offset;
        const normalY = ux * offset;
        const controlX = (startX + endX) / 2 + normalX;
        const controlY = (startY + endY) / 2 + normalY;
        const path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

        return (
          <g key={`${edge.from}-${edge.to}`}>
            <path
              d={path}
              fill="none"
              stroke={isActive ? 'url(#edgeActive)' : 'url(#edgeDefault)'}
              strokeWidth={isActive ? 4.5 : 2.8}
              markerEnd={isActive ? 'url(#arrowActive)' : 'url(#arrowDefault)'}
            />
            <text
              x={controlX}
              y={controlY - 12}
              textAnchor="middle"
              className={`fill-current text-[11px] font-medium ${isActive ? 'text-cyan-100' : 'text-slate-200'}`}
            >
              {edge.label}
            </text>
          </g>
        );
      })}

      {Object.entries(nodes).map(([name, point]) => {
        const isActive = currentState === name;
        const isAccept = name === problem.acceptState;
        const isReject = name === problem.rejectState;
        const fill = isActive ? '#0f172a' : '#08111d';
        const stroke = isAccept ? '#34d399' : isReject ? '#fb7185' : isActive ? '#67e8f9' : '#94a3b8';

        return (
          <g key={name} transform={`translate(${point.x} ${point.y})`} filter={isActive ? 'url(#nodeGlow)' : undefined}>
            <circle r="36" fill={fill} stroke={stroke} strokeWidth={isActive ? 4.5 : 2.8} />
            {isAccept && <circle r="27" fill="none" stroke="#34d399" strokeWidth="2.4" opacity="0.9" />}
            {isReject && <line x1="-16" y1="-16" x2="16" y2="16" stroke="#fb7185" strokeWidth="2.5" />}
            {isReject && <line x1="16" y1="-16" x2="-16" y2="16" stroke="#fb7185" strokeWidth="2.5" />}
            <text textAnchor="middle" className="fill-white text-[13px] font-semibold" y="4">
              {name}
            </text>
            {isActive && (
              <text textAnchor="middle" className="fill-cyan-200 text-[9px] font-semibold uppercase tracking-[0.3em]" y="55">
                active
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default App;
