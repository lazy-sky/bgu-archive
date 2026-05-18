"use client";

import Image from "next/image";
import { useState } from "react";

type Entry = {
  id: string;
  label: string;
  src: string;
  caption: string;
};

const CHARTS: Entry[] = [
  {
    id: "utg",
    label: "UTG",
    src: "/learn/holdem-ranges/01-utg.png",
    caption:
      "언더더건 — 프리플랍 첫 액션. 가장 좁은 시작 핸드(빨간 칸)를 참고하세요.",
  },
  {
    id: "utg1",
    label: "UTG+1",
    src: "/learn/holdem-ranges/02-utg1.png",
    caption:
      "UTG 바로 다음 자리. 차트가 UTG와 같거나 한 단계 넓어진 참고용입니다.",
  },
  {
    id: "mp",
    label: "MP / MP+1",
    src: "/learn/holdem-ranges/03-mp.png",
    caption:
      "미들 포지션. 브로드웨이·수티드 커넥터 등 빨간 영역이 UTG보다 넓어집니다.",
  },
  {
    id: "hj",
    label: "HJ",
    src: "/learn/holdem-ranges/03-mp.png",
    caption:
      "하이잭 — 참고 차트는 MP와 동일 파일입니다. 실제로는 MP보다 약간 더 넓히는 경우가 많습니다.",
  },
  {
    id: "co",
    label: "CO",
    src: "/learn/holdem-ranges/04-co.png",
    caption:
      "컷오프. 스틸·레인지가 또 넓어지며 작은 페어·커넥터가 빨간 칸에 더 많이 포함됩니다.",
  },
  {
    id: "btn",
    label: "BTN",
    src: "/learn/holdem-ranges/05-btn.png",
    caption:
      "딜러 버튼. 포스트플랍에서 마지막 액션 유리로 시작 핸드 범위가 가장 넓은 편입니다.",
  },
  {
    id: "sb",
    label: "SB",
    src: "/learn/holdem-ranges/02-utg1.png",
    caption:
      "스몰 블라인드. 포스트플랍은 보통 OOP라 버튼보다 좁게 가져가는 편입니다. 빠른 참고로 UTG+1 차트를 보여 줍니다.",
  },
];

const tabBtnBase =
  "rounded-full border px-3 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 sm:text-sm";
const tabBtnActive =
  "border-amber-800/40 bg-amber-900 text-amber-50 shadow-sm";
const tabBtnIdle =
  "border-amber-900/15 bg-white/80 text-amber-950 hover:bg-amber-50/90";

export function PreflopRangeCharts() {
  const [active, setActive] = useState(0);
  const entry = CHARTS[active]!;

  return (
    <div
      className="mt-5 overflow-hidden rounded-2xl border border-amber-900/12 bg-white/95 shadow-sm"
      aria-label="포지션별 프리플랍 핸드 레인지 차트"
    >
      <div className="border-b border-amber-900/10 bg-amber-50/40 px-3 py-3 sm:px-4">
        <p className="mb-2 text-xs font-medium text-amber-900/80">
          포지션 선택
        </p>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="포지션">
          {CHARTS.map((c, i) => {
            const selected = i === active;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`preflop-chart-panel-${c.id}`}
                id={`preflop-chart-tab-${c.id}`}
                className={`${tabBtnBase} ${selected ? tabBtnActive : tabBtnIdle}`}
                onClick={() => setActive(i)}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`preflop-chart-panel-${entry.id}`}
        role="tabpanel"
        aria-labelledby={`preflop-chart-tab-${entry.id}`}
        className="px-3 pb-4 pt-4 sm:px-5"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/10 pb-3">
          <p className="text-xs leading-relaxed text-amber-900/75">
            <strong className="text-amber-950">그리드 읽는 법:</strong> 대각선은
            포켓 페어(AA…22). 그 위쪽 삼각형은 수티드(s), 아래쪽은 오프수트(o).
            빨간 칸은 &quot;시작 핸드&quot;, 회색은 &quot;폴드&quot;입니다.
          </p>
          <div className="flex shrink-0 items-center gap-4 text-xs font-medium text-amber-950">
            <span className="flex items-center gap-2">
              <span
                className="h-4 w-6 rounded-sm bg-[#dc2626]"
                aria-hidden
              />
              시작 핸드
            </span>
            <span className="flex items-center gap-2">
              <span
                className="h-4 w-6 rounded-sm border border-amber-900/15 bg-[#e5e7eb]"
                aria-hidden
              />
              폴드
            </span>
          </div>
        </div>

        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-xl border border-amber-900/10 bg-neutral-100">
          <Image
            src={entry.src}
            alt={`${entry.label} 포지션 프리플랍 핸드 레인지. 13×13 그리드로 시작 핸드(빨간 칸)와 폴드(회색 칸)가 표시되어 있습니다.`}
            width={700}
            height={577}
            className="h-auto w-full object-contain"
            sizes="(max-width: 768px) 100vw, 672px"
            priority={active === 0}
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-amber-900/75">
          {entry.caption}{" "}
          <strong className="font-medium text-amber-950">BB</strong>는 이미 1BB를
          넣은 상태라 오픈 레인지가 아니라 상대 레이즈에 대한{" "}
          <strong>수비(콜·3벳·폴드)</strong>를 따로 공부합니다.
        </p>
      </div>
    </div>
  );
}
