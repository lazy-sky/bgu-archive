import type { SupporterRow } from "@/types/supporter";

function supporterTitle(amountKrw: number): string {
  if (amountKrw > 0) {
    return `후원 ${amountKrw.toLocaleString("ko-KR")}원`;
  }
  return "후원 (감사합니다)";
}

function SupporterName({
  amountKrw,
  name,
}: {
  amountKrw: number;
  name: string;
}) {
  const title = supporterTitle(amountKrw);

  const baseText = "text-sm leading-none";

  if (amountKrw <= 0) {
    return (
      <span
        className={`${baseText} text-amber-800/45 font-normal`}
        title={title}
      >
        {name}
      </span>
    );
  }
  if (amountKrw <= 3000) {
    return (
      <span
        className={`${baseText} font-medium text-amber-950`}
        title={title}
      >
        {name}
      </span>
    );
  }
  if (amountKrw <= 5000) {
    return (
      <span
        className={`${baseText} font-medium text-violet-800`}
        title={title}
      >
        {name}
      </span>
    );
  }
  if (amountKrw < 10_000) {
    return (
      <span
        className={`${baseText} inline-flex items-center rounded border border-amber-700/40 px-1 py-px font-medium text-amber-950`}
        title={title}
      >
        {name}
      </span>
    );
  }
  if (amountKrw <= 20_000) {
    return (
      <span
        className={`${baseText} inline-flex items-center rounded border border-fuchsia-400/50 px-1.5 py-px`}
        title={title}
      >
        <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-500 bg-clip-text font-semibold leading-none text-transparent">
          {name}
        </span>
      </span>
    );
  }

  return (
    <span
      className="text-[0.95rem] font-semibold leading-none tracking-tight text-amber-950 sm:text-base"
      style={{
        textShadow:
          "0 0 10px rgba(251, 191, 36, 0.9), 0 0 22px rgba(245, 158, 11, 0.55), 0 0 34px rgba(217, 119, 6, 0.35)",
      }}
      title={title}
    >
      {name}
    </span>
  );
}

type Props = {
  supporters: SupporterRow[];
};

export function SupporterThanks({ supporters }: Props) {
  if (supporters.length === 0) return null;

  return (
    <div className="mt-8 border-t border-amber-900/10 pt-6">
      <p className="text-xs font-medium tracking-wide text-amber-800/60">
        Special Thanks to
      </p>
      <ul
        className="mt-3 flex list-none flex-wrap items-center gap-x-1.5 gap-y-1"
        aria-label="후원 감사 명단"
      >
        {supporters.map((s, i) => (
          <li key={s.id} className="flex items-center gap-1.5">
            {i > 0 ? (
              <span
                className="select-none text-sm leading-none text-amber-800/35"
                aria-hidden
              >
                ·
              </span>
            ) : null}
            <SupporterName amountKrw={s.amount_krw} name={s.display_name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
