// Cloudflare Pages Function: /api/ovena-products
// Proxies Ovena Health's public Shopify product feed so the browser can read it
// (the feed sends no CORS headers). Trims the payload to what the storefront
// section needs and caches it at the edge for five minutes.
const UPSTREAM = 'https://www.ovenahealth.com/products.json?limit=50';
const TTL = 300;

export async function onRequestGet(context) {
  const cache = caches.default;
  const key = new Request(UPSTREAM, { method: 'GET' });
  try {
    const hit = await cache.match(key);
    if (hit) return hit;
  } catch (e) { /* cache unavailable: fall through to a live fetch */ }

  let upstream;
  try {
    upstream = await fetch(UPSTREAM, {
      headers: { accept: 'application/json', 'user-agent': 'albacetemeddev.com storefront section' },
    });
  } catch (e) {
    return json({ error: 'upstream unreachable' }, 502);
  }
  if (!upstream.ok) return json({ error: 'upstream ' + upstream.status }, 502);

  const data = await upstream.json();
  const products = (data.products || [])
    .filter((p) => Array.isArray(p.variants) && p.variants.length)
    .map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      type: p.product_type || '',
      image: p.images && p.images[0] ? p.images[0].src : null,
      variants: p.variants.map((v) => ({
        id: v.id,
        title: v.title,
        price: v.price,
        available: !!v.available,
      })),
    }));

  const res = json({ products, fetched: new Date().toISOString() }, 200, {
    'cache-control': 'public, max-age=' + TTL,
  });
  try { context.waitUntil(cache.put(key, res.clone())); } catch (e) { /* best effort */ }
  return res;
}

function json(body, status, extra) {
  return new Response(JSON.stringify(body), {
    status,
    headers: Object.assign({ 'content-type': 'application/json; charset=utf-8' }, extra || {}),
  });
}
