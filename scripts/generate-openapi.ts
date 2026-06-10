import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  CommunityCommentItemResponseSchema,
  CommunityCommentResponseSchema,
  CommunityPostDetailResponseSchema,
  CommunityPostListResponseSchema,
  CommunityPostResponseSchema,
  CommunityUserSearchResponseSchema,
  CreateCommunityCommentRequestSchema,
  CreateCommunityPostRequestSchema,
  ReportCommunityPostRequestSchema,
  ToggleCommunityReactionRequestSchema,
  ToggleCommunityReactionResponseSchema,
  UpdateCommunityCommentRequestSchema,
  UpdateCommunityPostRequestSchema,
} from "../packages/schemas/src/community.ts";
import {
  CapsuleStoryDetailResponseSchema,
  CapsuleStoryListResponseSchema,
  CreateStoryRequestSchema,
  DrawerStoryListResponseSchema,
  EmailNotVerifiedErrorSchema,
  ErrorResponseSchema,
  HealthResponseSchema,
  PresignUploadRequestSchema,
  PresignUploadResponseSchema,
  PublicQuestionAnswerListResponseSchema,
  PublicStoryDetailResponseSchema,
  PublicStoryFeedListResponseSchema,
  QuestionArchiveListResponseSchema,
  QuestionResponseSchema,
  StoryCreateConflictErrorSchema,
  StoryDetailResponseSchema,
  StoryListResponseSchema,
  StoryResponseSchema,
  TodayQuestionResponseSchema,
  TodayStoryExistsErrorSchema,
  UpdateStoryRequestSchema,
} from "../packages/schemas/src/index.ts";
import {
  MarkNotificationsReadRequestSchema,
  NotificationListResponseSchema,
} from "../packages/schemas/src/notification.ts";
import { PaginationQuerySchema } from "../packages/schemas/src/pagination.ts";
import {
  CreateGuestRequestSchema,
  LoginRequestSchema,
  SignupRequestSchema,
  UpdateUserRequestSchema,
  UserMeResponseSchema,
} from "../packages/schemas/src/user.ts";

const listPaginationQuery = PaginationQuerySchema.extend({});

const registry = new OpenAPIRegistry();

