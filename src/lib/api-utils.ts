import { NextResponse } from "next/server"

export function jsonResponse(data: unknown, status = 200, cacheControl?: string) {
  const headers: Record<string, string> = {}
  if (cacheControl) {
    headers["Cache-Control"] = cacheControl
  }
  return NextResponse.json(data, { status, headers })
}

export function publicCache(maxAge = 900) {
  return `public, s-maxage=${maxAge}, stale-while-revalidate=86400`
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}
