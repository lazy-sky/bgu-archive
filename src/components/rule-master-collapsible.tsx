"use client";

type Props = {
  names: string[];
  /** 회원 카드에서는 "게임", 게임 표에서는 회원 수이므로 "명" */
  countLabel?: "게임" | "명";
};

/**
 * 룰마스터 가능 목록 — 기본 접힘(details), 펼치면 목록
 */
export function RuleMasterCollapsible({
  names,
  countLabel = "명",
}: Props) {
  if (!names.length) {
    return <span className="text-amber-800/50">—</span>;
  }

  return (
    <details className="group min-w-0">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-md px-1 py-0.5 text-left text-sm text-amber-900/90 outline-none ring-amber-400/30 hover:bg-amber-50/90 has-[:focus-visible]:ring-2 [&::-webkit-details-marker]:hidden">
        <span
          className="inline-block shrink-0 text-[0.65rem] text-amber-700 transition-transform duration-200 group-open:rotate-90"
          aria-hidden
        >
          ▶
        </span>
        <span className="min-w-0">
          {names.length}
          {countLabel} · 목록 보기
        </span>
      </summary>
      <ul className="mt-1.5 max-h-44 min-w-0 max-w-full space-y-0.5 overflow-y-auto overscroll-y-contain border-l-2 border-amber-300/50 pl-2.5 text-sm leading-snug text-amber-900/95 [overflow-wrap:anywhere]">
        {names.map((n) => (
          <li key={n} className="break-words py-0.5">
            {n}
          </li>
        ))}
      </ul>
    </details>
  );
}
