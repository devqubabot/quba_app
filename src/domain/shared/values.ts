declare const domainBrand: unique symbol;

export type Brand<Value, Name extends string> = Value & {
  readonly [domainBrand]: Name;
};

export class DomainInvariantError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "DomainInvariantError";
  }
}

export type HabitId = Brand<string, "HabitId">;
export type OccurrenceId = Brand<string, "OccurrenceId">;
export type ActivityRunId = Brand<string, "ActivityRunId">;
export type ActivityEventId = Brand<string, "ActivityEventId">;
export type XpLedgerId = Brand<string, "XpLedgerId">;

function identifier<Identifier extends string>(
  value: string,
  label: string,
): Identifier {
  if (value.trim().length === 0) {
    throw new DomainInvariantError(
      "empty_identifier",
      `${label} must not be empty.`,
    );
  }

  return value as Identifier;
}

export const habitId = (value: string): HabitId =>
  identifier<HabitId>(value, "Habit ID");

export const occurrenceId = (value: string): OccurrenceId =>
  identifier<OccurrenceId>(value, "Occurrence ID");

export const activityRunId = (value: string): ActivityRunId =>
  identifier<ActivityRunId>(value, "Activity run ID");

export const activityEventId = (value: string): ActivityEventId =>
  identifier<ActivityEventId>(value, "Activity event ID");

export const xpLedgerId = (value: string): XpLedgerId =>
  identifier<XpLedgerId>(value, "XP ledger ID");

export type ProgressValue = Brand<number, "ProgressValue">;
export type PositiveProgressDelta = Brand<number, "PositiveProgressDelta">;
export type TargetValue = Brand<number, "TargetValue">;
export type ConfigurationVersion = Brand<number, "ConfigurationVersion">;
export type XpAmount = Brand<number, "XpAmount">;
export type DeviceClockOffsetMinutes = Brand<
  number,
  "DeviceClockOffsetMinutes"
>;

function assertSafeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new DomainInvariantError(
      "invalid_integer",
      `${label} must be a safe integer.`,
    );
  }
}

export function progressValue(value: number): ProgressValue {
  assertSafeInteger(value, "Progress value");
  if (value < 0) {
    throw new DomainInvariantError(
      "negative_progress",
      "Progress value must not be negative.",
    );
  }

  return value as ProgressValue;
}

export function positiveProgressDelta(value: number): PositiveProgressDelta {
  assertSafeInteger(value, "Progress delta");
  if (value <= 0) {
    throw new DomainInvariantError(
      "non_positive_progress_delta",
      "Progress delta must be positive.",
    );
  }

  return value as PositiveProgressDelta;
}

export function targetValue(value: number): TargetValue {
  assertSafeInteger(value, "Target value");
  if (value <= 0) {
    throw new DomainInvariantError(
      "non_positive_target",
      "Target value must be positive.",
    );
  }

  return value as TargetValue;
}

export function configurationVersion(value: number): ConfigurationVersion {
  assertSafeInteger(value, "Configuration version");
  if (value < 0) {
    throw new DomainInvariantError(
      "negative_configuration_version",
      "Configuration version must not be negative.",
    );
  }

  return value as ConfigurationVersion;
}

export function xpAmount(value: number): XpAmount {
  assertSafeInteger(value, "XP amount");
  if (value <= 0) {
    throw new DomainInvariantError(
      "non_positive_xp",
      "XP amount must be positive.",
    );
  }

  return value as XpAmount;
}

export function deviceClockOffsetMinutes(
  value: number,
): DeviceClockOffsetMinutes {
  assertSafeInteger(value, "Device clock offset");
  if (value < -1_440 || value > 1_440) {
    throw new DomainInvariantError(
      "invalid_device_clock_offset",
      "Device clock offset must be within 24 hours of UTC.",
    );
  }

  return value as DeviceClockOffsetMinutes;
}
