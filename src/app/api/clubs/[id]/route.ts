import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/clubs/[id] — mettre à jour le statut ou les infos
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const club = await prisma.club.update({ where: { id }, data: body });
  return NextResponse.json(club);
}

// DELETE /api/clubs/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.club.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
