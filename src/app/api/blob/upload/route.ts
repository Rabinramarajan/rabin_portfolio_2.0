import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import {
  ALLOWED_MEDIA_TYPES,
  MAX_UPLOAD_BYTES,
  isAllowedMediaType,
  isBlobFolder,
  uploadMedia,
} from "@/lib/blob-server";

/**
 * Server-side media upload.
 *
 * POST multipart/form-data, with `Authorization: Bearer <BLOB_UPLOAD_SECRET>`:
 *   file     — the asset (required)
 *   folder   — one of the Blob folders (required)
 *   name     — desired name, sanitised server-side (optional, defaults to the
 *              uploaded file's own name)
 *   overwrite— "true" replaces an existing object at that pathname
 *
 * This is a write endpoint backed by a paid store, so it is authenticated and
 * fails closed: with `BLOB_UPLOAD_SECRET` unset the route is off entirely
 * rather than open. There is no user/session system in this project — the
 * secret is the admin credential, and when an admin UI is added it should
 * authenticate its operator and call `uploadMedia()` from a server action
 * instead of proxying the secret to the browser.
 *
 * The write token itself never leaves the server: the caller posts the file
 * and receives only the resulting public URL.
 */
export const runtime = "nodejs";

/** Constant-time compare that does not leak the secret's length. */
function isAuthorized(request: Request): boolean {
  const secret = process.env.BLOB_UPLOAD_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const presented = header.startsWith("Bearer ") ? header.slice(7) : "";

  // Hash-free length equalisation: compare fixed-width buffers so
  // timingSafeEqual never throws on a mismatched length.
  const expectedBuffer = Buffer.from(secret, "utf8");
  const presentedBuffer = Buffer.alloc(expectedBuffer.length);
  presentedBuffer.write(presented, "utf8");

  return (
    timingSafeEqual(expectedBuffer, presentedBuffer) &&
    Buffer.byteLength(presented, "utf8") === expectedBuffer.length
  );
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob storage is not configured." }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing 'file'." }, { status: 400 });
  }

  const folder = String(form.get("folder") ?? "");
  if (!isBlobFolder(folder)) {
    return NextResponse.json({ error: "Unknown 'folder'." }, { status: 400 });
  }

  if (!isAllowedMediaType(file.type)) {
    return NextResponse.json(
      { error: `Unsupported type. Allowed: ${Object.keys(ALLOWED_MEDIA_TYPES).join(", ")}.` },
      { status: 415 },
    );
  }

  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `File must be between 1 byte and ${MAX_UPLOAD_BYTES} bytes.` },
      { status: 413 },
    );
  }

  const blob = await uploadMedia({
    folder,
    name: String(form.get("name") ?? file.name),
    contentType: file.type,
    // `overwrite` defaults to false in uploadMedia: replacing a live asset
    // must be asked for explicitly.
    overwrite: form.get("overwrite") === "true",
    body: await file.arrayBuffer(),
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname }, { status: 201 });
}
