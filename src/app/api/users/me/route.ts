import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDb } from "@/lib/db";
import { User, UserPreferencesZod } from "@/lib/models/User";
import { z } from "zod";

const updateSchema = z.object({
  region: UserPreferencesZod.shape.region.optional(),
  budgetBand: UserPreferencesZod.shape.budgetBand.optional(),
  mood: UserPreferencesZod.shape.mood.optional(),
  timeAvailable: UserPreferencesZod.shape.timeAvailable.optional(),
  discoverable: UserPreferencesZod.shape.discoverable.optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDb();
  const user = await User.findById(userId).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    preferences: user.preferences ?? {},
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await connectToDb();
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        preferences: {
          ...(parsed.data as any),
          discoverable:
            parsed.data.discoverable ?? (parsed.data as any).discoverable ?? false,
        },
      },
    },
    { new: true }
  );

  return NextResponse.json({ ok: true });
}

