const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany().then(u => {
    console.log("Users:", u.map(x => x.username).join(', '));
}).catch(console.error).finally(() => prisma.$disconnect());
