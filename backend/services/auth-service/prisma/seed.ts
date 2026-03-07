import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create roles
  const roles = [
    { name: 'admin', description: 'System administrator with full access' },
    { name: 'coach', description: 'Tennis coach who can manage students and sessions' },
    { name: 'student', description: 'Training student who can book sessions' },
    { name: 'parent', description: 'Parent who can view child progress' },
    { name: 'player', description: 'Casual player who can book courts' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    console.log(`Created/Updated role: ${role.name}`);
  }

  // Create a default organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Organization',
      slug: 'default',
      planType: 'pro',
      status: 'active',
    },
  });
  console.log(`Created/Updated organization: ${organization.name}`);

  // Create a default branch (using findFirst + create pattern since id is UUID)
  let branch = await prisma.branch.findFirst({
    where: {
      organizationId: organization.id,
      name: 'Main Branch',
    },
  });

  if (!branch) {
    branch = await prisma.branch.create({
      data: {
        organizationId: organization.id,
        name: 'Main Branch',
        address: '123 Tennis Street',
        phone: '+1234567890',
      },
    });
  }
  console.log(`Created/Updated branch: ${branch.name}`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
