const CF_API = "https://api.cloudflare.com/client/v4";

export async function createPagesProject(
  apiToken: string,
  accountId: string,
  projectName: string,
  productionBranch: string = "main"
): Promise<{ subdomain: string }> {
  const res = await fetch(
    `${CF_API}/accounts/${accountId}/pages/projects`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        production_branch: productionBranch,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    // 409 = project already exists — continue
    if (res.status !== 409) {
      throw new Error(`CF Pages project creation failed: ${err}`);
    }
  }

  const data = (await res.json()) as {
    result?: { subdomain: string };
  };
  return { subdomain: data.result?.subdomain ?? `${projectName}.pages.dev` };
}
