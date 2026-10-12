'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, BookOpen, User, CheckCircle2 } from 'lucide-react';
import { DaySchedule, LessonItem } from '@/lib/eschools/types';

interface WeekScheduleProps {
  schedule: DaySchedule[];
}

export const WeekSchedule: React.FC<WeekScheduleProps> = ({ schedule }) => {
  // Вычисляем текущий день недели (1 = Пн, 5 = Пт, если выходной — Пн)
  const currentJsDay = new Date().getDay(); // 0 = Вс, 1 = Пн
  const defaultDayIndex = currentJsDay >= 1 && currentJsDay <= 5 ? currentJsDay : 1;

  const [activeDay, setActiveDay] = useState<number>(defaultDayIndex);

  const selectedDaySchedule =
    schedule.find((d) => d.dayOfWeek === activeDay) || schedule[0];

  return (
    <div className="space-y-4">
      {/* Переключатель дней недели */}
      <div className="p-3 rounded-lg bg-surface border border-surface-border flex items-center gap-1.5 overflow-x-auto select-none">
        {schedule.map((day) => {
          const isActive = day.dayOfWeek === activeDay;
          return (
            <button
              key={day.dayOfWeek}
              onClick={() => setActiveDay(day.dayOfWeek)}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded text-xs font-mono transition-colors text-center ${
                isActive
                  ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-100'
                  : 'bg-surface-subtle text-zinc-400 border border-surface-border hover:text-zinc-200'
              }`}
            >
              <div>{day.dayName.slice(0, 2)}</div>
              <div className="text-[10px] opacity-80 mt-0.5 font-sans">
                {day.lessons.length} ур.
              </div>
            </button>
          );
        })}
      </div>

      {/* Список уроков выбранного дня */}
      <div className="p-4 rounded-lg bg-surface border border-surface-border">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-100">
              {selectedDaySchedule?.dayName}
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            Всего занятий: {selectedDaySchedule?.lessons.length || 0}
          </span>
        </div>

        {(!selectedDaySchedule || selectedDaySchedule.lessons.length === 0) ? (
          <div className="py-12 text-center text-xs text-zinc-500 font-mono">
            В этот день уроков нет
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDaySchedule.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-surface-muted border border-surface-border flex items-center justify-center text-xs font-mono font-bold text-zinc-300 shrink-0 mt-0.5">
                      {lesson.lessonNumber}
                    </div>

                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-zinc-100">
                        {lesson.subject}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {lesson.startTime} – {lesson.endTime}
                        </span>
                        {lesson.room && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-500" />
                            Каб. {lesson.room}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {lesson.teacher && (
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                      <User className="w-3 h-3" />
                      <span>{lesson.teacher}</span>
                    </div>
                  )}
                </div>

                {/* Домашнее задание */}
                {lesson.homework && (
                  <div className="mt-1 p-2 rounded bg-surface-muted/60 border border-surface-border text-xs">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-0.5">
                      Домашнее задание:
                    </div>
                    <div className="text-zinc-300 font-sans text-[11px]">
                      {lesson.homework}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
