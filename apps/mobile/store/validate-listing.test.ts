import { describe, expect, it } from "vitest";
import { APP_STORE_KEYWORDS_STRING, appStoreListing, playStoreListing } from "./listing.ko";

describe("store listing limits", () => {
  it("Play Store title is within 30 characters", () => {
    expect(playStoreListing.title.length).toBeLessThanOrEqual(30);
    expect(playStoreListing.title.length).toBeGreaterThan(0);
  });

  it("Play Store short description is within 80 characters", () => {
    expect(playStoreListing.shortDescription.length).toBeLessThanOrEqual(80);
    expect(playStoreListing.shortDescription.length).toBeGreaterThan(0);
  });

  it("Play Store full description is within 4000 characters", () => {
    expect(playStoreListing.fullDescription.length).toBeLessThanOrEqual(4000);
    expect(playStoreListing.fullDescription.length).toBeGreaterThan(0);
  });

  it("App Store keywords string is within 100 characters", () => {
    expect(APP_STORE_KEYWORDS_STRING.length).toBeLessThanOrEqual(100);
    expect(APP_STORE_KEYWORDS_STRING.length).toBeGreaterThan(0);
  });

  it("App Store required fields are non-empty", () => {
    expect(appStoreListing.title.length).toBeGreaterThan(0);
    expect(appStoreListing.subtitle.length).toBeGreaterThan(0);
    expect(appStoreListing.description.length).toBeGreaterThan(0);
    expect(appStoreListing.privacyPolicyUrl).toMatch(/^https:\/\//);
    expect(appStoreListing.supportUrl).toMatch(/^mailto:/);
  });
});
