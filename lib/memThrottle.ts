import "server-only";

// DECIDED 2026-11-05 (사이트 점검, 보안: 업로드 서명과 멘토 예약에 횟수 제한이 없음): 함수 인스턴스 안의 간단한 창(window) 제한.
// 인스턴스마다 따로 세는 최선의 노력이라 완전한 방어는 아니지만, 한 IP가 서명 URL을 무한히 받아 버킷을 채우는 일은 막습니다.
// DB 표를 새로 만들지 않습니다(CLAUDE.md: 새 표는 마이그레이션과 grant가 필요).
const hits = new Map<string, number[]>();

export function tooMany(bucket: string, ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const key = `${bucket}:${ip}`;
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return recent.length > limit;
}
