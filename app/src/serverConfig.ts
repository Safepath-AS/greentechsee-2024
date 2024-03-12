interface ServerConfig {
  apiUrl: string;
}

interface CustomWindow extends Window {
  serverConfig: ServerConfig;
}

declare const window: CustomWindow;

const defaultConfig: ServerConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
};

export const serverConfig: ServerConfig = window.serverConfig;

const preReplaceConfig: ServerConfig = {
  apiUrl: "__API_URL__",
};

for (const key of Object.keys(serverConfig) as Array<keyof ServerConfig>) {
  if (serverConfig[key] === preReplaceConfig[key]) {
    serverConfig[key] = defaultConfig[key];
  }
}
