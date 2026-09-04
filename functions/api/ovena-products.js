// Cloudflare Pages Function: /api/ovena-products
// Proxies Ovena Health's public Shopify product feed so the browser can read it
// (the feed sends no CORS headers), and pairs each product with the same main
// image ovenahealth.com shows on its own collection cards (theme assets that
// are not part of the product feed). Trims the payload to what the storefront
// section needs and caches it at the edge for five minutes.
const STORE = 'https://www.ovenahealth.com';
const FEED = STORE + '/products.json?limit=50';
const CARDS = STORE + '/collections/all';
const TTL = 300;
const UA = 'albacetemeddev.com storefront section';

export async function onRequestGet(context) {
  const cache = caches.default;
  const key = new Request(FEED, { method: 'GET' });
  try {
    const hit = await cache.match(key);
    if (hit) return hit;
  } catch (e) { /* cache unavailable: fall through to a live fetch */ }

  let feed;
  try {
    feed = await fetch(FEED, { headers: { accept: 'application/json', 'user-agent': UA } });
  } catch (e) {
    return json({ error: 'upstream unreachable' }, 502);
  }
  if (!feed.ok) return json({ error: 'upstream ' + feed.status }, 502);
  const data = await feed.json();

  // Best effort: the store's own card images, keyed by product handle.
  let cards = {};
  try {
    const page = await fetch(CARDS, { headers: { accept: 'text/html', 'user-agent': UA } });
    if (page.ok) cards = parseCardImages(await page.text());
  } catch (e) { /* keep feed images */ }

  const products = (data.products || [])
    .filter((p) => Array.isArray(p.variants) && p.variants.length)
    .map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      type: p.product_type || '',
      image: cards[p.handle] || (p.images && p.images[0] ? p.images[0].src : null),
      variants: p.variants.map((v) => ({
        id: v.id,
        title: v.title,
        price: v.price,
        available: !!v.available,
      })),
    }));

  const res = json({ products, cardImages: Object.keys(cards).length, fetched: new Date().toISOString() }, 200, {
    'cache-control': 'public, max-age=' + TTL,
  });
  try { context.waitUntil(cache.put(key, res.clone())); } catch (e) { /* best effort */ }
  return res;
}

// First <img> that follows each product link on the collection page.
// Works on the current Ovena theme markup; any product it cannot match simply
// keeps its feed image.
export function parseCardImages(html) {
  const out = {};
  const re = /href="\/products\/([a-z0-9-]+)[^"]*"[^>]*>([\s\S]{0,2000}?)<img([^>]+)>/g;
  let m;
  while ((m = re.exec(html))) {
    const handle = m[1];
    if (out[handle]) continue;
    const attrs = m[3];
    const src = /\ssrc="([^"]+)"/.exec(attrs) || /data-src="([^"]+)"/.exec(attrs);
    if (!src) continue;
    let url = src[1].replace(/&amp;/g, '&');
    if (url.startsWith('//')) url = 'https:' + url;
    else if (url.startsWith('/')) url = STORE + url;
    if (!/^https:\/\/(www\.)?ovenahealth\.com\//.test(url) && !/^https:\/\/cdn\.shopify\.com\//.test(url)) continue;
    out[handle] = url;
  }
  return out;
}

function json(body, status, extra) {
  return new Response(JSON.stringify(body), {
    status,
    headers: Object.assign({ 'content-type': 'application/json; charset=utf-8' }, extra || {}),
  });
}
