export async function generateAccessCode(userId: string){

    // generate a 6 digit code 
    const code = Math.floor(10000 + Math.random() * 900000).toString()

    // set code expiration date 
    const expiresAt = new Date()
    expiresAt.set
}