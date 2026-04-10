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
  });

  return accessRecord.code;
}

export async function verifyGymAccess(inputCode: string) {
  const record = await prisma.accessCode.findUnique({
    where: { code: inputCode },
    include: {
      profile: {
        include: {
          subscriptions: true, // Check their gym plan
        },
      },
    },
  });

  if (!record) return {valid: false, message: "Code not found"}
  if(record.isUsed) return {valid: false, message: "Code already used"}
  if( new Date() > record.expiredAt) return {valid: false, message: "Code already expired"}


// Check if they have at least one active subscription
  const hasActiveSub = record.profile.subscriptions.some(sub => sub.isActive)
  
  if (!hasActiveSub) return { valid: false, message: "No active gym subscription" }

  // If all is good, mark code as used and allow entry
  await prisma.accessCode.update({
    where: { id: record.id },
    data: { isUsed: true }
  })

  return { 
    valid: true, 
    user: record.profile.fullName,
    role: record.profile.role 
  }
}
