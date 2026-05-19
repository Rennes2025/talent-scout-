import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events — tous les événements à venir
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
    });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json([]);
  }
}

// POST /api/events — créer un événement
export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = await prisma.event.create({ data: body });
  return NextResponse.json(event, { status: 201 });
}
