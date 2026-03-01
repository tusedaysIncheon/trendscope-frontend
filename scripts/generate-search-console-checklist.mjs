import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { LANGUAGES, PUBLIC_PATHS, SITE_URL, formatDate, toAbsoluteUrl, withLanguagePrefix } from "./seo-config.mjs";

const ROOT_DIR = process.cwd();
const OUTPUT_PATH = path.resolve(ROOT_DIR, "..", "docs", "SEARCH_CONSOLE_SUBMISSION_CHECKLIST.md");

function buildRepresentativeUrls() {
  const urls = [];
  for (const language of LANGUAGES) {
    for (const { path: publicPath } of PUBLIC_PATHS) {
      urls.push(toAbsoluteUrl(withLanguagePrefix(language, publicPath)));
    }
  }
  return urls;
}

function buildMarkdown() {
  const generatedDate = formatDate();
  const sitemapIndexUrl = toAbsoluteUrl("/sitemap.xml");
  const languageSitemapUrls = LANGUAGES.map((language) => toAbsoluteUrl(`/sitemap-${language}.xml`));
  const representativeUrls = buildRepresentativeUrls();

  const representativeRows = representativeUrls
    .map((url) => `| [ ] | ${url} |`)
    .join("\n");

  const languageSitemapRows = languageSitemapUrls
    .map((url) => `- [ ] ${url}`)
    .join("\n");

  return `# Search Console 제출 체크리스트\n\n> 자동 생성 파일입니다. 생성일: ${generatedDate}\n> 사이트: ${SITE_URL}\n\n## 1) 속성/소유권\n- [ ] Google Search Console에 도메인 속성 추가 (${SITE_URL})\n- [ ] DNS TXT로 소유권 인증 완료\n- [ ] 기본 국가/언어 타겟팅 전략 문서화 (ko/en/ja/zh)\n\n## 2) Sitemap 제출\n- [ ] sitemap index 제출: ${sitemapIndexUrl}\n- [ ] 언어별 sitemap 제출(권장)\n${languageSitemapRows}\n\n## 3) 색인 요청 (URL Inspection)\n다음 대표 URL은 제출 직후 수동으로 \"색인 생성 요청\" 처리:\n\n| 상태 | URL |\n|---|---|\n${representativeRows}\n\n## 4) 커버리지/개선 리포트 확인 (초기 14일)\n- [ ] 색인 생성됨(유효) URL 증가 추적\n- [ ] 제외됨 URL 원인 확인(중복, 크롤링됨-현재색인안됨 등)\n- [ ] 모바일 사용성 문제 없음\n- [ ] Core Web Vitals 경고/실패 URL 확인\n\n## 5) 배포 후 재확인\n- [ ] robots.txt에서 sitemap index 노출 확인\n- [ ] /ko /en /ja /zh 렌더링 본문이 HTML에 포함되는지 확인(프리렌더)\n- [ ] canonical/hreflang 상호참조 오류 없음\n- [ ] 주요 공개 페이지의 title/description/OG 태그 확인\n\n## 6) 운영 루틴 (주간)\n- [ ] 신규/수정 공개 페이지는 sitemap 재생성 후 재배포\n- [ ] GSC 성능 리포트에서 국가/쿼리별 CTR 변화 점검\n- [ ] 하위 노출 페이지 메타/콘텐츠 개선 항목 등록\n`;
}

async function main() {
  const markdown = buildMarkdown();
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, markdown, "utf8");
  console.log(`[search-console] wrote ${path.relative(path.resolve(ROOT_DIR, ".."), OUTPUT_PATH)}`);
}

main().catch((error) => {
  console.error("[search-console] failed:", error);
  process.exit(1);
});
