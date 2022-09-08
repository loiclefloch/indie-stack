import { validateUserEmail } from "./user.server";

test("validateUserEmail returns false for non-emails", () => {
  expect(validateUserEmail(undefined)).toBe(false);
  expect(validateUserEmail(null)).toBe(false);
  expect(validateUserEmail("")).toBe(false);
  expect(validateUserEmail("not-an-email")).toBe(false);
  expect(validateUserEmail("n@")).toBe(false);
});

test("validateUserEmail returns true for emails", () => {
  expect(validateUserEmail("kody@example.com")).toBe(true);
});
