import type { PaginationMeta } from "@storyecho/schemas";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export function parsePagination(searchParams: URLSearchParams): {
  cursor?: string;
  limit: number;
} {
  const rawLimit = searchParams.get("limit");
  const parsedLimit = rawLimit ? Number.parseInt(rawLimit, 10) : DEFAULT_LIMIT;
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(MAX_LIMIT, Math.max(1, parsedLimit))
    : DEFAULT_LIMIT;
  const cursor = searchParams.get("cursor") ?? undefined;
  return { cursor, limit };
}

export function buildCursorResponse<T extends { id: string }>(
  items: T[],
  limit: number,
): { items: T[]; pagination: PaginationMeta } {
  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;
  const last = page.at(-1);
  return {
    items: page,
    pagination: {
      nextCursor: hasMore && last ? last.id : null,
      hasMore,
    },
  };
}

type CursorRow = { id: string; createdAt: Date };

/** createdAt desc, id desc 기준 다음 페이지 필터 */
export function cursorWhereClause(cursorRow: CursorRow | null) {
  if (!cursorRow) return {};
  return {
    OR: [
      { createdAt: { lt: cursorRow.createdAt } },
      {
        createdAt: cursorRow.createdAt,
        id: { lt: cursorRow.id },
      },
    ],
  };
}

export async function resolveCursorRow<T extends { id: string; createdAt: Date }>(
  findById: (id: string) => Promise<T | null>,
  cursor?: string,
): Promise<T | null> {
  if (!cursor) return null;
  return findById(cursor);
}
