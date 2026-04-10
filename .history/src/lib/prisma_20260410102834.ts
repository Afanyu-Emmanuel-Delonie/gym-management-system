import { PrismaClient } from "@prisma/clien"

const prismaClientSingleton = () => {
    return new PrismaClient()
}