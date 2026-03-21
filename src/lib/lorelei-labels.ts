/**
 * DiceBear Lorelei 내부 id(variant01, happy02 …)를 UI용 한국어로 표시합니다.
 * (에셋 원본 이름은 공개되지 않아 번호·감정 위주로 구분합니다.)
 */

function variantIndex(id: string): number | null {
  const m = /^variant(\d{2})$/.exec(id);
  return m ? Number.parseInt(m[1], 10) : null;
}

/** 머리 · 눈 · 눈썹 · 코 등 variantNN */
export function loreleiVariantLabel(
  category: string,
  id: string,
): string {
  const n = variantIndex(id);
  return n != null ? `${category} ${n}번` : id;
}

export function loreleiHeadLabel(id: string): string {
  return loreleiVariantLabel("얼굴형", id);
}

export function loreleiGlassesLabel(id: string): string {
  return loreleiVariantLabel("안경", id);
}

export function loreleiBeardLabel(id: string): string {
  return loreleiVariantLabel("수염", id);
}

/** happy12, sad03 등 */
export function loreleiMouthLabel(id: string): string {
  const h = /^happy(\d+)$/.exec(id);
  if (h) return `웃는 입 ${Number(h[1])}번`;
  const s = /^sad(\d+)$/.exec(id);
  if (s) return `우울한 입 ${Number(s[1])}번`;
  return id;
}
