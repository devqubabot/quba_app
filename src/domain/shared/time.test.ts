import { instant, localDate } from "./time";

describe("explicit domain time values", () => {
  it("normalizes an offset timestamp to a UTC instant", () => {
    expect(instant("2026-08-27T08:00:00+07:00")).toBe(
      "2026-08-27T01:00:00.000Z",
    );
  });

  it("rejects a timestamp without an explicit offset", () => {
    expect(() => instant("2026-08-27T08:00:00")).toThrow("explicit UTC offset");
  });

  it("rejects an impossible local calendar date", () => {
    expect(() => localDate("2026-02-30")).toThrow("real calendar date");
  });
});
