export async function generateAccessCode(userId: string) {
  // generate a 6 digit code
  const code = Math.floor(10000 + Math.random() * 900000).toString();

  // set code expiration date
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const accessRecord = await prisma.accesCode.create({
    data: {
      code,
      profileId: userId,
      expiresAt,
    },
  })

  return accessRecord.code 
}


export async function verifyGymAccess(inputCode: string){
    const record = await prisma.accessCode.findUnique({
        where: {code: }
    })
}
