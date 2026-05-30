import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateStoryRequestSchema,
  ErrorResponseSchema,
  HealthResponseSchema,
  StoryListResponseSchema,
  StoryResponseSchema,
} from "../packages/schemas/src/index.ts";

const registry = new OpenAPIRegistry();

registry.register("HealthResponse", HealthResponseSchema);
registry.register("StoryListResponse", StoryListResponseSchema);
registry.register("StoryResponse", StoryResponseSchema);
registry.register("CreateStoryRequest", CreateStoryRequestSchema);
registry.register("ErrorResponse", ErrorResponseSchema);

registry.registerPath({
  method: "get",
  path: "/api/v1/health",
  tags: ["Health"],
  responses: {
    200: {
      description: "Service health",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/stories",
  tags: ["Stories"],
  responses: {
    200: {
      description: "List stories",
      content: {
        "application/json": {
          schema: StoryListResponseSchema,
        },
      },
    },
    503: {
      description: "Database unavailable",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/stories",
  tags: ["Stories"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateStoryRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Story created",
      content: {
        "application/json": {
          schema: StoryResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    503: {
      description: "Database unavailable",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

const document = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "StoryEcho API",
    version: "0.0.1",
    description: "StoryEcho MVP API — SSOT from @storyecho/schemas",
  },
  servers: [{ url: "http://localhost:3000", description: "Local dev" }],
});

const outputPath = resolve(process.cwd(), "openapi.json");
writeFileSync(outputPath, JSON.stringify(document, null, 2));
console.log(`OpenAPI spec written to ${outputPath}`);
