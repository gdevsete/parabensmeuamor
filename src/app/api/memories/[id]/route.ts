import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memoryId = params.id

    if (!memoryId) {
      return NextResponse.json({ error: "ID da memória é obrigatório" }, { status: 400 })
    }

    // Buscar a memória no banco de dados
    const memory = await prisma.memory.findUnique({
      where: {
        id: memoryId,
      },
      select: {
        id: true,
        title: true,
        partnerName: true,
        description: true,
        photos: true,
        videos: true,
        musicUrl: true,
        musicName: true,
        eventDate: true,
        eventTitle: true,
        startDate: true,
        createdAt: true,
        userId: true,
      }
    })

    if (!memory) {
      return NextResponse.json({ error: "Memória não encontrada" }, { status: 404 })
    }

    // Converter para o formato esperado pela interface
    const memoryData = {
      id: memory.id,
      title: memory.title,
      message: memory.description || '',
      photos: memory.photos ? JSON.parse(memory.photos) : [],
      videos: memory.videos ? JSON.parse(memory.videos) : [],
      music: memory.musicUrl,
      specialDate: memory.eventDate?.toISOString() || memory.startDate.toISOString(),
      createdAt: memory.createdAt.toISOString(),
    }

    return NextResponse.json(memoryData)

  } catch (error) {
    console.error("Erro ao buscar memória:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}