/**
 * Merges conditional class names into a single string.
 */
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

/**
 * Formats a number to Indian Rupees representation.
 * E.g., 250000 => ₹2.5 Lakh
 */
export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats average package values to LPA representation.
 * E.g., 12.5 => 12.5 LPA
 */
export function formatLPA(lpa: number): string {
  return `${lpa.toFixed(lpa % 1 === 0 ? 0 : 1)} LPA`;
}
