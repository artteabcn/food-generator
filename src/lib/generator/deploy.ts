import type { SiteFormData } from "@/lib/validations/site";
import {
  generateSiteConfig,
  generateWranglerToml,
  generateEnJson,
} from "./template";
import {
  createRepoFromTemplate,
  commitFile,
  getFileSha,
  getDefaultBranch,
  addRepoVariable,
} from "./github";
import { createPagesProject } from "./cloudflare-api";

function toBase64(str: string): string {
  // Use TextEncoder for proper UTF-8 handling in CF Workers
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export interface DeployResult {
  repoUrl: string;
  pagesUrl: string;
  cfProjectName: string;
}

export async function deployRestaurantSite(
  data: SiteFormData,
  env: {
    GITHUB_TOKEN: string;
    GITHUB_OWNER: string;
    TEMPLATE_REPO: string;
    CF_API_TOKEN: string;
    CF_ACCOUNT_ID: string;
  }
): Promise<DeployResult> {
  const repoName = data.slug;
  const cfProjectName = data.slug;

  // 1. Create GitHub repo from template
  const repo = await createRepoFromTemplate(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    env.TEMPLATE_REPO,
    repoName,
    env.GITHUB_OWNER
  );

  // Wait for the repo to be ready, then detect actual default branch
  await new Promise((r) => setTimeout(r, 3000));
  const branch = await getDefaultBranch(env.GITHUB_TOKEN, env.GITHUB_OWNER, repoName);

  // 2. Commit customized src/config/site.ts
  const siteConfigContent = generateSiteConfig(data);
  const siteConfigSha = await getFileSha(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "src/config/site.ts"
  );
  await commitFile(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "src/config/site.ts",
    toBase64(siteConfigContent),
    "chore: configure restaurant site",
    branch,
    siteConfigSha
  );

  // 3. Commit customized i18n files
  const enJson = generateEnJson(data);

  const enSha = await getFileSha(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "src/i18n/en.json"
  );
  await commitFile(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "src/i18n/en.json",
    toBase64(enJson),
    "content: add restaurant translations",
    branch,
    enSha
  );

  // FR and TH get same content as EN for now (agency updates later)
  const frSha = await getFileSha(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "src/i18n/fr.json"
  );
  await commitFile(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "src/i18n/fr.json",
    toBase64(enJson),
    "content: add FR placeholder translations",
    branch,
    frSha
  );

  const thSha = await getFileSha(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "src/i18n/th.json"
  );
  await commitFile(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "src/i18n/th.json",
    toBase64(enJson),
    "content: add TH placeholder translations",
    branch,
    thSha
  );

  // 4. Commit photos
  for (let i = 0; i < data.photos.length; i++) {
    const photo = data.photos[i];
    const ext = photo.mimeType.split("/")[1] || "jpeg";
    const path = `public/images/menu${i + 1}.${ext}`;
    const existingSha = await getFileSha(
      env.GITHUB_TOKEN,
      env.GITHUB_OWNER,
      repoName,
      path
    );
    await commitFile(
      env.GITHUB_TOKEN,
      env.GITHUB_OWNER,
      repoName,
      path,
      photo.data, // already base64
      `content: add menu photo ${i + 1}`,
      branch,
      existingSha
    );
  }

  // 5. Commit customized wrangler.toml
  const wranglerContent = generateWranglerToml(data);
  const wranglerSha = await getFileSha(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "wrangler.toml"
  );
  await commitFile(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "wrangler.toml",
    toBase64(wranglerContent),
    "chore: configure wrangler",
    branch,
    wranglerSha
  );

  // 6. Create CF Pages project
  const { subdomain } = await createPagesProject(
    env.CF_API_TOKEN,
    env.CF_ACCOUNT_ID,
    cfProjectName
  );

  // 7. Add CF_PROJECT_NAME as a GitHub Actions variable
  await addRepoVariable(
    env.GITHUB_TOKEN,
    env.GITHUB_OWNER,
    repoName,
    "CF_PROJECT_NAME",
    cfProjectName
  );

  const pagesUrl = `https://${subdomain}`;

  return {
    repoUrl: repo.html_url,
    pagesUrl,
    cfProjectName,
  };
}
