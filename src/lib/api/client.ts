/**
 * Generic fetch client used by every data source (WordPress REST, WPGraphQL,
 * mock JSON, etc). Keep this file framework-agnostic.
 *
 * Usage in a Server Component:
 *   const data = await apiFetch<Product[]>("/wp-json/wc/store/products");
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { revalidate?: number } = {}
): Promise<T> {
  const { revalidate, ...rest } = init;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  if (!res.ok) {
    throw new ApiError(res.status, `${res.status} ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}
