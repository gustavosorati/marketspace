import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  await prisma.paymentMethods.upsert({
    where: {
      key: 'boleto'
    },
    update: {},
    create: {
      key: 'boleto',
      name: 'Boleto'
    }
  })
  await prisma.paymentMethods.upsert({
    where: {
      key: 'pix'
    },
    update: {},
    create: {
      key: 'pix',
      name: 'Pix'
    }
  })
  await prisma.paymentMethods.upsert({
    where: {
      key: 'cash'
    },
    update: {},
    create: {
      key: 'cash',
      name: 'Dinheiro'
    }
  })
  await prisma.paymentMethods.upsert({
    where: {
      key: 'deposit'
    },
    update: {},
    create: {
      key: 'deposit',
      name: 'Depósito Bancário'
    }
  })
  await prisma.paymentMethods.upsert({
    where: {
      key: 'card'
    },
    update: {},
    create: {
      key: 'card',
      name: 'Cartão de Crédito'
    }
  })

  await prisma.users.create({
    data: {
      name: "Alex Quasar",
      email: "quasar.alex@gmail.com",
      password: "Senha@123",
      tel: "1699991111",
      avatar: "alex.jpg"
    }
  });
  await prisma.users.create({
    data: {
      name: "Martinez Fontes",
      email: "fontes.martinez@gmail.com",
      password: "Senha@123",
      tel: "1699992222",
      avatar: "martinez.jpg"
    }
  });
  await prisma.users.create({
    data: {
      name: "Java Kotlin",
      email: "kotlin.java@gmail.com",
      password: "Senha@123",
      tel: "1699993333",
      avatar: "java.jpg"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })