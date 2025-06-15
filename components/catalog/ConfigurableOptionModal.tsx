"use client"

import { useState } from "react";

export type Color = {
  name: string;
  hex: string;
  enabled: boolean;
};


interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (group: string, description: string, allowMultiple: boolean, enabled: boolean, options: Option[]) => void;
}

type Option = {
  name: string
  description?: string
  price: number
  enabled: boolean
  activeQuantity: boolean
  availableColors?: { name: string; hex: string; enabled: boolean }[]
};

export default function ConfigurableOptionModal({ show, onClose, onSubmit }: Props) {
  const [group, setGroup] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [options, setOptions] = useState<Option[]>([]);

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        price: 0,
        activeQuantity: false,
        enabled: true,
        availableColors: [],
      },
    ]);
  };

  const handleOptionChange = (index: number, field: keyof Option, value: any) => {
    const updated = [...options];

    if (field === 'availableColors') return;
    (updated[index] as any)[field] = value;

    setOptions(updated);
  };


  const handleAddColor = (optIndex: number) => {
    const updated = [...options];

    if (!updated[optIndex].availableColors) {
      updated[optIndex].availableColors = []; // inicializar si no existe
    }

    updated[optIndex].availableColors!.push({
      name: '',
      hex: '#000000',
      enabled: true
    });

    setOptions(updated);
  };


  const handleColorChange = (
    optIndex: number,
    colorIndex: number,
    field: 'name' | 'hex' | 'enabled',
    value: string | boolean
  ) => {
    const updated = [...options];

    if (!updated[optIndex].availableColors) return;

    const color = updated[optIndex].availableColors![colorIndex];

    if (!color) return;

    if (field === 'name' && typeof value === 'string') {
      color.name = value;
    } else if (field === 'hex' && typeof value === 'string') {
      color.hex = value;
    } else if (field === 'enabled' && typeof value === 'boolean') {
      color.enabled = value;
    }

    setOptions(updated);
  };



  const handleSave = () => {
    onSubmit(group, groupDescription, allowMultiple, enabled, options);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-primary-900 p-6 rounded shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-semibold mb-4 text-primary-900 dark:text-primary-100">Nuevo Grupo Configurable</h2>

        <input
          type="text"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="Nombre del grupo"
          className="w-full mb-4 px-4 py-2 rounded border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-800"
        />

        <textarea
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          placeholder="Descripción del grupo"
          rows={2}
          className="w-full mb-4 px-4 py-2 rounded border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-800"
        />

        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={allowMultiple} onChange={() => setAllowMultiple(!allowMultiple)} />
            Permite múltiples
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
            Activo
          </label>
        </div>

        {options.map((opt, idx) => (
          <div key={idx} className="border p-4 mb-4 rounded bg-primary-50 dark:bg-primary-800">
            <h3 className="font-medium text-primary-900 dark:text-primary-100 mb-2">Opción #{idx + 1}</h3>
            <input
              value={opt.name}
              onChange={(e) => handleOptionChange(idx, "name", e.target.value)}
              placeholder="Nombre de la opción"
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              value={opt.description}
              onChange={(e) => handleOptionChange(idx, "description", e.target.value)}
              placeholder="Descripción"
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="number"
              value={opt.price}
              onChange={(e) => handleOptionChange(idx, "price", Number(e.target.value))}
              placeholder="Precio"
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={opt.activeQuantity}
                onChange={() => handleOptionChange(idx, "activeQuantity", !opt.activeQuantity)}
              />
              Activar colores
            </label>

            {opt.activeQuantity && (
              <div className="pl-4">
                {opt.availableColors?.map((color, colorIdx) => (
                  <div key={colorIdx} className="flex gap-2 mb-2">
                    <input
                      value={color.name}
                      onChange={(e) => handleColorChange(idx, colorIdx, "name", e.target.value)}
                      placeholder="Nombre del color"
                      className="flex-1 px-2 py-1 border rounded"
                    />
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => handleColorChange(idx, colorIdx, "hex", e.target.value)}
                      className="w-12 h-10 p-0 border"
                    />
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={color.enabled}
                        onChange={() => handleColorChange(idx, colorIdx, "enabled", !color.enabled)}
                      />
                      Activo
                    </label>
                  </div>
                ))}

                <button
                  onClick={() => handleAddColor(idx)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  + Agregar color
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={handleAddOption}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          + Agregar opción
        </button>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-white dark:bg-primary-800 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-700/70 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
