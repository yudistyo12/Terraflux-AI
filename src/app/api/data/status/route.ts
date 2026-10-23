import { systemStatus } from "@/lib/demo-data";

export async function GET() {
  return Response.json(systemStatus);
}
