"use client";

type PlayedToggleProps = {
  played: boolean;
  disabled?: boolean;
  onToggle: (next: boolean) => void;
  /** 표 기준 열 등: 짧은 스위치 */
  size?: "sm" | "md";
  /** 스위치 옆 설명 (모바일 카드 등) */
  showLabel?: boolean;
};

/**
 * «해 봤어요» 상태 — 체크박스 대신 토글 스위치 UI
 */
export function PlayedToggle({
  played,
  disabled,
  onToggle,
  size = "md",
  showLabel = false,
}: PlayedToggleProps) {
  const sm = size === "sm";
  const track = sm
    ? "h-5 w-[2.125rem] min-w-[2.125rem]"
    : "h-6 w-11 min-w-[2.75rem]";
  const thumbSize = sm ? "h-4 w-4" : "h-[1.125rem] w-[1.125rem]";
  const thumbTop = sm ? "top-0.5" : "top-[3px]";
  /** 트랙 안에서 엄지 이동 거리 (패딩 제외) */
  const thumbMove = sm
    ? played
      ? "translate-x-[0.875rem]"
      : "translate-x-0"
    : played
      ? "translate-x-[1.375rem]"
      : "translate-x-0";

  return (
    <div
      className={[
        "flex min-w-0 items-center gap-2",
        showLabel ? "justify-between" : "justify-center",
      ].join(" ")}
    >
      {showLabel ? (
        <span
          className={[
            "select-none text-xs transition-colors",
            played ? "font-medium text-emerald-800" : "text-amber-800/65",
          ].join(" ")}
        >
          해 봤어요
        </span>
      ) : null}
      <button
        type="button"
        role="switch"
        aria-checked={played}
        aria-label={played ? "해 봤음 표시 해제" : "해 봤음 표시"}
        disabled={disabled}
        onClick={() => onToggle(!played)}
        className={[
          "relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50/0",
          "disabled:cursor-not-allowed disabled:opacity-45",
          track,
          played
            ? "bg-gradient-to-b from-emerald-500 to-emerald-600 shadow-inner shadow-emerald-900/20"
            : "border border-amber-900/12 bg-gradient-to-b from-stone-100/95 to-amber-100/50 shadow-sm",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none absolute left-0.5 rounded-full bg-white shadow-md ring-1 ring-black/[0.06] transition-transform duration-200 ease-out",
            thumbSize,
            thumbTop,
            thumbMove,
          ].join(" ")}
        />
      </button>
    </div>
  );
}
