import { describe, expect, it } from "vitest";
import { CreateCommunityPostRequestSchema } from "./community";
import { CreateStoryRequestSchema, UpdateStoryRequestSchema } from "./story";
import { LoginRequestSchema, SignupRequestSchema, UpdateUserRequestSchema } from "./user";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("CreateStoryRequestSchema", () => {
  it("accepts minimal private story", () => {
    const result = CreateStoryRequestSchema.safeParse({
      bodyText: "오늘의 이야기",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visibility).toBe("private");
      expect(result.data.photoUrls).toEqual([]);
    }
  });

  it("accepts community visibility with photos", () => {
    const result = CreateStoryRequestSchema.safeParse({
      bodyText: "공개 이야기",
      visibility: "community",
      photoUrls: ["https://example.com/a.jpg"],
      questionId: VALID_UUID,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty body", () => {
    expect(CreateStoryRequestSchema.safeParse({ bodyText: "" }).success).toBe(false);
  });

  it("rejects body over 5000 chars", () => {
    expect(CreateStoryRequestSchema.safeParse({ bodyText: "a".repeat(5001) }).success).toBe(false);
  });

  it("rejects more than 8 photos", () => {
    const urls = Array.from({ length: 9 }, (_, i) => `https://example.com/${i}.jpg`);
    expect(CreateStoryRequestSchema.safeParse({ bodyText: "x", photoUrls: urls }).success).toBe(
      false,
    );
  });

  it("rejects invalid photo url", () => {
    expect(
      CreateStoryRequestSchema.safeParse({ bodyText: "x", photoUrls: ["not-a-url"] }).success,
    ).toBe(false);
  });
});

describe("UpdateStoryRequestSchema", () => {
  it("requires at least one field", () => {
    expect(UpdateStoryRequestSchema.safeParse({}).success).toBe(false);
  });

  it("accepts bookmark toggle", () => {
    expect(UpdateStoryRequestSchema.safeParse({ isBookmarked: true }).success).toBe(true);
  });
});

describe("LoginRequestSchema", () => {
  it("accepts valid credentials shape", () => {
    expect(
      LoginRequestSchema.safeParse({ email: "user@example.com", password: "password1" }).success,
    ).toBe(true);
  });

  it("rejects short password", () => {
    expect(
      LoginRequestSchema.safeParse({ email: "user@example.com", password: "short" }).success,
    ).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(
      LoginRequestSchema.safeParse({ email: "not-email", password: "password1" }).success,
    ).toBe(false);
  });
});

describe("SignupRequestSchema", () => {
  it("accepts optional nickname", () => {
    const result = SignupRequestSchema.safeParse({
      email: "new@example.com",
      password: "password1",
      nickname: "닉네임",
    });
    expect(result.success).toBe(true);
  });
});

describe("UpdateUserRequestSchema", () => {
  it("accepts fontSize patch", () => {
    expect(UpdateUserRequestSchema.safeParse({ fontSize: "lg" }).success).toBe(true);
  });

  it("rejects empty nickname", () => {
    expect(UpdateUserRequestSchema.safeParse({ nickname: "" }).success).toBe(false);
  });
});

describe("CreateCommunityPostRequestSchema", () => {
  it("accepts body text", () => {
    expect(CreateCommunityPostRequestSchema.safeParse({ bodyText: "토론 글" }).success).toBe(true);
  });

  it("rejects empty body", () => {
    expect(CreateCommunityPostRequestSchema.safeParse({ bodyText: "" }).success).toBe(false);
  });
});
