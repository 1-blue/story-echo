import { describe, expect, it } from "vitest";
import { buildCursorResponse } from "@/lib/api/pagination";

describe("buildCursorResponse", () => {
  it("returns hasMore false when items fit in limit", () => {
    const items = [{ id: "a" }, { id: "b" }];
    const result = buildCursorResponse(items, 20);
    expect(result.items).toHaveLength(2);
    expect(result.pagination.hasMore).toBe(false);
    expect(result.pagination.nextCursor).toBeNull();
  });

  it("trims to limit and sets nextCursor when extra item exists", () => {
    const items = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const result = buildCursorResponse(items, 2);
    expect(result.items.map((i) => i.id)).toEqual(["a", "b"]);
    expect(result.pagination.hasMore).toBe(true);
    expect(result.pagination.nextCursor).toBe("b");
  });
});
