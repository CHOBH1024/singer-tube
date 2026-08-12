// singer-tube.pomyjo.com → choeae-plaza.pomyjo.com 리다이렉트
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'singer-tube.pomyjo.com') {
    return Response.redirect('https://choeae-plaza.pomyjo.com' + url.pathname + url.search, 301);
  }
  return context.next();
}
