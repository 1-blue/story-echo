import { defineConfig } from "orval";

export default defineConfig({
  storyecho: {
    input: "./openapi.json",
    output: {
      target: "./packages/api-client/src/generated/endpoints.ts",
      schemas: "./packages/api-client/src/generated/models",
      client: "react-query",
      mode: "tags-split",
      override: {
        query: {
          useSuspenseQuery: true,
          version: 5,
        },
        mutator: {
          path: "./packages/api-client/src/custom-fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});
