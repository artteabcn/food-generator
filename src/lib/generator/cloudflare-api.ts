const CF_API = "https://api.cloudflare.com/client/v4";

function cfHeaders(apiToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };
}

export async function createD1Database(
  apiToken: string,
  accountId: string,
  name: string
): Promise<{ uuid: string }> {
  const res = await fetch(`${CF_API}/accounts/${accountId}/d1/database`, {
    method: "POST",
    headers: cfHeaders(apiToken),
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.text();
    // 409 = already exists — fetch the existing one
    if (res.status === 409) {
      const listRes = await fetch(
        `${CF_API}/accounts/${accountId}/d1/database?name=${encodeURIComponent(name)}`,
        { headers: cfHeaders(apiToken) }
      );
      const listData = (await listRes.json()) as { result: { uuid: string }[] };
      const existing = listData.result?.[0];
      if (existing) return { uuid: existing.uuid };
    }
    throw new Error(`D1 create failed: ${err}`);
  }

  const data = (await res.json()) as { result: { uuid: string } };
  return { uuid: data.result.uuid };
}

export async function applyD1Migration(
  apiToken: string,
  accountId: string,
  databaseId: string,
  sql: string
): Promise<void> {
  const res = await fetch(
    `${CF_API}/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: cfHeaders(apiToken),
      body: JSON.stringify({ sql }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`D1 migration failed: ${err}`);
  }
}

export async function createPagesProject(
  apiToken: string,
  accountId: string,
  projectName: string,
  productionBranch: string = "main"
): Promise<{ subdomain: string }> {
  const res = await fetch(`${CF_API}/accounts/${accountId}/pages/projects`, {
    method: "POST",
    headers: cfHeaders(apiToken),
    body: JSON.stringify({
      name: projectName,
      production_branch: productionBranch,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    if (res.status !== 409) {
      throw new Error(`CF Pages project creation failed: ${err}`);
    }
  }

  const data = (await res.json()) as { result?: { subdomain: string } };
  return { subdomain: data.result?.subdomain ?? `${projectName}.pages.dev` };
}
