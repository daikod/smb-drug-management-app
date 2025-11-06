import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

  const data = await req.json();
  const newUser = await prisma.user.create({ data });
  return NextResponse.json(newUser);
}


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const staff = await prisma.user.update({
    where: { id: params.id },
    data: { role: data.role },
  });
  return NextResponse.json(staff);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
