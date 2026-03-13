const HARVEST_API_KEY = process.env.HARVEST_API_KEY;
const HARVEST_ACCOUNT_ID = process.env.HARVEST_ACCOUNT_ID;

if (!HARVEST_API_KEY || !HARVEST_ACCOUNT_ID) {
  throw new Error("HARVEST_API_KEY and HARVEST_ACCOUNT_ID env vars are required");
}

const BASE_URL = "https://api.harvestapp.com/v2";

export async function harvestRequest(
  path: string,
  options: {
    method?: string;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
  } = {}
): Promise<unknown> {
  const { method = "GET", params, body } = options;

  const KEY_MAP: Record<string, string> = { from_date: "from", to_date: "to" };

  let url = `${BASE_URL}${path}`;
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(KEY_MAP[k] ?? k)}=${encodeURIComponent(String(v))}`)
      .join("&");
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${HARVEST_API_KEY}`,
    "Harvest-Account-Id": HARVEST_ACCOUNT_ID!,
    "User-Agent": "harvest-mcp/1.0",
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (method === "DELETE") {
    if (res.status === 200 || res.status === 204) return { success: true };
    const text = await res.text();
    throw new Error(`Harvest API error ${res.status}: ${text}`);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Harvest API error ${res.status}: ${text}`);
  }

  return res.json();
}
