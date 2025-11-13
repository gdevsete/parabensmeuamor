import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { nanoid } from "nanoid"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const {
      title,
      partnerName,
      startDate,
      description,
      photos,
      videos,
      musicUrl,
      musicName,
      backgroundColor,
      textColor,
      eventDate,
      eventTitle,
      isPublic
    } = await req.json()

    if (!title || !partnerName || !startDate) {
      return NextResponse.json(
        { error: "Título, nome do parceiro e data de início são obrigatórios" },
        { status: 400 }
      )
    }

    // Gerar URL única para compartilhamento
    const shareUrl = nanoid(10)

    const memory = await prisma.memory.create({
      data: {
        userId: session.user.id,
        title,
        partnerName,
        startDate: new Date(startDate),
        description,
        photos: photos ? JSON.stringify(photos) : null,
        videos: videos ? JSON.stringify(videos) : null,
        musicUrl,
        musicName,
        backgroundColor,
        textColor,
        eventDate: eventDate ? new Date(eventDate) : null,
        eventTitle,
        isPublic: isPublic || false,
        shareUrl,
      }
    })

    return NextResponse.json({ 
      memory,
      shareUrl: `${process.env.NEXTAUTH_URL}/memoria/${shareUrl}`
    })

  } catch (error) {
    console.error("Erro ao salvar memória:", error)
    return NextResponse.json(
      { error: "Erro ao salvar memória" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const memories = await prisma.memory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    // Parse JSON fields
    const memoriesWithParsedData = memories.map((memory: any) => ({
      ...memory,
      photos: memory.photos ? JSON.parse(memory.photos) : [],
      videos: memory.videos ? JSON.parse(memory.videos) : [],
    }))

    return NextResponse.json({ memories: memoriesWithParsedData })

  } catch (error) {
    console.error("Erro ao buscar memórias:", error)
    return NextResponse.json(
      { error: "Erro ao buscar memórias" },
      { status: 500 }
    )
  }
}