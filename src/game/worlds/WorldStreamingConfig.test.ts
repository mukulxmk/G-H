import { expect, it } from 'vitest';
import { validateWorldStreamingConfig } from './WorldStreamingConfig';

it("accepts valid streaming configuration", () => {
  expect(() =>
    validateWorldStreamingConfig({
      chunkSize: 500,
      streamingRadius: 1,
    })
  ).not.toThrow();
});

it("rejects zero chunk size", () => {
  expect(() =>
    validateWorldStreamingConfig({
      chunkSize: 0,
      streamingRadius: 1,
    })
  ).toThrow();
});

it("rejects negative chunk size", () => {
  expect(() =>
    validateWorldStreamingConfig({
      chunkSize: -500,
      streamingRadius: 1,
    })
  ).toThrow();
});

it("rejects negative streaming radius", () => {
  expect(() =>
    validateWorldStreamingConfig({
      chunkSize: 500,
      streamingRadius: -1,
    })
  ).toThrow();
});

it("rejects fractional streaming radius", () => {
  expect(() =>
    validateWorldStreamingConfig({
      chunkSize: 500,
      streamingRadius: 1.5,
    })
  ).toThrow();
});