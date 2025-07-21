'use client'

import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { XCircle } from 'lucide-react'
import { es } from 'date-fns/locale/es'
import { registerLocale } from 'react-datepicker'
import FloatingMessage from '@/components/FloatingMessage/FloatingMessage'
import ExpenseForm from '@/components/CostManagementPage/ExpenseForm'
import ExpenseTable from '@/components/CostManagementPage/ExpenseTable'
import { Expense } from '@/types/expense'
import { ChangeEvent } from 'react'
import StockTable from '@/components/CostManagementPage/StockTable'
import { StockItem } from '@/types/stockItem'

import {
    getExpenses,
    postExpenses,
    deleteExpenses,
    putExpense,
    getStockItems,
} from '@/lib/expensesApis/expensesApis'

registerLocale('es', es)

export default function CostManagementPage() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [form, setForm] = useState({
        type: 'Gasto Fijo',
        description: '',
        unitCost: '',
        quantity: '',
        months: '',
        date: '',
        affectsStock: false,
    })

    const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date())
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
    const [stockItems, setStockItems] = useState<StockItem[]>([])

    const isFormValid =
        form.description.trim() !== '' &&
        form.unitCost.trim() !== '' &&
        form.quantity.trim() !== '' &&
        !isNaN(Number(form.unitCost)) &&
        !isNaN(Number(form.quantity)) &&
        Number(form.unitCost) > 0 &&
        Number(form.quantity) > 0 &&
        form.date !== '' &&
        (
            form.type !== 'Gasto Diferidos' ||
            (Number(form.months || 0) > 0)
        )

    useEffect(() => {
        fetchExpenses()
    }, [selectedMonth])
    useEffect(() => {
        fetchStockItems()
    }, [])
    useEffect(() => {
        const fetchStock = async () => {
            try {
                const data = await getStockItems()
                setStockItems(data)
            } catch (error: any) {
                setErrorMsg(error.message || 'Error al cargar el inventario')
            }
        }

        fetchStock()
    }, [])

    const fetchExpenses = async () => {
        try {
            if (selectedMonth) {
                const month = selectedMonth.getMonth() + 1
                const year = selectedMonth.getFullYear()
                const data = await getExpenses(month, year)
                console.log('Gastos cargados:', data)

                setExpenses(data)
            } else {
                const data = await getExpenses()
                setExpenses(data)
            }
        } catch (error: any) {
            setErrorMsg(error.message || 'Error al cargar los gastos.')
        }
    }
    const fetchStockItems = async () => {
        try {
            const data = await getStockItems()
            setStockItems(data)
        } catch (error: any) {
            setErrorMsg(error.message || 'Error al cargar el inventario')
        }
    }

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        setForm((prev) => {
            const updatedForm = {
                ...prev,
                [name]: value,
            }

            if (name === 'type' && value !== 'Gasto Diferidos') {
                updatedForm.months = ''
            }

            return updatedForm
        })
    }

    const addExpense = async () => {
        try {
            const newExpense = {
                type: form.type as Expense['type'],
                description: form.description,
                unitCost: parseFloat(form.unitCost),
                quantity: parseFloat(form.quantity),
                amount: parseFloat(form.unitCost) * parseFloat(form.quantity),
                date: form.date || new Date().toISOString(),
                ...(form.type === 'Gasto Diferidos' && {
                    months: parseFloat(form.months),
                }),
                affectsStock: form.affectsStock || false,
            }

            const saved = await postExpenses(newExpense)
            const inserted = Array.isArray(saved) ? saved : [saved]

            // Verificar si el gasto corresponde al mes seleccionado
            const matchMonth = (expense: Expense) => {
                if (!selectedMonth) return true
                const d = new Date(expense.date)
                return (
                    d.getMonth() === selectedMonth.getMonth() &&
                    d.getFullYear() === selectedMonth.getFullYear()
                )
            }

            const visibleExpenses = inserted.filter(matchMonth)
            setExpenses((prev) => [...visibleExpenses, ...prev])

            // 🚀 ACTUALIZAR STOCK INMEDIATAMENTE
            const updatedStock = await getStockItems()
            setStockItems(updatedStock)

            setForm({
                type: 'Gasto Variable',
                description: '',
                unitCost: '',
                quantity: '',
                months: '',
                date: '',
                affectsStock: false,
            })

            setSuccessMsg('Gasto agregado correctamente ✅')
        } catch (error: any) {
            setErrorMsg(error.message || 'Error al guardar el gasto')
        }
    }


    const handleDelete = async (id: string) => {
        try {
            await deleteExpenses(id)
            await fetchExpenses()
            await fetchStockItems() // ✅ refrescar inventario también
            setSuccessMsg('Gasto eliminado correctamente ✅')
        } catch (error: any) {
            setErrorMsg(error.message || 'Error al eliminar el gasto')
        } finally {
            setConfirmDeleteId(null)
        }
    }


    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense)
        setForm({
            type: expense.type,
            description: expense.description,
            unitCost: String(expense.unitCost),
            quantity: String(expense.quantity),
            months: String(expense.months || ''),
            date: expense.date,
            affectsStock: !!expense.affectsStock,// ✅ toma el valor real
        })
    }

    const updateExpense = async () => {
        if (!editingExpense) return
        try {
            const updated = await putExpense(editingExpense._id!, {
                type: form.type,
                description: form.description,
                unitCost: parseFloat(form.unitCost),
                quantity: parseFloat(form.quantity),
                amount: parseFloat(form.unitCost) * parseFloat(form.quantity),
                date: form.date,
                affectsStock: form.affectsStock,
            })

            setExpenses((prev) =>
                prev.map((e) => (e._id === updated._id ? updated : e))
            )

            await fetchStockItems() // 🔁 Recarga la tabla de stock

            setEditingExpense(null)
            setForm({
                type: 'Gasto Variable',
                description: '',
                unitCost: '',
                quantity: '',
                months: '',
                date: '',
                affectsStock: false,
            })

            setSuccessMsg('Gasto actualizado correctamente ✅')
        } catch (error: any) {
            setErrorMsg(error.message || 'Error al actualizar el gasto')
        }
    }


    const filteredExpenses = selectedMonth
        ? expenses.filter((e) => {
            const d = new Date(e.date)
            return (
                d.getMonth() === selectedMonth.getMonth() &&
                d.getFullYear() === selectedMonth.getFullYear()
            )
        })
        : expenses

    const exportToExcel = () => {
        if (expenses.length === 0) {
            setErrorMsg('No hay datos para exportar.')
            return
        }

        const worksheet = XLSX.utils.json_to_sheet(
            expenses.map((e) => ({
                Tipo: e.type,
                Descripción: e.description,
                'Costo unitario': e.unitCost,
                Cantidad: e.quantity,
                Total: e.amount,
                'Fecha del gasto': new Date(e.date).toLocaleDateString(),
                'Registrado el': e.createdAt
                    ? new Date(e.createdAt).toLocaleDateString()
                    : '—',
            }))
        )

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos')
        XLSX.writeFile(workbook, 'Gastos_EnUnaOptica.xlsx')
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
            {successMsg && (
                <FloatingMessage message={successMsg} type="success" onClose={() => setSuccessMsg('')} />
            )}
            {errorMsg && (
                <FloatingMessage message={errorMsg} type="error" onClose={() => setErrorMsg('')} />
            )}

            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-700 dark:text-primary-300">
                    Gestión de Costos
                </h1>

                <div className="flex flex-wrap gap-3 items-center">
                    {selectedMonth && (
                        <button
                            onClick={() => setSelectedMonth(null)}
                            className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium bg-primary-100 hover:bg-primary-200 text-primary-700 hover:text-primary-800 dark:bg-primary-900 dark:hover:bg-primary-800 dark:text-primary-200 dark:hover:text-primary-100 transition"
                            title="Quitar filtro de mes"
                        >
                            <XCircle className="w-4 h-4" />
                            Quitar filtro
                        </button>
                    )}

                    <DatePicker
                        selected={selectedMonth}
                        onChange={(date) => setSelectedMonth(date)}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        locale="es"
                        placeholderText="Selecciona un mes"
                        className="p-2 text-sm border rounded-md shadow-sm bg-white dark:bg-neutral-800 dark:text-neutral-100 border-neutral-300 focus:ring-primary-500 focus:border-primary-500 transition duration-300 sm:w-48"
                    />

                    <button
                        onClick={exportToExcel}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md transition"
                        title="Exportar a Excel"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Exportar Excel
                    </button>
                </div>
            </header>

            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden transition mb-10">
                <ExpenseForm
                    form={form}
                    onChange={handleFormChange}
                    onSubmit={editingExpense ? updateExpense : addExpense}
                    isFormValid={isFormValid}
                />
                <ExpenseTable
                    expenses={filteredExpenses}
                    onEdit={handleEdit}
                    onDelete={(id) => handleDelete(id)}
                />
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden transition">
                <h2 className="text-2xl font-bold px-6 pt-6 pb-2 text-primary-700 dark:text-primary-300">
                    Inventario / Stock
                </h2>
                <div className="p-4">
                    <StockTable stockItems={stockItems} />
                </div>
            </div>
        </div>
    )
}
