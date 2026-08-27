import { Brand, DomainInvariantError } from "./values";

export type Instant = Brand<string, "Instant">;
export type LocalDate = Brand<string, "LocalDate">;

const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const INSTANT_PATTERN =
  /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/;

export function instant(value: string): Instant {
  const match = INSTANT_PATTERN.exec(value);
  const epochMilliseconds = Date.parse(value);
  if (
    match === null ||
    !isValidCalendarDate(match[1] ?? "") ||
    Number(match[2]) > 23 ||
    Number(match[3]) > 59 ||
    Number(match[4]) > 59 ||
    (match[5] !== undefined && Number(match[5]) > 23) ||
    (match[6] !== undefined && Number(match[6]) > 59) ||
    Number.isNaN(epochMilliseconds)
  ) {
    throw new DomainInvariantError(
      "invalid_instant",
      "Instant must be an ISO 8601 timestamp with an explicit UTC offset.",
    );
  }

  return new Date(epochMilliseconds).toISOString() as Instant;
}

export function localDate(value: string): LocalDate {
  if (!LOCAL_DATE_PATTERN.test(value)) {
    throw new DomainInvariantError(
      "invalid_local_date",
      "Local date must use YYYY-MM-DD.",
    );
  }

  if (!isValidCalendarDate(value)) {
    throw new DomainInvariantError(
      "invalid_local_date",
      "Local date must identify a real calendar date.",
    );
  }

  return value as LocalDate;
}

function isValidCalendarDate(value: string): boolean {
  const match = LOCAL_DATE_PATTERN.exec(value);
  if (match === null) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function previousLocalDate(value: LocalDate): LocalDate {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() - 1);
  return localDate(parsed.toISOString().slice(0, 10));
}

export function weekdayOf(value: LocalDate): Weekday {
  return new Date(`${value}T00:00:00.000Z`).getUTCDay() as Weekday;
}

export function isAfterInstant(left: Instant, right: Instant): boolean {
  return Date.parse(left) > Date.parse(right);
}

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
