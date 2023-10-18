import { default as sendResponse } from "send-response";

export function httpResponse(status: number, headers: { [key: string]: string }, content: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(content);
  sendResponse(
    {
        ipc: JSON.stringify({ action: "response", status, headers }),
        metadata: undefined,
    },
    {
        mime: "application/octet-stream",
        bytes,
    },
  )
}