registry.register("HealthResponse", HealthResponseSchema);
registry.register("StoryListResponse", StoryListResponseSchema);
registry.register("StoryResponse", StoryResponseSchema);
registry.register("DrawerStoryListResponse", DrawerStoryListResponseSchema);
registry.register("StoryDetailResponse", StoryDetailResponseSchema);
registry.register("PublicStoryFeedListResponse", PublicStoryFeedListResponseSchema);
registry.register("PublicStoryDetailResponse", PublicStoryDetailResponseSchema);
registry.register("CapsuleStoryListResponse", CapsuleStoryListResponseSchema);
registry.register("CapsuleStoryDetailResponse", CapsuleStoryDetailResponseSchema);
registry.register("CreateStoryRequest", CreateStoryRequestSchema);
registry.register("UpdateStoryRequest", UpdateStoryRequestSchema);
registry.register("TodayQuestionResponse", TodayQuestionResponseSchema);
registry.register("QuestionArchiveListResponse", QuestionArchiveListResponseSchema);
registry.register("QuestionResponse", QuestionResponseSchema);
registry.register("PublicQuestionAnswerListResponse", PublicQuestionAnswerListResponseSchema);
registry.register("PresignUploadRequest", PresignUploadRequestSchema);
registry.register("PresignUploadResponse", PresignUploadResponseSchema);
registry.register("ErrorResponse", ErrorResponseSchema);
registry.register("EmailNotVerifiedError", EmailNotVerifiedErrorSchema);
registry.register("CommunityPostListResponse", CommunityPostListResponseSchema);
registry.register("CommunityPostResponse", CommunityPostResponseSchema);
registry.register("CommunityPostDetailResponse", CommunityPostDetailResponseSchema);
registry.register("CreateCommunityPostRequest", CreateCommunityPostRequestSchema);
registry.register("CreateCommunityCommentRequest", CreateCommunityCommentRequestSchema);
registry.register("UpdateCommunityPostRequest", UpdateCommunityPostRequestSchema);
registry.register("UpdateCommunityCommentRequest", UpdateCommunityCommentRequestSchema);
registry.register("CommunityCommentItemResponse", CommunityCommentItemResponseSchema);
registry.register("UserMeResponse", UserMeResponseSchema);
registry.register("CreateGuestRequest", CreateGuestRequestSchema);
registry.register("UpdateUserRequest", UpdateUserRequestSchema);
registry.register("LoginRequest", LoginRequestSchema);
registry.register("SignupRequest", SignupRequestSchema);
registry.register("CommunityCommentResponse", CommunityCommentResponseSchema);
registry.register("ToggleCommunityReactionRequest", ToggleCommunityReactionRequestSchema);
registry.register("ToggleCommunityReactionResponse", ToggleCommunityReactionResponseSchema);
registry.register("CommunityUserSearchResponse", CommunityUserSearchResponseSchema);
registry.register("NotificationListResponse", NotificationListResponseSchema);
registry.register("MarkNotificationsReadRequest", MarkNotificationsReadRequestSchema);
registry.register("ReportCommunityPostRequest", ReportCommunityPostRequestSchema);

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
  path: "/api/v1/questions/today",
  tags: ["Questions"],
  responses: {
    200: {
      description: "Today's question",
      content: {
        "application/json": {
          schema: TodayQuestionResponseSchema,
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
  method: "get",
  path: "/api/v1/questions",
  tags: ["Questions"],
  responses: {
    200: {
      description: "365-day question archive",
      content: {
        "application/json": {
          schema: QuestionArchiveListResponseSchema,
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
  method: "get",
  path: "/api/v1/questions/{id}",
  tags: ["Questions"],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    200: {
      description: "Question detail with public story count",
      content: {
        "application/json": {
          schema: QuestionResponseSchema,
        },
      },
    },
    404: {
      description: "Not found",
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

registry.registerPath({
  method: "post",
  path: "/api/v1/uploads/presign",
  tags: ["Uploads"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: PresignUploadRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Presigned upload URL",
      content: {
        "application/json": {
          schema: PresignUploadResponseSchema,
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
      description: "AWS not configured",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
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
  method: "get",
  path: "/api/v1/stories/drawer",
  tags: ["Stories"],
  request: {
    query: listPaginationQuery,
  },
  responses: {
    200: {
      description: "Drawer story list for current user",
      content: {
        "application/json": {
          schema: DrawerStoryListResponseSchema,
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
  method: "get",
  path: "/api/v1/stories/public",
  tags: ["Stories"],
  request: {
    query: listPaginationQuery.extend({
      questionId: z.string().uuid().optional(),
    }),
  },
  responses: {
    200: {
      description: "Public community story feed",
      content: { "application/json": { schema: PublicStoryFeedListResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/stories/public/{id}",
  tags: ["Stories"],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    200: {
      description: "Public story detail with comments",
      content: { "application/json": { schema: PublicStoryDetailResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/stories/public/{id}/comments",
  tags: ["Stories"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: CreateCommunityCommentRequestSchema } },
    },
  },
  responses: {
    201: {
      description: "Comment created",
      content: { "application/json": { schema: CommunityCommentResponseSchema } },
    },
    400: {
      description: "Validation or email not verified",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/stories/public/{id}/reactions",
  tags: ["Stories"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: ToggleCommunityReactionRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Reaction counts updated",
      content: { "application/json": { schema: ToggleCommunityReactionResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/stories/public/{id}/report",
  tags: ["Stories"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: ReportCommunityPostRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Story reported",
      content: {
        "application/json": {
          schema: z.object({ data: z.object({ ok: z.literal(true) }) }),
        },
      },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/story-comments/{id}",
  tags: ["Stories"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: UpdateCommunityCommentRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Comment updated",
      content: { "application/json": { schema: CommunityCommentItemResponseSchema } },
    },
    403: {
      description: "Forbidden",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/story-comments/{id}",
  tags: ["Stories"],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    204: { description: "Comment deleted" },
    403: {
      description: "Forbidden",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/story-comments/{id}/reactions",
  tags: ["Stories"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: ToggleCommunityReactionRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Reaction counts updated",
      content: { "application/json": { schema: ToggleCommunityReactionResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/stories/{id}",
  tags: ["Stories"],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: "Private story detail for current user",
      content: {
        "application/json": {
          schema: StoryDetailResponseSchema,
        },
      },
    },
    404: {
      description: "Story not found",
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

registry.registerPath({
  method: "get",
  path: "/api/v1/stories/capsule",
  tags: ["Stories"],
  request: {
    query: listPaginationQuery,
  },
  responses: {
    200: {
      description: "Capsule story list for current user",
      content: {
        "application/json": {
          schema: CapsuleStoryListResponseSchema,
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
  method: "get",
  path: "/api/v1/stories/capsule/{id}",
  tags: ["Stories"],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: "Capsule story detail",
      content: {
        "application/json": {
          schema: CapsuleStoryDetailResponseSchema,
        },
      },
    },
    404: {
      description: "Not found",
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

registry.registerPath({
  method: "patch",
  path: "/api/v1/stories/{id}",
  tags: ["Stories"],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateStoryRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Story updated",
      content: {
        "application/json": {
          schema: StoryDetailResponseSchema,
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
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
    409: {
      description: "Capsule sealed",
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

registry.registerPath({
  method: "delete",
  path: "/api/v1/stories/{id}",
  tags: ["Stories"],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    204: {
      description: "Story deleted",
    },
    404: {
      description: "Not found",
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
      description: "Validation error or email not verified",
      content: {
        "application/json": {
          schema: z.union([ErrorResponseSchema, EmailNotVerifiedErrorSchema]),
        },
      },
    },
    409: {
      description: "Story create conflict (not today's question or duplicate today story)",
      content: {
        "application/json": {
          schema: StoryCreateConflictErrorSchema,
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
  method: "get",
  path: "/api/v1/community/posts",
  tags: ["Community"],
  request: {
    query: listPaginationQuery.extend({
      q: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "Community feed",
      content: { "application/json": { schema: CommunityPostListResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/community/posts",
  tags: ["Community"],
  request: {
    body: {
      content: { "application/json": { schema: CreateCommunityPostRequestSchema } },
    },
  },
  responses: {
    201: {
      description: "Community post created",
      content: { "application/json": { schema: CommunityPostResponseSchema } },
    },
    400: {
      description: "Validation or email not verified",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/community/posts/{id}",
  tags: ["Community"],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    200: {
      description: "Community post detail",
      content: { "application/json": { schema: CommunityPostDetailResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/community/posts/{id}",
  tags: ["Community"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: UpdateCommunityPostRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Community post updated",
      content: { "application/json": { schema: CommunityPostResponseSchema } },
    },
    400: {
      description: "Validation or email not verified",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    403: {
      description: "Forbidden",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/community/posts/{id}",
  tags: ["Community"],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    204: {
      description: "Community post deleted",
    },
    403: {
      description: "Forbidden",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/community/posts/{id}/reactions",
  tags: ["Community"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: ToggleCommunityReactionRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Reaction counts updated",
      content: { "application/json": { schema: ToggleCommunityReactionResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/community/posts/{id}/comments",
  tags: ["Community"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: CreateCommunityCommentRequestSchema } },
    },
  },
  responses: {
    201: {
      description: "Comment created",
      content: { "application/json": { schema: CommunityCommentResponseSchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/community/comments/{id}/reactions",
  tags: ["Community"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: ToggleCommunityReactionRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Reaction counts updated",
      content: { "application/json": { schema: ToggleCommunityReactionResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/community/comments/{id}",
  tags: ["Community"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: UpdateCommunityCommentRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Comment updated",
      content: { "application/json": { schema: CommunityCommentItemResponseSchema } },
    },
    403: {
      description: "Forbidden",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/community/comments/{id}",
  tags: ["Community"],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    204: {
      description: "Comment deleted",
    },
    403: {
      description: "Forbidden",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/community/users/search",
  tags: ["Community"],
  request: {
    query: z.object({
      q: z.string().optional(),
      postId: z.string().uuid().optional(),
    }),
  },
  responses: {
    200: {
      description: "User search for mentions",
      content: { "application/json": { schema: CommunityUserSearchResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/notifications",
  tags: ["Notifications"],
  request: {
    query: listPaginationQuery,
  },
  responses: {
    200: {
      description: "Notification list",
      content: { "application/json": { schema: NotificationListResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/notifications",
  tags: ["Notifications"],
  request: {
    body: {
      content: { "application/json": { schema: MarkNotificationsReadRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Notifications marked read",
      content: {
        "application/json": {
          schema: z.object({ data: z.object({ ok: z.literal(true) }) }),
        },
      },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/community/posts/{id}/report",
  tags: ["Community"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: ReportCommunityPostRequestSchema } },
    },
  },
  responses: {
    200: {
      description: "Post reported",
      content: {
        "application/json": {
          schema: z.object({ data: z.object({ ok: z.literal(true) }) }),
        },
      },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/users/guest",
  tags: ["Users"],
  request: {
    body: { content: { "application/json": { schema: CreateGuestRequestSchema } } },
  },
  responses: {
    200: {
      description: "Guest user",
      content: { "application/json": { schema: UserMeResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/users/me/public-questions",
  tags: ["Users"],
  responses: {
    200: {
      description: "Public question answers for current user",
      content: { "application/json": { schema: PublicQuestionAnswerListResponseSchema } },
    },
    401: {
      description: "Device id required",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/users/me",
  tags: ["Users"],
  responses: {
    200: {
      description: "Current user",
      content: { "application/json": { schema: UserMeResponseSchema } },
    },
    401: {
      description: "Device id required",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/users/me",
  tags: ["Users"],
  request: {
    body: { content: { "application/json": { schema: UpdateUserRequestSchema } } },
  },
  responses: {
    200: {
      description: "Updated user",
      content: { "application/json": { schema: UserMeResponseSchema } },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/users/me",
  tags: ["Users"],
  responses: {
    200: {
      description: "Account deleted",
      content: {
        "application/json": {
          schema: z.object({ data: z.object({ ok: z.literal(true) }) }),
        },
      },
    },
    503: {
      description: "Database unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/login",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: LoginRequestSchema } } },
  },
  responses: {
    200: {
      description: "Logged in",
      content: { "application/json": { schema: UserMeResponseSchema } },
    },
    503: {
      description: "Auth unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/signup",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: SignupRequestSchema } } },
  },
  responses: {
    201: {
      description: "Signed up",
      content: { "application/json": { schema: UserMeResponseSchema } },
    },
    503: {
      description: "Auth unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/logout",
  tags: ["Auth"],
  responses: {
    200: {
      description: "Logged out",
      content: {
        "application/json": {
          schema: z.object({ data: z.object({ ok: z.literal(true) }) }),
        },
      },
    },
    503: {
      description: "Auth unavailable",
      content: { "application/json": { schema: ErrorResponseSchema } },
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
