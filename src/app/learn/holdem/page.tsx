import type { Metadata } from "next";
import Image from "next/image";
import { PreflopRangeCharts } from "@/components/learn/preflop-range-charts";

const HOLDEM_DESCRIPTION =
  "텍사스 홀덤 기본 규칙과 포지션·프리플랍 레인지 참고, 족보·베팅 라운드까지.";

export const metadata: Metadata = {
  title: "텍사스 홀덤",
  description: HOLDEM_DESCRIPTION,
};

function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    try {
      return new URL(explicit).origin;
    } catch {
      /* fall through */
    }
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

const base = siteUrl();

export default function LearnHoldemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "텍사스 홀덤 배우기",
            description: HOLDEM_DESCRIPTION,
            inLanguage: "ko-KR",
            mainEntityOfPage: `${base}/learn/holdem`,
          }),
        }}
      />
      <article
        className="rounded-3xl border border-amber-900/10 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
        lang="ko"
      >
        <header className="border-b border-amber-950/10 pb-6">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-800/85">
            카드 · 포커
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-amber-950">
            텍사스 홀덤
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-amber-900/75">
            플레이어는 각자 <strong className="font-medium text-amber-950">홀 카드 2장</strong>을
            받고, 테이블 중앙의{" "}
            <strong className="font-medium text-amber-950">공용 카드 5장</strong>과 조합해 가장
            높은 <strong className="font-medium text-amber-950">5장 패</strong>를 만들면
            됩니다. 같은 규칙으로 여러 판 이어 가며 칩을 나눕니다.
          </p>
        </header>

        <div className="prose-learn mt-8 space-y-10 text-sm leading-relaxed text-amber-900/90 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-amber-950 [&_h4]:mt-5 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-amber-950 [&_li]:marker:text-amber-700/80 [&_strong]:font-medium [&_strong]:text-amber-950 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          <section aria-labelledby="holdem-goal">
            <h3 id="holdem-goal">무엇을 하면 이기나요?</h3>
            <p className="mt-3">
              각 베팅 라운드가 끝날 때까지 남아 있는 사람들 가운데, 쇼다운에서 가장
              높은 족보를 가진 사람이 팟(중앙에 모인 칩)을 가져갑니다. 모두가
              폴드하면 마지막으로 베팅하거나 콜한 한 사람이 팟을 받습니다.
            </p>
          </section>

          <section aria-labelledby="holdem-setup">
            <h3 id="holdem-setup">시작하기 전에</h3>
            <ul className="mt-3">
              <li>
                <strong>버튼(딜러 버튼)</strong>: 이 판의 기준 자리입니다. 버튼은
                매 판 시계 방향으로 한 칸씩 돕니다.
              </li>
              <li>
                <strong>스몰 블라인드 · 빅 블라인드</strong>: 버튼 바로 왼쪽이 스몰,
                그 다음이 빅입니다. 강제 베팅으로 팟을 만들고, 이후 액션 순서의
                기준이 됩니다.
              </li>
              <li>
                일반적으로 빅 블라인드 금액이 그 판의{" "}
                <strong>최소 베팅 단위</strong>입니다.
              </li>
            </ul>
          </section>

          <section aria-labelledby="holdem-positions">
            <h3 id="holdem-positions">테이블 포지션(9인 기준)</h3>
            <p className="mt-3">
              <strong>포지션</strong>은 테이블에서 내 차례가 언제 오는지에 따른 자리
              이름입니다. 같은 패라도{" "}
              <strong>먼저 행동할수록 정보가 적어 불리</strong>하고,{" "}
              <strong>나중에 행동할수록 상대 베팅을 더 본 뒤 결정</strong>할 수 있어
              유리한 편입니다. 인원이 줄면 이름은 비슷해도 실제 순서·범위가 달라지니,
              그때그때 누가 먼저인지만 확인하면 됩니다.
            </p>

            <figure className="mt-5 overflow-hidden rounded-xl border border-amber-900/12 bg-slate-900/5 shadow-inner">
              <Image
                src="/learn/holdem-preflop-positions-9max.png"
                alt="9인 텍사스 홀덤 테이블 프리플랍 포지션도. 빅·스몰 블라인드, 얼리 포지션(언더더건·언더더건 플러스 원), 미들 포지션(미들·미들 플러스 원·하이잭), 레이트 포지션(컷오프·딜러 버튼)이 테이블 주변에 표시되어 있다."
                width={500}
                height={863}
                className="mx-auto h-auto w-full max-w-md bg-slate-950/10"
                sizes="(max-width: 640px) 100vw, 448px"
              />
              <figcaption className="border-t border-amber-900/10 bg-amber-50/40 px-4 py-3 text-xs leading-relaxed text-amber-900/70">
                프리플랍 기준 9인 포지션 예시 이미지. 중앙 네모는 이후 공용 카드(플랍·턴·리버)가
                깔리는 자리입니다.
              </figcaption>
            </figure>

            <ul className="mt-5 space-y-4">
              <li>
                <strong>블라인드(SB · BB)</strong>: 버튼 왼쪽부터 스몰·빅 순으로
                강제 베팅을 냅니다. 프리플랍에서는 이미 칩을 넣은 상태라, 이후
                라운드에서는 상황에 따라 체크·콜·폴드·레이즈 등으로 이어 갑니다.
              </li>
              <li>
                <strong>얼리 포지션(UTG · UTG+1)</strong>:{" "}
                <abbr title="Under the Gun">UTG</abbr>는 프리플랍에{" "}
                <strong>가장 먼저</strong> 행동하는 자리입니다. 상대가 어떻게 할지
                거의 모른 채 결정해야 하므로 보통 가장 조심스러운 구간으로 칩니다.
              </li>
              <li>
                <strong>미들 포지션(MP · MP+1 · HJ)</strong>: 얼리보다는 뒤지만
                레이트보다는 앞입니다. 일부 플레이어의 행동을 본 뒤 결정할 수 있어
                중간 정도의 정보를 가집니다.
              </li>
              <li>
                <strong>레이트 포지션(CO · BTN)</strong>:{" "}
                <abbr title="Cutoff">CO</abbr>는 버튼 바로 앞 자리,{" "}
                <abbr title="Button">BTN</abbr>(딜러 버튼)은 이 라운드에서 가장
                마지막에 행동합니다. 특히 버튼은 “모두의 반응을 본 뒤 말한다”는 점에서
                전략적으로 매우 중요한 포지션으로 자주 설명됩니다.
              </li>
            </ul>

            <p className="mt-4 rounded-xl border border-amber-900/10 bg-amber-50/50 px-4 py-3 text-amber-900/80">
              <strong className="text-amber-950">플랍 이후</strong>에는 보통{" "}
              <strong>버튼 바로 왼쪽부터</strong> 살아 있는 플레이어 순으로 액션이
              시작됩니다(스몰 블라인드 자리가 비었으면 다음 살아 있는 사람). 프리플랍의
              “누가 제일 먼저냐”와는 시작점이 바뀌니, 그림은 주로{" "}
              <strong>프리플랍</strong> 기준으로 기억하면 됩니다.
            </p>
          </section>

          <section aria-labelledby="holdem-preflop-ranges">
            <h3 id="holdem-preflop-ranges">포지션별 프리플랍 핸드 레인지</h3>
            <p className="mt-3">
              <strong>핸드 레인지</strong>는 “이 상황에서는 이런 패로 들어가도 무난하다”고
              미리 정해 둔 목록입니다. 아래 <strong>13×13 차트</strong>는{" "}
              <strong>9인 캐시·노 앤티</strong>,{" "}
              <strong>앞 사람들이 모두 폴드했을 때 첫 오픈</strong>을 가정한{" "}
              <strong>참고용 시각 자료</strong>입니다. 포지션 탭을 바꿔 가며 빨간 칸(
              시작 핸드)이 어떻게 넓어지는지 비교해 보세요. 실제로는 테이블 분위기,
              스택 깊이, 앤티·림프·레이즈 여부에 따라 범위가 크게 달라집니다.
            </p>
            <ul className="mt-3">
              <li>
                <strong>AKs</strong>: A와 K가{" "}
                <strong>무늬가 같은</strong> 조합. <strong>AKo</strong>는 무늬가 다름.
              </li>
              <li>
                <strong>TT+</strong>: 텐 페어 이상( TT, JJ, QQ, KK, AA ).
              </li>
              <li>
                <strong>A9s–ATs</strong>: 에이스와 9~10이 같은 무늬인 스티어·테너
                계열(예: A♠9♠ ~ A♠T♠).
              </li>
            </ul>

            <PreflopRangeCharts />

            <p className="mt-4 rounded-xl border border-amber-900/10 bg-amber-50/50 px-4 py-3 text-amber-900/85">
              이미 <strong>림프(콜만 하고 레이즈 없음)</strong>가 있거나, 앞에서{" "}
              <strong>레이즈·3베이가 나온 상태</strong>라면 차트와 완전히 다릅니다.
              동아리에서는 처음에는 <strong>UTG</strong>와 <strong>BTN</strong> 탭만
              비교해 보고, 익숙해지면 나머지 포지션으로 넓혀 가도 좋습니다.
            </p>
          </section>

          <section aria-labelledby="holdem-rounds">
            <h3 id="holdem-rounds">베팅 라운드(프리플랍 → 리버)</h3>
            <p className="mt-3">
              각 단계마다 시계 방향으로 한 명씩 차례입니다. 자신의 차례에는 보통
              다음 중 하나를 선택합니다.
            </p>
            <ul className="mt-2">
              <li>
                <strong>폴드</strong>: 패를 접고 이번 판에서 나갑니다.
              </li>
              <li>
                <strong>체크</strong>: 앞 사람이 추가 베팅을 하지 않았을 때만 가능합니다.
                칩을 더 내지 않고 차례를 넘깁니다.
              </li>
              <li>
                <strong>콜</strong>: 상대 베팅만큼 맞춥니다.
              </li>
              <li>
                <strong>레이즈</strong>: 그보다 더 많은 칩을 넣어 베팅액을 올립니다.
              </li>
            </ul>

            <h4 className="mt-6">1) 프리플랍</h4>
            <p>
              홀 카드 2장을 받은 뒤, 빅 블라인드 왼쪽부터 액션이 시작됩니다. 이미
              블라인드를 낸 사람은 그 금액만큼은 “낸 상태”로 계산됩니다.
            </p>

            <h4>2) 플랍</h4>
            <p>
              공용 카드 <strong>3장</strong>을 펼칩니다. 다시 빅 블라인드 왼쪽부터
              체크/베팅합니다.
            </p>

            <h4>3) 턴 · 4) 리버</h4>
            <p>
              공용 카드 <strong>1장</strong>씩 더 펼쳐 같은 순서로 베팅합니다. 리버가
              끝나면 남은 사람이 있으면 쇼다운입니다.
            </p>
          </section>

          <section aria-labelledby="holdem-hands">
            <h3 id="holdem-hands">족보 순위(위에서 아래로 강함)</h3>
            <div className="mt-4 overflow-x-auto rounded-xl border border-amber-900/12 bg-amber-50/50">
              <table className="w-full min-w-[280px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-amber-900/15 bg-amber-50/90">
                    <th className="px-3 py-2.5 font-medium text-amber-950">
                      족보
                    </th>
                    <th className="px-3 py-2.5 font-medium text-amber-950">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_td]:border-t [&_td]:border-amber-900/10 [&_td]:align-top">
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      로열 플러시
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      같은 무늬 A-K-Q-J-10
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      스트레이트 플러시
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      같은 무늬로 연속 5장
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      포 카드
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      같은 랭크 4장
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      풀 하우스
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      트리플 + 원 페어
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      플러시
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      무늬 같은 카드 5장(연속 아니어도 됨)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      스트레이트
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      연속 5장(A는 높은쪽·낮은쪽 규칙은 하우스룰 확인)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      트리플
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      같은 랭크 3장
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      투 페어
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      서로 다른 페어 두 개
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      원 페어
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      같은 랭크 2장
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-amber-950">
                      하이 카드
                    </td>
                    <td className="px-3 py-2.5 text-amber-900/85">
                      위에 해당 없음 — 가장 높은 카드로 비교
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-amber-900/75">
              쇼다운에서는 홀 2장 + 보드 5장 중{" "}
              <strong>아무 5장을 골라</strong> 가장 좋은 패를 만듭니다. 같은
              족보면 키커(남는 높은 카드)로 가름합니다.
            </p>
          </section>

          <section aria-labelledby="holdem-note">
            <h3 id="holdem-note">동아리에서 할 때</h3>
            <p className="mt-3">
              노 리밋·포 리밋·베팅 캡 등{" "}
              <strong>구체적인 한도와 예외</strong>는 모임마다 다릅니다. 처음에는
              작은 블라인드로 연습하고, 올인·사이드 팟 규칙은 진행자와 한 번만
              맞춰 두면 안전합니다.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
