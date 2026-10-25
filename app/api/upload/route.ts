import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { checkCode } from "@/lib/entries";

const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/zip",
  "application/x-zip-compressed",
];

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!checkCode(clientPayload, "UPLOAD_CODE")) {
          throw new Error("Zugangscode ist falsch.");
        }
        if (!pathname.startsWith("uploads/")) throw new Error("Ungültiger Pfad.");
        if (pathname.startsWith("uploads/docs/")) {
          return {
            allowedContentTypes: DOC_TYPES,
            maximumSizeInBytes: 25 * 1024 * 1024,
            addRandomSuffix: true,
          };
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload fehlgeschlagen." },
      { status: 400 },
    );
  }
}
