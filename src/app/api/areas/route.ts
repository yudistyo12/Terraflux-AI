import { demoAreas } from "@/lib/demo-data";

export async function GET() {
  return Response.json({ areas: demoAreas });
}
