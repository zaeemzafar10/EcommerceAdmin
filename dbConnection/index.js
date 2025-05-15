const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function startServer() {
    try {
      await prisma.$connect();
      console.log('✅ Connected to the database successfully.');
      
    
    } catch (err) {
      console.error('❌ Failed to connect to the database:', err);
      process.exit(1); // exit if db is not connected
    }
  }


  module.exports = startServer