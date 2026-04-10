import { PrismaClient } from "@prisma/client/extension"

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prisma: undefined | ReturnType<typeof prisma
}