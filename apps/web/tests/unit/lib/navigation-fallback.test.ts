import { describe, expect, it } from "vitest";
import { getFallbackRoute, isShellRoot, normalizePath } from "@/lib/native/navigation-fallback";

describe("normalizePath", () => {
  it("strips /app prefix", () => {
    expect(normalizePath("/app/drawer")).toBe("/drawer");
    expect(normalizePath("/app")).toBe("/");
  });

  it("returns path unchanged when no /app prefix", () => {
    expect(normalizePath("/community")).toBe("/community");
  });
});

describe("isShellRoot", () => {
  it("returns true for tab roots", () => {
    expect(isShellRoot("/")).toBe(true);
    expect(isShellRoot("/drawer")).toBe(true);
    expect(isShellRoot("/community")).toBe(true);
    expect(isShellRoot("/capsule")).toBe(true);
    expect(isShellRoot("/settings")).toBe(true);
  });

  it("returns false for detail and write routes", () => {
    expect(isShellRoot("/drawer/abc")).toBe(false);
    expect(isShellRoot("/community/write")).toBe(false);
    expect(isShellRoot("/write")).toBe(false);
    expect(isShellRoot("/notifications")).toBe(false);
  });
});

describe("getFallbackRoute", () => {
  it("returns parent tab for detail routes", () => {
    expect(getFallbackRoute("/drawer/story-1")).toBe("/drawer");
    expect(getFallbackRoute("/community/post-1")).toBe("/community");
    expect(getFallbackRoute("/capsule/cap-1")).toBe("/capsule");
  });

  it("returns tab root for write routes", () => {
    expect(getFallbackRoute("/write")).toBe("/");
    expect(getFallbackRoute("/community/write")).toBe("/community");
    expect(getFallbackRoute("/capsule/write")).toBe("/capsule");
  });

  it("returns null for shell roots", () => {
    expect(getFallbackRoute("/")).toBe(null);
    expect(getFallbackRoute("/drawer")).toBe(null);
  });
});
