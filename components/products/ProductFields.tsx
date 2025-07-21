'use client'
import { getCustomerPrice } from '@/lib/productsApis/productApis'
import { useState, useEffect } from 'react'

type Props = {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  errors: { [key: string]: string }
  catalogs: {
    frameMaterial: any[]
    faceShape: any[]
    frameShape: any[]
  }
  handleInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
}

export default function ProductFields({
  formData,
  setFormData,
  errors,
  catalogs,
  handleInput,
  setErrors,
}: Props) {
  useEffect(() => {
    if (!formData.hasDiscount) {
      setFormData((prev: any) => ({
        ...prev,
      }))
    }
  }, [formData.hasDiscount, setFormData])


  return (
    <div className="grid grid-cols-2 gap-4 p-5 bg-white dark:bg-primary-900 rounded-xl border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <input name="name" placeholder="Nombre" value={formData.name} onChange={handleInput} className={inputClass(errors.name)} />
      <input name="category" placeholder="Categoría" value={formData.category} onChange={handleInput} className={inputClass(errors.category)} />
      <input name="brand" placeholder="Marca" value={formData.brand} onChange={handleInput} className={inputClass(errors.brand)} />
      <input name="model" placeholder="Modelo" value={formData.model} onChange={handleInput} className={inputClass(errors.model)} />

      <input
        type="text"
        name="unitCost"
        placeholder="Costo unitario"
        value={formData.unitCost}
        onChange={async (e) => {
          const value = e.target.value
          if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
            handleInput(e)
            setErrors((prev) => {
              const newErrors = { ...prev }
              delete newErrors.unitCost
              return newErrors
            })

            const numericValue = parseFloat(value)
            if (!isNaN(numericValue)) {
              try {
                const customerPrices = await getCustomerPrice(numericValue)

                setFormData((prev: any) => ({
                  ...prev,
                  customerPrice: customerPrices.customerPrice.toFixed(2),
                  priceWithoutVAT: customerPrices.priceWithoutVAT.toFixed(2),
                }))
              } catch (err) {
                console.error('Error al obtener el precio al cliente:', err)
              }
            }
          }
        }}
        className={inputClass(errors.unitCost)}
      />

      <input
        type="text"
        name="customerPrice"
        placeholder="Precio al cliente"
        value={formData.customerPrice}
        readOnly
        className={inputClass(errors.customerPrice) + ' bg-gray-100 dark:bg-primary-700 cursor-not-allowed'}
      />

      <input
        type="text"
        name="priceWithoutVAT"
        placeholder="Precio sin IVA"
        value={formData.priceWithoutVAT}
        readOnly
        className={inputClass(errors.priceWithoutVAT) + ' bg-gray-100 dark:bg-primary-700 cursor-not-allowed'}
      />

      <div className="col-span-2 flex items-center gap-3">
        <input
          id="add-discount"
          type="checkbox"
          checked={formData.hasDiscount || false}
          disabled={!formData.unitCost || isNaN(parseFloat(formData.unitCost))}
          onChange={(e) => {
            const checked = e.target.checked
            setFormData((prev: any) => ({
              ...prev,
              hasDiscount: checked,
              // solo borramos los valores si desactiva
              ...(checked
                ? {}
                : {
                  discount: '',
                  discountedPriceWithVAT: '',
                  discountedPriceWithoutVAT: '',
                }),
            }))
          }}
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label htmlFor="add-discount" className="text-sm font-medium">
          Agregar descuento
        </label>
      </div>

      {formData.hasDiscount && (
        <>
          <input
            type="number"
            name="discount"
            placeholder="Descuento (%)"
            min={1}
            max={100}
            value={formData.discount}
            onChange={(e) => {
              const value = e.target.value
              if ((/^\d{0,3}$/.test(value) && Number(value) <= 100) || value === '') {
                setFormData((prev: any) => {
                  const discount = parseFloat(value)
                  const priceWithVAT = parseFloat(prev.customerPrice)
                  const priceWithoutVAT = parseFloat(prev.priceWithoutVAT)

                  return {
                    ...prev,
                    discount: value,
                    discountedPriceWithVAT:
                      !isNaN(discount) && !isNaN(priceWithVAT)
                        ? (priceWithVAT * (1 - discount / 100)).toFixed(2)
                        : '',
                    discountedPriceWithoutVAT:
                      !isNaN(discount) && !isNaN(priceWithoutVAT)
                        ? (priceWithoutVAT * (1 - discount / 100)).toFixed(2)
                        : '',
                  }
                })
              }
            }}
            className={inputClass(errors.discount)}
          />

          <input
            type="text"
            name="discountedPriceWithVAT"
            placeholder="Precio con descuento (IVA)"
            value={formData.discountedPriceWithVAT}
            readOnly
            className={
              inputClass(errors.discountedPriceWithVAT) +
              ' bg-gray-100 dark:bg-primary-700 cursor-not-allowed'
            }
          />

          <input
            type="text"
            name="discountedPriceWithoutVAT"
            placeholder="Precio con descuento (sin IVA)"
            value={formData.discountedPriceWithoutVAT ?? ''}
            readOnly
            className={
              inputClass(errors.discountedPriceWithoutVAT) +
              ' bg-gray-100 dark:bg-primary-700 cursor-not-allowed'
            }
          />

        </>
      )}


      <input name="supplier" placeholder="Proveedor" value={formData.supplier} onChange={handleInput} className={inputClass(errors.supplier)} />

      <select name="frameMaterial" value={formData.frameMaterial} onChange={handleInput} className={inputClass(errors.frameMaterial)}>
        <option value="">Material del Armazón</option>
        {catalogs.frameMaterial.map((c) => (
          <option key={c._id} value={c._id}>{c.label}</option>
        ))}
      </select>

      <select name="faceShape" value={formData.faceShape} onChange={handleInput} className={inputClass(errors.faceShape)}>
        <option value="">Forma de cara</option>
        {catalogs.faceShape.map((c) => (
          <option key={c._id} value={c._id}>{c.label}</option>
        ))}
      </select>

      <select name="frameShape" value={formData.frameShape} onChange={handleInput} className={inputClass(errors.frameShape)}>
        <option value="">Forma de armazón</option>
        {catalogs.frameShape.map((c) => (
          <option key={c._id} value={c._id}>{c.label}</option>
        ))}
      </select>

      <select name="size" value={formData.size} onChange={handleInput} className={inputClass()}>
        <option value="">Selecciona tamaño</option>
        <option value="Angosto">Angosto</option>
        <option value="Promedio">Promedio</option>
        <option value="Ancho">Ancho</option>
        <option value="Extra ancho">Extra ancho</option>
      </select>

      <textarea
        name="description"
        placeholder="Descripción"
        value={formData.description}
        onChange={handleInput}
        className={`w-full px-4 py-2 border rounded-lg transition col-span-2 ${errors.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'} placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`}
      />
    </div>
  )
}

function inputClass(hasError?: string) {
  return `w-full px-4 py-2 border rounded-lg transition ${hasError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'} placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`
}
