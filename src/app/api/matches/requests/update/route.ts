import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { PlanMatchRequest } from "@/lib/models/PlanMatchRequest";

const bodySchema = z.object({
  requestId: z.string().min(1),
  action: z.enum(["accepted", "declined"]),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const toUserId = (session.user as any).id as string | undefined;
  if (!toUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectToDb();

  const nextStatus = parsed.data.action === "accepted" ? "accepted" : "declined";

  const updated = await PlanMatchRequest.findOneAndUpdate(
    { _id: parsed.data.requestId, toUserId, status: "pending" },
    { $set: { status: nextStatus } },
    { new: true }
  ).lean();

  if (!updated) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

