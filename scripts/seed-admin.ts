import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@mail.com';
  const password = 'admin@123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    await prisma.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        updated_at: new Date(),
      },
    });
    console.log('Superadmin user updated successfully.');
  } else {
    await prisma.users.create({
      data: {
        name: 'Superadmin',
        email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    console.log('Superadmin user created successfully.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
