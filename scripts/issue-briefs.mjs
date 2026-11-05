#!/usr/bin/env node
// 출제사와 정리한 이슈 PDF를 멘토 전용 비공개 버킷에 올립니다(2026-11-05). 멘토는 /crossing/mentor?k= 페이지 맨 위에서 봅니다.
// 참가자는 볼 수 없습니다: 버킷은 비공개(public=false)이고, 보기 URL은 /api/crossing/mentor가 멘토 열쇠를 확인한 뒤에만 30분짜리로 만듭니다.
// PDF를 레포(public/ 포함)에 넣지 마세요. 레포는 공개일 수 있습니다.
//
//   node scripts/issue-briefs.mjs list
//   node scripts/issue-briefs.mjs upload <파일.pdf> <slug> "<한국어 제목>" ["<English title>"]
//   node scripts/issue-briefs.mjs remove <slug>
//
// slug는 영문 소문자, 숫자, 하이픈(예: feed-media). 같은 slug로 다시 올리면 덮어씁니다.
// .env.local의 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 읽습니다(실서버).
import { readFileSync } from "node:fs";

const BUCKET = "crossing-issue-briefs"; // lib/crossingOpsServer.ts BRIEF_BUCKET과 같아야 합니다.
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")
    .map((l) => l.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);
const get = (k) => process.env[k] || env[k];
const url = get("NEXT_PUBLIC_SUPABASE_URL"), key = get("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !key) { console.error("NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY가 필요합니다."); process.exit(1); }
const H = { apikey: key, authorization: `Bearer ${key}` };
const die = (m) => { console.error(m); process.exit(1); };

// 버킷이 없으면 비공개로 만들고, 있으면 비공개인지 확인합니다. 공개 버킷이면 아무것도 올리지 않고 멈춥니다.
async function ensurePrivateBucket() {
  let r = await fetch(`${url}/storage/v1/bucket/${BUCKET}`, { headers: H });
  if (!r.ok) {
    r = await fetch(`${url}/storage/v1/bucket`, {
      method: "POST", headers: { ...H, "content-type": "application/json" },
      body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false, allowed_mime_types: ["application/pdf", "application/json"], file_size_limit: 26214400 }),
    });
    if (!r.ok) die(`버킷을 만들지 못했습니다: ${r.status} ${await r.text()}`);
    r = await fetch(`${url}/storage/v1/bucket/${BUCKET}`, { headers: H });
  }
  const b = await r.json();
  if (b.public !== false) die(`버킷 ${BUCKET}이 공개로 되어 있습니다. 올리지 않고 멈춥니다. Supabase에서 비공개로 바꾼 뒤 다시 실행하세요.`);
}

async function readIndex() {
  const r = await fetch(`${url}/storage/v1/object/${BUCKET}/index.json`, { headers: H });
  if (!r.ok) return [];
  try { return await r.json(); } catch { return []; }
}
async function put(path, body, type) {
  const r = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST", headers: { ...H, "content-type": type, "x-upsert": "true", "cache-control": "no-store" }, body,
  });
  if (!r.ok) die(`${path}를 올리지 못했습니다: ${r.status} ${await r.text()}`);
}
const writeIndex = (idx) => put("index.json", JSON.stringify(idx, null, 2), "application/json");

const [cmd, ...args] = process.argv.slice(2);
if (cmd === "list") {
  await ensurePrivateBucket();
  const idx = await readIndex();
  if (!idx.length) console.log("(비어 있음)");
  for (const e of idx) console.log(`${e.path}\t${e.title.ko}\t${e.title.en}`);
} else if (cmd === "upload") {
  const [file, slug, ko, en] = args;
  if (!file || !slug || !ko) die('사용법: upload <파일.pdf> <slug> "<한국어 제목>" ["<English title>"]');
  if (!/^[a-z0-9-]+$/.test(slug)) die("slug는 영문 소문자, 숫자, 하이픈만 씁니다.");
  const buf = readFileSync(file);
  if (buf.subarray(0, 5).toString() !== "%PDF-") die("PDF 파일이 아닙니다.");
  await ensurePrivateBucket();
  const path = `${slug}.pdf`;
  await put(path, buf, "application/pdf");
  const idx = (await readIndex()).filter((e) => e.path !== path);
  idx.push({ path, title: { ko, en: en || ko } });
  await writeIndex(idx);
  console.log(`올렸습니다: ${path} (${ko}). 멘토 페이지에 1분 안에 뜹니다.`);
} else if (cmd === "remove") {
  const [slug] = args;
  if (!slug) die("사용법: remove <slug>");
  await ensurePrivateBucket();
  const path = `${slug}.pdf`;
  await fetch(`${url}/storage/v1/object/${BUCKET}`, { method: "DELETE", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify({ prefixes: [path] }) });
  await writeIndex((await readIndex()).filter((e) => e.path !== path));
  console.log(`뺐습니다: ${path}`);
} else {
  die("list | upload <파일.pdf> <slug> \"<한국어 제목>\" [\"<English title>\"] | remove <slug>");
}
