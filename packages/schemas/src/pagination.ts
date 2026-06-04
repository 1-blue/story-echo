import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const PaginationQuerySchema = z
  .object({
    cursor: z.string().uuid().optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .openapi("PaginationQuery");

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const PaginationMetaSchema = z
  .object({
    nextCursor: z.string().uuid().nullable(),
    hasMore: z.boolean(),
  })
  .openapi("PaginationMeta");

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export const ListPaginationMetaSchema = z
  .object({
    pagination: PaginationMetaSchema,
  })
  .openapi("ListPaginationMeta");

export type ListPaginationMeta = z.infer<typeof ListPaginationMetaSchema>;
