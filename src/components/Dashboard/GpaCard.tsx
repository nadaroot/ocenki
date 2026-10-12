'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { SubjectItem } from '@/lib/eschools/types';

interface GpaCardProps {
  overallGpa: number;
  subjects: SubjectItem[];
}

export const GpaCard: React.FC<GpaCardProps> = ({ overallGpa, subjects }) => {
  const totalGradesCount = subjects.reduce((acc, s) => acc + s.grades.length, 0);

  // Определение предмета с максимальным и минимальным баллом
  const validSubjects = subjects.filter((s) => s.grades.length > 0);
  const bestSubject = validSubjects.length
    ? [...validSubjects].sort((a, b) => b.currentAverage - a.currentAverage)[0]
    : null;
  const lowestSubject = validSubjects.length
    ? [...validSubjects].sort((a, b) => a.currentAverage - b.currentAverage)[0]
    : null;

  const targetDiff = Number((8.5 - overallGpa).toFixed(2));

  return (
    <div className="p-5 rounded-lg bg-surface border border-surface-border">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono">
          Общий средний балл
        </span>
        <span className="text-xs font-mono text-zinc-400">
          Оценок: {totalGradesCount}
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-zinc-100">
          {overallGpa.toFixed(2)}
        </span>
        <div className="flex items-center gap-1 text-xs font-mono text-zinc-300 bg-surface-subtle px-2 py-0.5 rounded border border-surface-border">
          <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
          <span>+0.15 к пред. неделе</span>
        </div>
      </div>

      {/* Информационные ячейки */}
      <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-surface-border/60">
        <div className="p-2.5 rounded bg-surface-subtle border border-surface-border">
          <div className="text-[11px] text-zinc-400">Лидирующий предмет</div>
          <div className="text-xs font-medium text-zinc-200 mt-1 truncate">
            {bestSubject ? bestSubject.name : '—'}
          </div>
          <div className="text-[11px] font-mono font-bold text-zinc-200 mt-0.5">
            {bestSubject ? `${bestSubject.currentAverage.toFixed(2)}` : ''}
          </div>
        </div>

        <div className="p-2.5 rounded bg-surface-subtle border border-surface-border">
          <div className="text-[11px] text-zinc-400">Нижний предмет</div>
          <div className="text-xs font-medium text-zinc-200 mt-1 truncate">
            {lowestSubject ? lowestSubject.name : '—'}
          </div>
          <div className="text-[11px] font-mono font-bold text-zinc-300 mt-0.5">
            {lowestSubject ? `${lowestSubject.currentAverage.toFixed(2)}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
};
