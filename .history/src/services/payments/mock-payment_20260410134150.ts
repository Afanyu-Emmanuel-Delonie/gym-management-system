
export async function processMockPayment(amount: number) {
  console.log(`Processing mock payment of ${amount} RWF...`)
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate a 95% success rate
  const success = Math.random() > 0.05
  return {
    success,
    transactionId: `MOCK-${Math.random().toString(36).toUpperCase().substring(2, 10)}`,
  }
}