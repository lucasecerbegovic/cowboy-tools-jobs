export type Query = Record<string, string | string[] | undefined>;

export function toParams(sp: Query): URLSearchParams {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) v.forEach((x) => p.append(k, x));
    else p.set(k, v);
  }
  return p;
}

export function href(base: string, p: URLSearchParams): string {
  const s = p.toString();
  return s ? `${base}?${s}` : base;
}

/** Toggling any facet resets pagination — page 3 of the old result set is meaningless. */
export function toggleParam(sp: Query, key: string, value: string): URLSearchParams {
  const p = toParams(sp);
  const current = p.getAll(key);
  p.delete(key);
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  next.forEach((v) => p.append(key, v));
  p.delete('page');
  return p;
}

export function removeParam(sp: Query, key: string, value?: string): URLSearchParams {
  const p = toParams(sp);
  if (value === undefined) {
    p.delete(key);
  } else {
    const next = p.getAll(key).filter((v) => v !== value);
    p.delete(key);
    next.forEach((v) => p.append(key, v));
  }
  p.delete('page');
  return p;
}

export function asArray(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}
