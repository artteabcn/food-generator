const GITHUB_API = "https://api.github.com";

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
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
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
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
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
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
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
  content: string, // base64
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
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
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
  // Try to create first
  const createRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/actions/variables`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, value }),
    }
  );

  if (!createRes.ok && createRes.status !== 422) {
    // Try PATCH if create failed for reasons other than "already exists"
    await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/actions/variables/${name}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, value }),
      }
    );
  } else if (createRes.status === 422) {
    // Already exists — update it
    await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/actions/variables/${name}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, value }),
      }
    );
  }
}
