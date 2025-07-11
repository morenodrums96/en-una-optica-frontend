export type Expense = {
  _id?: string
  id?: number
  type: 'Gasto Indirecto' | 'Costo Directo'
  description: string
  unitCost: number
  quantity: number
  amount: number
  date: string
  createdAt?: string
}
