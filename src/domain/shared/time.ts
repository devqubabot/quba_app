import { Brand, DomainInvariantError } from "./values";

export type Instant = Brand<string, "Instant">;
export type LocalDate = Brand<string, "LocalDate">;

const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const EXPLICIT_OFFSET_PATTERN = /(?:Z|[+-]\d{2}:\d{2})$/;

export function instant(value: string): Instant {
  const epochMilliseconds = Date.parse(value);
  if (
    !value.includes("T") ||
    !EXPLICIT_OFFSET_PATTERN.test(value) ||
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
  const match = LOCAL_DATE_PATTERN.exec(value);
  if (!match) {
    throw new DomainInvariantError(
      "invalid_local_date",
      "Local date must use YYYY-MM-DD.",
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  const canonical = parsed.toISOString().slice(0, 10);

  if (canonical !== value) {
    throw new DomainInvariantError(
      "invalid_local_date",
      "Local date must identify a real calendar date.",
    );
  }

  return value as LocalDate;
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
