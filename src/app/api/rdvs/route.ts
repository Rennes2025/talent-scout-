import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/rdvs — tous les RDV à venir
export async function GET() {
  try {
    const rdvs = await prisma.rdv.findMany({
      include: { club: { select: { name: true, logo: true, country: true } } },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(rdvs);
  } catch {
    return NextResponse.json([]);
  }
}

// POST /api/rdvs — créer un RDV
export async function POST(req: NextRequest) {
  const body = await req.json();
  const rdv = await prisma.rdv.create({
    data: body,
    include: { club: { select: { name: true, logo: true } } },
  });
  return NextResponse.json(rdv, { status: 201 });
}
