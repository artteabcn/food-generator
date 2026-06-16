const GITHUB_API = "https://api.github.com";

function ghHeaders(token: string, extra?: Record<string, string>): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "food-generator/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
    ...extra,
  };
}

export async function createRepoFromTemplate(
  token: string,
  owner: string,
  templateRepo: string,
  newRepoName: string,
  newOwner: string
): Promise<{ html_url: string; clone_url: string }> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${templateRepo}/generate`,
    {
      method: "POST",
      headers: ghHeaders(token),
      body: JSON.stringify({
        owner: newOwner,
        name: newRepoName,
        private: false,
        include_all_branches: false,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub create repo failed: ${err}`);
  }
  return res.json() as Promise<{ html_url: string; clone_url: string }>;
}

export async function getDefaultBranch(
  token: string,
  owner: string,
  repo: string
): Promise<string> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: ghHeaders(token),
  });
  const data = (await res.json()) as { default_branch: string };
  return data.default_branch ?? "main";
}

export async function getFileSha(
  token: string,
  owner: string,
  repo: string,
  path: string
): Promise<string | undefined> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    { headers: ghHeaders(token) }
  );
  if (!res.ok) return undefined;
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

export async function commitFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch: string,
  sha?: string
): Promise<void> {
  const body: Record<string, unknown> = { message, content, branch };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: ghHeaders(token),
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit failed for ${path}: ${err}`);
  }
}

export async function addRepoVariable(
  token: string,
  owner: string,
  repo: string,
  name: string,
  value: string
): Promise<void> {
  const createRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/actions/variables`,
    {
      method: "POST",
      headers: ghHeaders(token),
      body: JSON.stringify({ name, value }),
    }
  );

  if (!createRes.ok) {
    await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/actions/variables/${name}`,
      {
        method: "PATCH",
        headers: ghHeaders(token),
        body: JSON.stringify({ name, value }),
      }
    );
  }
}
