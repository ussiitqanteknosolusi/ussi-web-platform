const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@ussiits.com';
  const password = 'password123';
  
  console.log(`Resetting password for ${email}...`);
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { 
        password: hashedPassword,
        role: 'SUPERADMIN', 
        name: 'Super Admin'
      },
      create: {
        email,
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });
    
    console.log(`Success! User ${user.email} password reset to: ${password}`);
  } catch (e) {
    console.error('Error resetting password:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
