import React from 'react';
import { BLANK } from './Engine';

const displaySymbol = (symbol) => (symbol === BLANK ? '□' : symbol);

const Tape = ({ cells, pointer }) => {
  const windowRadius = 4;
  const visibleCells = [];

  for (let offset = -windowRadius; offset <= windowRadius; offset += 1) {
    const index = pointer + offset;
    const value = cells[index] ?? BLANK;
    visibleCells.push({ index, value, active: offset === 0 });
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,13,22,0.96),rgba(3,7,14,0.96))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.12),_transparent_44%)]" />
      <div className="relative flex items-center justify-center gap-3 overflow-x-auto pb-2">
        {visibleCells.map((cell) => (
          <div key={`${cell.index}-${cell.value}`} className="flex flex-col items-center gap-2">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-[22px] border text-2xl font-black transition duration-300 ${
                cell.active
                  ? 'scale-105 border-cyan-300/70 bg-cyan-300/18 text-white shadow-[0_0_30px_rgba(34,211,238,0.28)]'
                  : 'border-white/8 bg-white/[0.03] text-slate-300'
              }`}
            >
              {displaySymbol(cell.value)}
            </div>
            <span className={`text-xs font-semibold ${cell.active ? 'text-cyan-200' : 'text-slate-500'}`}>
              {cell.index}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
        <span className="inline-flex h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
        Tape Head Focus Window
      </div>
    </div>
  );
};

export default Tape;
