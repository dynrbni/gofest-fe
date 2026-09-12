import React from 'react';

const QR_PATTERN = [
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [0, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 1, 1, 0, 1, 1, 0, 1],
  [0, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1],
];

export default function DecorativeQR({ cell = 6 }) {
  return (
    <div
      className="grid gap-[2px] text-slate-900"
      style={{ gridTemplateColumns: `repeat(9, ${cell}px)` }}
      aria-hidden="true"
    >
      {QR_PATTERN.flatMap((row, r) =>
        row.map((on, c) => (
          <div
            key={`${r}-${c}`}
            className={`rounded-[1px] ${on ? 'bg-current' : 'bg-transparent'}`}
            style={{ width: cell, height: cell }}
          />
        ))
      )}
    </div>
  );
}
