/**
 * Recursively converts Prisma Decimal → number and Date → ISO string
 * so objects are safe to pass from Server → Client Components.
 */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_key, value) => {
    // Prisma Decimal has a toFixed method and a constructor name of "Decimal"
    if (value !== null && typeof value === "object" && value.constructor?.name === "Decimal") {
      return Number(value)
    }
    return value
  }))
}
