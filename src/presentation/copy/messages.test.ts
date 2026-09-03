import { enMessages } from "@/presentation/copy/en";
import { idMessages } from "@/presentation/copy/id";

describe("shared shell messages", () => {
  it.each([idMessages, enMessages])(
    "provides complete, non-fragment shell copy",
    (messages) => {
      expect(Object.values(messages.shell.tabs)).toHaveLength(5);
      expect(
        Object.values(messages.shell.tabs).every(
          (message) => message.trim().length > 0,
        ),
      ).toBe(true);
      expect(
        Object.values(messages.empty).every(({ action, description, title }) =>
          [action, description, title].every(
            (message) => message.trim().length > 0,
          ),
        ),
      ).toBe(true);
    },
  );
});
