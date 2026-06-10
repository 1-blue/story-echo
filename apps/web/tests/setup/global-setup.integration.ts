import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import path, { join } from "node:path";
import { disconnectTestPrisma } from "../helpers/db";
import { getTestBaseUrl, hasIntegrationEnv } from "./env";

declare global {
  var __integrationServerProcess: ChildProcess | undefined;
}

const WEB_APP_ROOT = path.resolve(__dirname, "../..");
const PRODUCTION_BUILD_ID = join(WEB_APP_ROOT, ".next", "BUILD_ID");

function setServerProcess(process: ChildProcess | null) {
  globalThis.__integrationServerProcess = process ?? undefined;
}

async function runCommand(
  command: string,
  args: string[],
  options: { cwd: string; env?: NodeJS.ProcessEnv },
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: "inherit",
      shell: true,
      env: options.env ?? process.env,
    });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} failed: ${code}`)),
    );
  });
}

/** workflow에서 이미 build한 경우(.next/BUILD_ID 존재) 생략 — CI 이중 빌드 방지 */
async function ensureProductionBuild(): Promise<void> {
  if (existsSync(PRODUCTION_BUILD_ID)) {
    return;
  }
  console.log("[integration] .next production build not found — running pnpm build …");
  await runCommand("pnpm", ["build"], { cwd: WEB_APP_ROOT });
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
      const res = await fetch(`${url}/api/v1/health`, { signal: AbortSignal.timeout(5_000) });
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not become ready at ${url}`);
}

async function startProductionServer(baseUrl: string): Promise<ChildProcess> {
  const serverProcess = spawn("pnpm", ["exec", "next", "start", "-H", "127.0.0.1", "-p", "3000"], {
    cwd: WEB_APP_ROOT,
    stdio: "pipe",
    shell: true,
    detached: true,
    env: {
      ...process.env,
      PORT: "3000",
      HOSTNAME: "127.0.0.1",
      NEXT_PUBLIC_APP_URL: baseUrl,
    },
  });

  serverProcess.stdout?.on("data", (d) => process.stdout.write(d));
  serverProcess.stderr?.on("data", (d) => process.stderr.write(d));
  serverProcess.unref();
  return serverProcess;
}

export default async function globalSetup() {
  if (!hasIntegrationEnv()) {
    return;
  }

  const baseUrl = getTestBaseUrl();

  // 이미 떠 있는 서버 재사용 (로컬에서 next start / dev 병행 시)
  try {
    const res = await fetch(`${baseUrl}/api/v1/health`, { signal: AbortSignal.timeout(5_000) });
    if (res.ok) {
      process.env.TEST_BASE_URL = baseUrl;
      console.log(`[integration] reusing server at ${baseUrl}`);
      return async () => {
        await disconnectTestPrisma();
      };
    }
  } catch {
    // start server below
  }

  await ensureProductionBuild();

  const serverProcess = await startProductionServer(baseUrl);
  setServerProcess(serverProcess);

  await waitForServer(baseUrl);
  process.env.TEST_BASE_URL = baseUrl;
  console.log(`[integration] server ready at ${baseUrl}`);

  return async () => {
    await stopIntegrationServer(globalThis.__integrationServerProcess);
    globalThis.__integrationServerProcess = undefined;
    await disconnectTestPrisma();
  };
}
