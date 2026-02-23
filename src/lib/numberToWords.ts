import { toWords } from "number-to-words";

export function amountToWords(amount: number): string {
  if (amount <= 0) return "";
  const whole = Math.floor(amount);
  const words = toWords(whole);
  const capitalized = words
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `Kenya Shillings ${capitalized} Only`;
}
