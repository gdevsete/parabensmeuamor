import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { put } from "@vercel/blob"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "photo", "video", "music"
    
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Validações de tipo e tamanho
    const maxSize = type === "music" ? 10 * 1024 * 1024 : 50 * 1024 * 1024 // 10MB para música, 50MB para foto/vídeo
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Arquivo muito grande. Limite: ${maxSize / (1024 * 1024)}MB` 
      }, { status: 400 })
    }

    // Tipos permitidos
    const allowedTypes = {
      photo: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      video: ["video/mp4", "video/webm", "video/quicktime"],
      music: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac"]
    }

    if (!allowedTypes[type as keyof typeof allowedTypes]?.includes(file.type)) {
      return NextResponse.json({ 
        error: `Tipo de arquivo não permitido para ${type}` 
      }, { status: 400 })
    }

    // Upload para Vercel Blob Storage
    const filename = `${Date.now()}-${file.name}`
    const blob = await put(filename, file, {
      access: "public",
    })

    return NextResponse.json({ 
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo" },
      { status: 500 }
    )
  }
}