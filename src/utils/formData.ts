export function fdString(fd: FormData, key: string): string {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function fdBool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}

export function fdNumber(fd: FormData, key: string): number | undefined {
  const value = fd.get(key);
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}
