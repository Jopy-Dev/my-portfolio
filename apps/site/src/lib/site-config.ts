import { readSiteEnvironment } from "./env";

const environment = readSiteEnvironment();

export const siteConfig = {
  name: "Jopy-Dev",
  title: "Jopy-Dev — Full-Stack Software Engineer",
  description:
    "Mark Jommer is a Full-Stack Software Engineer in Makati building maintainable web, mobile, desktop, and AI-assisted systems.",
  siteUrl: environment.SITE_URL,
  basePath: environment.SITE_BASE_PATH,
  deployEnvironment: environment.DEPLOY_ENV,
  assetPath(pathname: `/${string}`) {
    return `${environment.SITE_BASE_PATH}${pathname}`;
  },
} as const;
