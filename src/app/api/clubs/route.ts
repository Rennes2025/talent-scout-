import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clubs — liste tous les clubs (filtre optionnel ?region=EU|MIDDLE_EAST)
export async function GET(req: NextRequest) {
  const region = req.nextUrl.searchParams.get("region");
  const clubs = await prisma.club.findMany({
    where: region ? { region } : undefined,
    include: {
      rdvs:    { orderBy: { date: "asc" }, take: 3 },
      relances: { where: { done: false },   orderBy: { dueDate: "asc" }, take: 2 },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(clubs);
}

// POST /api/clubs — créer un nouveau club
export async function POST(req: NextRequest) {
  const body = await req.json();
  const club = await prisma.club.create({ data: body });
  return NextResponse.json(club, { status: 201 });
}
