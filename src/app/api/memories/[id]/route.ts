import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memoryId = params.id
    
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
      select: {
        id: true,
        title: true,
        message: true,
        photos: true,
        videos: true,
        music: true,
        specialDate: true,
        createdAt: true,
      }
    })

    if (!memory) {
      return NextResponse.json(
        { error: "Memória não encontrada" },
        { status: 404 }
      )
    }

    // Transformar os dados para o formato esperado
    const formattedMemory = {
      id: memory.id,
      title: memory.title,
      message: memory.message,
      photos: memory.photos || [],
      videos: memory.videos || [],
      music: memory.music || undefined,
      specialDate: memory.specialDate,
      createdAt: memory.createdAt.toISOString(),
    }

    return NextResponse.json(formattedMemory)
    
  } catch (error) {
    console.error("Erro ao buscar memória:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}