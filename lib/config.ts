type EnvType = {
  [x: string]: string;
};

type ConfigType = {
  development: EnvType;
  production: EnvType;
};

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SEC,
  NEXTAUTH_SECRET,
  ENV,
  BASE_URL,
  SUPER_EMAIL,
  SUPER_PASSWORD,
  SUPER_NAME,
} = process.env;

const production: EnvType = {
  GITHUB_CLIENT_ID: GITHUB_CLIENT_ID ?? "",
  GITHUB_CLIENT_SEC: GITHUB_CLIENT_SEC ?? "",
  NEXTAUTH_SECRET: NEXTAUTH_SECRET ?? "",
  SUPER_EMAIL: SUPER_EMAIL ?? "",
  SUPER_PASSWORD: SUPER_PASSWORD ?? "",
  SUPER_NAME: SUPER_NAME ?? "",
  BASE_URL: BASE_URL ?? "",
};

const development: EnvType = {
  GITHUB_CLIENT_ID: GITHUB_CLIENT_ID ?? "",
  GITHUB_CLIENT_SEC: GITHUB_CLIENT_SEC ?? "",
  NEXTAUTH_SECRET: NEXTAUTH_SECRET ?? "",
  SUPER_EMAIL: SUPER_EMAIL ?? "",
  SUPER_PASSWORD: SUPER_PASSWORD ?? "",
  SUPER_NAME: SUPER_NAME ?? "",
  BASE_URL: BASE_URL ?? "",
};

const config: ConfigType = {
  development,
  production,
};

export default config[ENV as keyof ConfigType];
