'use client'

type Props = {
  formData: any
  errors: { [key: string]: string }
  catalogs: {
    frameMaterial: any[]
    faceShape: any[]
    frameShape: any[]
  }
  handleInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
}

export default function ProductFields({ formData, errors, catalogs, handleInput, setErrors }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 p-5 bg-white dark:bg-primary-900 rounded-xl border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <input name="name" placeholder="Nombre" value={formData.name} onChange={handleInput} className={inputClass(errors.name)} />
      <input name="category" placeholder="Categoría" value={formData.category} onChange={handleInput} className={inputClass(errors.category)} />
      <input name="brand" placeholder="Marca" value={formData.brand} onChange={handleInput} className={inputClass(errors.brand)} />
      <input name="model" placeholder="Modelo" value={formData.model} onChange={handleInput} className={inputClass(errors.model)} />

      <input type="text"
        name="unitCost"
        placeholder="Costo unitario"
        value={formData.unitCost}
        onChange={(e) => {
          const value = e.target.value
          if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
            handleInput(e)
            setErrors(prev => {
              const newErrors = { ...prev }
              delete newErrors.unitCost
              return newErrors
            })
          }
        }}
        className={inputClass(errors.unitCost)}
      />

      <input type="text"
        name="customerPrice"
        placeholder="Precio al cliente"
        value={formData.customerPrice}
        onChange={(e) => {
          const value = e.target.value
          if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
            handleInput(e)
            setErrors(prev => {
              const newErrors = { ...prev }
              delete newErrors.customerPrice
              return newErrors
            })
          }
        }}
        className={inputClass(errors.customerPrice)}
      />

      <input name="supplier" placeholder="Proveedor" value={formData.supplier} onChange={handleInput} className={inputClass(errors.supplier)} />

      <select name="frameMaterial" value={formData.frameMaterial} onChange={handleInput} className={inputClass(errors.frameMaterial)}>
        <option value="">Material del Armazón</option>
        {catalogs.frameMaterial.map(c => <option key={c._id} value={c._id}>{c.label}</option>)}
      </select>

      <select name="faceShape" value={formData.faceShape} onChange={handleInput} className={inputClass(errors.faceShape)}>
        <option value="">Forma de cara</option>
        {catalogs.faceShape.map(c => <option key={c._id} value={c._id}>{c.label}</option>)}
      </select>

      <select name="frameShape" value={formData.frameShape} onChange={handleInput} className={inputClass(errors.frameShape)}>
        <option value="">Forma de armazón</option>
        {catalogs.frameShape.map(c => <option key={c._id} value={c._id}>{c.label}</option>)}
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
        className={`w-full px-4 py-2 border rounded-lg transition col-span-2 ${
          errors.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'
        } placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`}
      />
    </div>
  )
}

function inputClass(hasError?: string) {
  return `w-full px-4 py-2 border rounded-lg transition ${
    hasError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-primary-700 focus:ring-primary-400'
  } placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-primary-800 text-gray-900 dark:text-white`
}
