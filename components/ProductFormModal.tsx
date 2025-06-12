'use client'

import { useState } from 'react'

export default function ProductFormModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    description: '',
    unitCost: 0,
    customerPrice: 0,
    quantity: 0,
    supplier: '',
    variants: [{ color: '', image: '', images: [''] }],
    lensColor: '',
    frameMaterial: '',
    faceShape: '',
    frameShape: '',
    configurableOptions: [],
    frond: false,
    canModifyQuantity: false,
    iva: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setFormData({
        ...formData,
        [name]: e.target.checked
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/products/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      alert('Producto registrado correctamente')
      onClose()
    } else {
      alert('Error al registrar el producto')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-primary-900 p-6 rounded-md w-[90%] max-w-2xl shadow-lg dark:shadow-primary-800/30">
        <h2 className="text-lg font-bold mb-4 text-primary-900 dark:text-primary-100">Registrar producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <input type="text" name="name" placeholder="Nombre" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="category" placeholder="Categoría" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="brand" placeholder="Marca" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="model" placeholder="Modelo" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="number" name="unitCost" placeholder="Costo unitario" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="number" name="customerPrice" placeholder="Precio al cliente" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="number" name="quantity" placeholder="Cantidad" className="w-full p-2 border rounded" onChange={handleChange} />
          <textarea name="description" placeholder="Descripción" className="w-full p-2 border rounded" onChange={handleChange} />

          {/* checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="frond" onChange={handleChange} /> Frontal
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="canModifyQuantity" onChange={handleChange} /> Modificable
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="iva" onChange={handleChange} /> IVA
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
