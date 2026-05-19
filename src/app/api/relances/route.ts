import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/relances — relances en attente (done=false)
export async function GET() {
  try {
    const relances = await prisma.relance.findMany({
      where:   { done: false },
      include: { club: { select: { name: true, logo: true, country: true } } },
      orderBy: { dueDate: "asc" },
    });
    return NextResponse.json(relances);
  } catch {
    return NextResponse.json([]);
  }
}

// POST /api/relances — créer une relance
export async function POST(req: NextRequest) {
  const body = await req.json();
  const relance = await prisma.relance.create({ data: body });
  return NextResponse.json(relance, { status: 201 });
}

// PATCH /api/relances — marquer une relance comme faite
export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  const relance = await prisma.relance.update({
    where: { id },
    data:  { done: true, doneAt: new Date() },
  });
  return NextResponse.json(relance);
}
