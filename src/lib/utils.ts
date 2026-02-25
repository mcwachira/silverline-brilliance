/**
 * Passthrough utility for class names.
 * Previously used tailwind-merge + clsx for runtime class merging, but removed to reduce bundle size.
 * If you need conditional class merging, use template literals or ternaries directly.
 */
export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ')
}
