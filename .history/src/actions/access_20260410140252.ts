export async function validateGymEntry(inputCode: string){
    const now = new Date()

    // 1. Find the code and include the profile and active subscriptions
  const accessRecord = await prisma.accessCode.findUnique({
    where: { code: inputCode },
    include: {
      profile: {
        include: {
          subscriptions: {
            where: {
              status: 'ACTIVE',
              endDate: { gte: now } 
            }
          }
        }
      }
    }
  });

  
}