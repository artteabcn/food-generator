import type { APIRoute } from "astro";

function extractCoords(url: string): { lat: number; lng: number } | null {
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  const llMatch = url.match(/ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  // !3d<lat>!4d<lng> format embedded in pb string
  const pbMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (pbMatch) return { lat: parseFloat(pbMatch[1]), lng: parseFloat(pbMatch[2]) };
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  const { url } = await request.json() as { url: string };
  if (!url) return new Response(JSON.stringify({ error: "url required" }), { status: 400 });

  try {
    // Follow redirects by fetching with redirect: "follow"
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const finalUrl = res.url;

    // Try extracting from final URL first
    let coords = extractCoords(finalUrl);

    // If not in URL, try the response body (Google sometimes embeds coords in the page)
    if (!coords) {
      const text = await res.text();
      const bodyMatch = text.match(/APP_INITIALIZATION_STATE=\[.*?\[\[(-?\d+\.\d+),(-?\d+\.\d+)\]/);
      if (bodyMatch) coords = { lat: parseFloat(bodyMatch[1]), lng: parseFloat(bodyMatch[2]) };
    }

    if (!coords) {
      return new Response(JSON.stringify({ error: "Could not extract coordinates from that URL", finalUrl }), { status: 422 });
    }

    return new Response(JSON.stringify({ lat: coords.lat, lng: coords.lng, finalUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};
