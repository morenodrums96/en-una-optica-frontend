export type Expense = {
  _id?: string
  id?: number
  type: 'Gasto Fijo' | 'Gasto Variable' | 'Gasto Diferidos' | 'Aplicación de gasto diferido' 
  description: string
  unitCost: number
  quantity: number
  months: number
  amount: number
  date: string
  groupId: string
  monthIndex:number
  createdAt?: string
  affectsStock:Boolean 
}
