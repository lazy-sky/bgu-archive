"use client";

import { useMemo, useState } from "react";

type Props = {
  value: string[];
  onChange: (genres: string[]) => void;
  options: string[];
};

export function GameGenreMultiPicker({ value, onChange, options }: Props) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, filter]);

  function toggle(name: string) {
    const next = new Set(value);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    onChange([...next].sort((a, b) => a.localeCompare(b, "ko")));
  }

  const selectedCount = value.length;

  return (
    <div className="space-y-2">
      <input
        type="search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="태그 검색…"
        className="w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-sm text-amber-950"
        aria-label="장르 태그 검색"
      />
      <div className="max-h-56 overflow-y-auto rounded-lg border border-amber-900/15 bg-white/90 p-2">
        <ul className="space-y-1" role="list">
          {filtered.map((name) => {
            const checked = value.includes(name);
            return (
              <li key={name}>
                <label className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm text-amber-950 hover:bg-amber-50/80 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-400/40">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(name)}
                    className="mt-0.5 shrink-0 rounded border-amber-900/30"
                  />
                  <span className="leading-snug">{name}</span>
                </label>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 ? (
          <p className="px-2 py-3 text-center text-xs text-amber-800/70">
            검색 결과가 없습니다.
          </p>
        ) : null}
      </div>
      <p className="text-xs tabular-nums text-amber-900/55">
        선택 {selectedCount}개
        {filter.trim() ? ` · 표시 ${filtered.length}개` : ""}
      </p>
    </div>
  );
}
