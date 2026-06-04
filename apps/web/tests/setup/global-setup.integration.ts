import type { ChildProcess } from "node:child_process";
import { spawn, type ChildProcess as NodeChildProcess } from "node:child_process";
import path from "node:path";
import { getTestBaseUrl, hasIntegrationEnv } from "./env";
import { disconnectTestPrisma } from "../helpers/db";

declare global {
  // eslint-disable-next-line no-var
  var __integrationServerProcess: ChildProcess | undefined;
}

function setServerProcess(process: NodeChildProcess | null) {
  globalThis.__integrationServerProcess = process ?? undefined;
}

async function stopIntegrationServer(serverProcess: ChildProcess | undefined) {
  const pid = serverProcess?.pid;
  if (!pid) return;

  await new Promise<void>((resolve) => {
    serverProcess?.once("close", () => resolve());
    try {
      if (process.platform === "win32") {
        process.kill(pid);
      } else {
        process.kill(-pid, "SIGTERM");
      }
    } catch {
      resolve();
      return;
    }
    setTimeout(() => {
      try {
        if (process.platform === "win32") {
          process.kill(pid, "SIGKILL");
        } else {
          process.kill(-pid, "SIGKILL");
        }
      } catch {
        // already stopped
      }
      resolve();
    }, 5_000);
  });
}

async function waitForServer(url: string, timeoutMs = 120_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${url}/api/v1/health`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not become ready at ${url}`);
}

export default async function globalSetup() {
  if (!hasIntegrationEnv()) {
    return;
  }

  const baseUrl = getTestBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    if (res.ok) {
      process.env.TEST_BASE_URL = baseUrl;
      return async () => {
        await disconnectTestPrisma();
      };
    }
  } catch {
    // start server
  }

  if (process.env.CI) {
    await new Promise<void>((resolve, reject) => {
      const build = spawn("pnpm", ["build"], {
        cwd: path.resolve(__dirname, "../.."),
        stdio: "inherit",
        shell: true,
        env: process.env,
      });
      build.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`build failed: ${code}`))));
    });
  }

  const serverProcess = spawn(
    "pnpm",
    ["exec", "next", "start", "-H", "127.0.0.1", "-p", "3000"],
    {
      cwd: path.resolve(__dirname, "../.."),
      stdio: "pipe",
      shell: true,
      detached: true,
      env: {
        ...process.env,
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
        NEXT_PUBLIC_APP_URL: baseUrl,
      },
    },
  );

  serverProcess.stdout?.on("data", (d) => process.stdout.write(d));
  serverProcess.stderr?.on("data", (d) => process.stderr.write(d));
  serverProcess.unref();
  setServerProcess(serverProcess);

  await waitForServer(baseUrl);
  process.env.TEST_BASE_URL = baseUrl;

  return async () => {
    await stopIntegrationServer(globalThis.__integrationServerProcess);
    globalThis.__integrationServerProcess = undefined;
    await disconnectTestPrisma();
  };
}
