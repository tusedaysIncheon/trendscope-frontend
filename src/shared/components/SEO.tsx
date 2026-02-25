import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  noindex?: boolean;
}

export function SEO({
  title,
  description = '스마트폰 사진 2장으로 내 몸을 3D로 측정하고 완벽한 핏의 패션을 추천받으세요. TrendScope AI 코디네이터.',
  ogImage = '/logo1.png',
  ogUrl = 'https://trend-scope.net', // 실제 배포 도메인에 맞춰 조정 필요
  noindex = false,
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* noindex (비공개 페이지용) */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
