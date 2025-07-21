import { StockItem } from '@/types/stockItem'

type Props = {
  stockItems: StockItem[]
}

export default function StockTable({ stockItems }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-primary-100 dark:bg-neutral-900 text-primary-800 dark:text-primary-100 uppercase tracking-wider text-xs border-b border-neutral-200 dark:border-neutral-700">
          <tr>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3 text-right">Costo unitario</th>
            <th className="px-6 py-3 text-right">Total</th>
            <th className="px-6 py-3 text-right">Usados</th>
            <th className="px-6 py-3 text-right">Disponibles</th>
            <th className="px-6 py-3">Fecha ingreso</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.length > 0 ? (
            stockItems.map((item, i) => (
              <tr
                key={item._id}
                className={`${i % 2 === 0 ? '' : 'bg-neutral-100 dark:bg-neutral-800'
                  } border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors`}
              >
                <td className="px-6 py-4 font-medium text-neutral-800 dark:text-neutral-200">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-right text-neutral-800 dark:text-neutral-200">
                  ${item.unitCost.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">{item.totalQuantity}</td>
                <td className="px-6 py-4 text-right">{item.usedQuantity}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-700 dark:text-green-400">
                  {item.availableQuantity}
                </td>
                <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                  {new Date(item.createdAt).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center p-6 text-neutral-400 dark:text-neutral-500 italic"
              >
                No hay productos en stock.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
