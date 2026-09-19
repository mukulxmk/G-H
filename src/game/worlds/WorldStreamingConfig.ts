export interface WorldStreamingConfig {
  chunkSize: number;
  streamingRadius: number;
}

export function validateWorldStreamingConfig(
  config: WorldStreamingConfig
) {
  if (
    !Number.isFinite(config.chunkSize) ||
    config.chunkSize <= 0
  ) {
    throw new Error(
      "World chunk size must be greater than zero."
    );
  }

  if (
    !Number.isInteger(
      config.streamingRadius
    ) ||
    config.streamingRadius < 0
  ) {
    throw new Error(
      "World streaming radius must be a non-negative integer."
    );
  }
}