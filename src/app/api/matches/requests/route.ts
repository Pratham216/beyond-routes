import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { PlanMatchRequest } from "@/lib/models/PlanMatchRequest";
import { User } from "@/lib/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const toUserId = (session.user as any).id as string | undefined;
  if (!toUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDb();

  const requests = await PlanMatchRequest.find({
    toUserId,
    status: { $in: ["pending", "accepted"] },
  })
    .sort({ createdAt: -1 })
    .lean();

  const fromIds = requests.map((r) => r.fromUserId.toString());
  const users = await User.find({ _id: { $in: fromIds } }).lean();
  const userById = new Map(users.map((u) => [u._id.toString(), u]));

  return NextResponse.json({
    items: requests.map((r) => {
      const from = userById.get(r.fromUserId.toString());
      return {
        id: r._id.toString(),
        status: r.status,
        itinerarySlug: r.itinerarySlug,
        dateISO: r.dateISO,
        from: from
          ? { id: from._id.toString(), name: from.name, email: from.email }
          : { id: r.fromUserId.toString(), name: "Unknown", email: "" },
      };
    }),
  });
}

