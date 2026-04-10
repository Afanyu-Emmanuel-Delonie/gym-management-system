import { PrismaClient } from "@prisma/client/extension"

const prismaClientSingleton = () => {
    return new PrismaClient()
}

