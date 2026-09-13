import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  console.log('Testing Prisma ORM connection...');
  try {
    const clientsCount = await prisma.client.count();
    const invitationsCount = await prisma.invitation.count();
    const configsCount = await prisma.weddingConfig.count();
    const rsvpsCount = await prisma.rsvp.count();
    const wishesCount = await prisma.wish.count();

    console.log('✅ Connected to PostgreSQL via Full Prisma ORM!');
    console.log('📊 Prisma SaaS Models stats:', {
      clients: clientsCount,
      invitations: invitationsCount,
      configs: configsCount,
      rsvps: rsvpsCount,
      wishes: wishesCount,
    });
  } catch (err) {
    console.error('❌ Prisma connection error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
