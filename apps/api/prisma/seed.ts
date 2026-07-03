import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Toy', slug: 'wedding', icon: 'Heart', description: 'Toy dəvət kartı', order: 1 },
    { name: 'Nişan', slug: 'engagement', icon: 'Gem', description: 'Nişan dəvət kartı', order: 2 },
    { name: 'Xına gecəsi', slug: 'henna', icon: 'Flower2', description: 'Xına gecəsi dəvəti', order: 3 },
    { name: 'Ad günü', slug: 'birthday', icon: 'Cake', description: 'Ad günü dəvət kartı', order: 4 },
    { name: 'Beşik toyu', slug: 'baby-shower', icon: 'Baby', description: 'Beşik / körpə dəvəti', order: 5 },
    { name: 'Korporativ', slug: 'corporate', icon: 'Briefcase', description: 'Şirkət tədbiri dəvəti', order: 6 },
    { name: 'Master klass', slug: 'masterclass', icon: 'GraduationCap', description: 'Master klass dəvəti', order: 7 },
    { name: 'Seminar', slug: 'seminar', icon: 'BookOpen', description: 'Seminar dəvət kartı', order: 8 },
    { name: 'Konsert', slug: 'concert', icon: 'Music', description: 'Konsert dəvəti', order: 9 },
    { name: 'Ümumi tədbir', slug: 'general', icon: 'PartyPopper', description: 'Ümumi tədbir dəvəti', order: 10 },
  ];

  for (const cat of categories) {
    await prisma.invitationCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
