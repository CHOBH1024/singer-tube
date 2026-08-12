// 최애광장 RSS 피드 — 최신 영상 + 소식 자동 생성 (네이버/구글/빙 수집용)
const ARTIST_NAMES = ['임영웅', '영탁', '이찬원', '장민호', '김호중', '정동원', '송가인', '장윤정', '태진아', '설운도', '진성', '나훈아', '박서진', '홍진영', '조항조', '신유', 'BTS', '블랙핑크', '뉴진스', '아이브', '에스파', '트와이스', '세븐틴', '싸이', '엑소', '르세라핌', '아이유'];

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function onRequest(context) {
  const base = 'https://choeae-plaza.pomyjo.com';
  let items = '';
  try {
    const r = await fetch('https://api.pomyjo.com/api/singer/feed', { signal: AbortSignal.timeout(15000) });
    const d = await r.json();
    const artists = d.artists || {};
    const flat = [];
    for (const name of ARTIST_NAMES) {
      (artists[name] || []).slice(0, 3).forEach(v => {
        flat.push({ title: name + ' — ' + v.title, id: v.videoId, date: v.published });
      });
    }
    flat.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    items = flat.slice(0, 20).map(v => {
      const d = (v.date || '').replace(' ', 'T') + 'Z';
      return '<item>' +
        '<title>' + esc(v.title) + '</title>' +
        '<link>' + base + '/?v=' + v.id + '</link>' +
        '<guid>' + base + '/?v=' + v.id + '</guid>' +
        '<pubDate>' + esc(new Date(v.date).toUTCString()) + '</pubDate>' +
        '</item>';
    }).join('');
  } catch (e) {
    items = '';
  }
  const rss = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0"><channel>' +
    '<title>최애광장 — 가수 최신 영상·소식</title>' +
    '<link>' + base + '</link>' +
    '<description>임영웅, 영탁, BTS 등 인기 가수의 최신 영상과 소식</description>' +
    '<language>ko</language>' +
    items +
    '</channel></rss>';
  return new Response(rss, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' } });
}
