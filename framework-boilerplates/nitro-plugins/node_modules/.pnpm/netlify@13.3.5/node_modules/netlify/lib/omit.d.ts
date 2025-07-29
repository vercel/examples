export default function omit<T extends Record<string | number | symbol, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
