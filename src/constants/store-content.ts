// ─── Store ────────────────────────────────────────────────────
export const MOCK_PRODUCTS = [
  { id: "1", name: "Whey Protein 1kg",  category: "Supplements", price: 45000, stock: 24, isActive: true,  description: "High quality whey protein with 25g protein per serving. Chocolate and vanilla flavors available.", image: null },
  { id: "2", name: "Gym Gloves",         category: "Accessories", price: 8500,  stock: 3,  isActive: true,  description: "Padded gym gloves for better grip and wrist support during heavy lifts.", image: null },
  { id: "3", name: "Training T-Shirt",   category: "Apparel",     price: 12000, stock: 18, isActive: true,  description: "Moisture-wicking training t-shirt. Available in S, M, L, XL.", image: null },
  { id: "4", name: "Resistance Bands",   category: "Equipment",   price: 6500,  stock: 0,  isActive: false, description: "Set of 5 resistance bands for home and gym workouts.", image: null },
  { id: "5", name: "Creatine 500g",      category: "Supplements", price: 32000, stock: 11, isActive: true,  description: "Pure creatine monohydrate for strength and muscle gains.", image: null },
  { id: "6", name: "Gym Shorts",         category: "Apparel",     price: 9500,  stock: 7,  isActive: true,  description: "Lightweight gym shorts with side pockets. Available in black and grey.", image: null },
]

export const MOCK_ORDERS = [
  { id: "1", client: "Alice Martin",     items: 2, total: 53500, status: "PENDING",    delivery: "PICKUP",   date: "Today, 9:12am" },
  { id: "2", client: "Bob Kariuki",      items: 1, total: 45000, status: "PAID",       delivery: "DELIVERY", date: "Today, 8:45am" },
  { id: "3", client: "Claire Uwase",     items: 3, total: 29500, status: "PROCESSING", delivery: "PICKUP",   date: "Yesterday" },
  { id: "4", client: "David Nkurunziza", items: 1, total: 12000, status: "SHIPPED",    delivery: "DELIVERY", date: "Yesterday" },
  { id: "5", client: "Eva Mutoni",       items: 2, total: 21000, status: "COMPLETED",  delivery: "PICKUP",   date: "2 days ago" },
  { id: "6", client: "Frank Mugisha",    items: 1, total: 8500,  status: "CANCELLED",  delivery: "PICKUP",   date: "3 days ago" },
]

export const MOCK_DISCOUNTS = [
  { id: "1", code: "GYM10",    type: "PERCENTAGE", value: 10, minOrder: 20000, maxUses: 100, usedCount: 34, isActive: true,  expiresAt: "2025-12-31" },
  { id: "2", code: "FLAT5K",   type: "FIXED",      value: 5000, minOrder: null, maxUses: 50, usedCount: 50, isActive: false, expiresAt: "2025-06-30" },
  { id: "3", code: "WELCOME",  type: "PERCENTAGE", value: 15, minOrder: null,  maxUses: null, usedCount: 12, isActive: true, expiresAt: null },
]

export const ORDER_STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  PENDING:    { bg: "var(--color-warning-subtle)", color: "var(--color-warning)" },
  PAID:       { bg: "var(--color-primary-subtle)", color: "var(--color-primary)" },
  PROCESSING: { bg: "#ede9fe",                     color: "#7c3aed" },
  SHIPPED:    { bg: "#eff6ff",                     color: "#2563eb" },
  DELIVERED:  { bg: "var(--color-success-subtle)", color: "var(--color-success)" },
  COMPLETED:  { bg: "var(--color-success-subtle)", color: "var(--color-success)" },
  CANCELLED:  { bg: "var(--color-danger-subtle)",  color: "var(--color-danger)" },
  REFUNDED:   { bg: "var(--color-surface-raised)", color: "var(--color-text-muted)" },
}

// ─── Content ──────────────────────────────────────────────────
export const MOCK_SERVICES = [
  { id: "1", name: "Personal Training",  description: "One-on-one sessions with certified coaches.", price: 50000, isActive: true,  order: 0 },
  { id: "2", name: "Group Classes",      description: "High energy group fitness sessions.",          price: 15000, isActive: true,  order: 1 },
  { id: "3", name: "Nutrition Coaching", description: "Personalised meal plans and guidance.",        price: 40000, isActive: true,  order: 2 },
  { id: "4", name: "Massage Therapy",    description: "Recovery and relaxation massage sessions.",    price: 30000, isActive: false, order: 3 },
]

export const MOCK_TESTIMONIALS = [
  { id: "1", name: "Alice Martin",  content: "Best gym in town! The coaches are amazing.",          rating: 5, isApproved: true,  date: "2025-05-10" },
  { id: "2", name: "Bob Kariuki",   content: "Great equipment and friendly staff.",                  rating: 4, isApproved: true,  date: "2025-05-08" },
  { id: "3", name: "Claire Uwase",  content: "The nutrition coaching changed my life completely.",   rating: 5, isApproved: false, date: "2025-05-15" },
  { id: "4", name: "David N.",      content: "Good place but parking can be difficult sometimes.",   rating: 3, isApproved: false, date: "2025-05-14" },
]

// ─── Inquiries ────────────────────────────────────────────────
export const MOCK_INQUIRIES = [
  { id: "1", name: "John Doe",      email: "john@email.com",   phone: "+250 700 111", subject: "Membership pricing",       message: "Hi, I would like to know more about your monthly membership plans and what is included.",                    status: "UNREAD",  date: "Today, 10:30am" },
  { id: "2", name: "Mary Uwase",    email: "mary@email.com",   phone: null,           subject: "Personal training inquiry", message: "I am interested in personal training sessions. Can you tell me about availability and pricing?",              status: "READ",    date: "Today, 9:15am" },
  { id: "3", name: "Peter Habimana",email: "peter@email.com",  phone: "+250 700 222", subject: "Group classes schedule",    message: "Could you please share the weekly schedule for group fitness classes?",                                      status: "REPLIED", date: "Yesterday" },
  { id: "4", name: "Grace Mutoni",  email: "grace@email.com",  phone: "+250 700 333", subject: "Nutrition coaching",        message: "I have been struggling with my diet. Do you offer nutrition coaching services and how much does it cost?",    status: "UNREAD",  date: "Yesterday" },
  { id: "5", name: "Eric Nzeyimana",email: "eric@email.com",   phone: null,           subject: "Gym equipment",             message: "Do you sell gym equipment that can be used at home? I am looking for resistance bands and dumbbells.",        status: "READ",    date: "2 days ago" },
]

export const INQUIRY_STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  UNREAD:  { bg: "var(--color-primary-subtle)", color: "var(--color-primary)" },
  READ:    { bg: "var(--color-surface-raised)", color: "var(--color-text-muted)" },
  REPLIED: { bg: "var(--color-success-subtle)", color: "var(--color-success)" },
}
