import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import { registerLocale } from 'react-datepicker';
import { getCatalogByGroup, CatalogEntry } from '@/lib/catalogApis/catalogApi';
import { useState, useEffect, ChangeEvent } from 'react';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

registerLocale('es', es);

type Props = {
  form: {
    type: string;
    description: string;
    unitCost: string;
    quantity: string;
    months: string;
    date?: string;
    affectsStock?: boolean;
  };
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  isFormValid: boolean;
};

export default function ExpenseForm({ form, onChange, onSubmit, isFormValid }: Props) {
  const [expenseOptions, setExpenseOptions] = useState<CatalogEntry[]>([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await getCatalogByGroup('expenses');
        setExpenseOptions(data);
      } catch (error) {
        console.error('Error cargando catálogo de expenses:', error);
      }
    };
    fetchCatalog();
  }, []);

  const total =
    !isNaN(Number(form.unitCost)) && !isNaN(Number(form.quantity))
      ? Number(form.unitCost) * Number(form.quantity)
      : 0;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Descripción */}
        <select
          name="description"
          value={form.description}
          onChange={onChange}
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-primary-500 focus:border-primary-500 w-[120px] md:w-[150px] lg:w-[200px]"
        >
          <option value="">Descripción</option>
          {expenseOptions.map((option) => (
            <option key={option._id} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Tipo */}
        <select
          name="type"
          value={form.type}
          onChange={onChange}
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-primary-500 focus:border-primary-500 w-[100px]"
        >
          <option value="Gasto Fijo">Fijo</option>
          <option value="Gasto Variable">Variable</option>
          <option value="Gasto Diferido">Diferido</option>
        </select>

        {/* Costo unitario */}
        <input
          name="unitCost"
          type="number"
          value={form.unitCost}
          onChange={onChange}
          placeholder="Costo"
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-primary-500 focus:border-primary-500 w-[80px]"
        />

        {/* Cantidad */}
        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={onChange}
          placeholder="Cant."
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-primary-500 focus:border-primary-500 w-[60px]"
        />

        {/* Meses diferidos */}
        <input
          name="months"
          type="number"
          value={form.months}
          onChange={onChange}
          placeholder="Meses"
          className={`p-2 rounded-lg border bg-white text-gray-900 focus:ring-primary-500 focus:border-primary-500 w-[80px] transition-all duration-300 ${form.type === 'Gasto Diferido' ? 'visible' : 'invisible w-0 p-0 m-0'}`}
        />

        {/* Fecha */}
        <DatePicker
          selected={form.date && !isNaN(Date.parse(form.date)) ? new Date(form.date) : null}
          onChange={(date: Date | null) =>
            onChange({
              target: {
                name: 'date',
                value: date?.toISOString() || '',
              },
            } as any)
          }
          dateFormat="dd MMM yyyy"
          locale="es"
          placeholderText="Fecha"
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-900 w-[120px] focus:ring-primary-500 focus:border-primary-500"
        />

        {/* Total */}
        <div className="flex-grow min-w-[100px] text-right sm:text-left">
          <span className="text-sm font-semibold text-gray-700">Total: </span>
          <span className="text-base font-bold text-primary-600">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Switch de stock */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <label htmlFor="affectsStock" className="cursor-pointer">
            Stock
          </label>
          <div className="relative inline-block w-10 h-5">
            <input
              type="checkbox"
              id="affectsStock"
              name="affectsStock"
              checked={!!form.affectsStock}
              onChange={(e) =>
                onChange({
                  target: {
                    name: 'affectsStock',
                    value: e.target.checked,
                  },
                } as any)
              }
              className="peer opacity-0 w-0 h-0"
            />
            <label
              htmlFor="affectsStock"
              className="absolute inset-0 cursor-pointer rounded-full bg-gray-300 peer-checked:bg-primary-500 transition-colors duration-300
                before:content-[''] before:absolute before:left-1 before:top-1 before:bg-white before:w-3 before:h-3 before:rounded-full
                before:transition-transform before:duration-300 peer-checked:before:translate-x-5"
            />
          </div>
        </div>

        {/* Botón de Submit */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`h-9 px-4 text-sm rounded-lg font-semibold text-white transition flex items-center gap-1
            ${isFormValid
              ? 'bg-primary-600 hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {form.date ? <PlusCircleIcon className="w-4 h-4" /> : <MinusCircleIcon className="w-4 h-4" />}
          <span>{form.date ? 'Actualizar' : 'Agregar'}</span>
        </button>
      </form>
    </div>
  );
}