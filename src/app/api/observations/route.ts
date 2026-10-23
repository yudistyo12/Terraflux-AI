import { observations } from "@/lib/demo-data";

export async function GET() {
  return Response.json({ observations });
}
