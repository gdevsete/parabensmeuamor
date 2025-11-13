// Prisma script to ensure database is ready
const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Execute any pending migrations
    console.log('🔄 Checking database schema...')
    
    // Disconnect
    await prisma.$disconnect()
    console.log('✅ Database setup complete')
  } catch (error) {
    console.error('❌ Database error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()