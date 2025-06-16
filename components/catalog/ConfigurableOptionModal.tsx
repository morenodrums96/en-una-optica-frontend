"use client"

import { useState, useEffect } from "react";

export type Color = {
  name: string;
  hex: string;
  enabled: boolean;
};
export type ConfigurableOption = {
  _id?: string
  group: string
  groupDescription: string
  allowMultiple: boolean
  enabled: boolean
}
interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (group: string, description: string, allowMultiple: boolean, options: Option[]) => void;
  defaultData?: ConfigurableOption & { options: Option[] };
}

type Option = {
  name: string;
  description?: string;
  price: string;
  activeQuantity: boolean;
  availableColors?: Color[];
};

export default function ConfigurableOptionModal({ show, onClose, onSubmit, defaultData }: Props) {
  const [group, setGroup] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (show && defaultData) {
      setGroup(defaultData.group);
      setGroupDescription(defaultData.groupDescription);
      setAllowMultiple(defaultData.allowMultiple);
      setOptions(defaultData.options || []);
    } else if (show) {
      // si es un modal vacío (para crear)
      setGroup("");
      setGroupDescription("");
      setAllowMultiple(false);
      setOptions([]);
    }
  }, [show, defaultData]);

  const handleAddOption = () => {
    setOptions(prev => [
      ...prev,
      {
        name: "",
        description: "",
        price: "",
        activeQuantity: false,
        availableColors: [],
      },
    ]);
  };

  const handleOptionChange = (index: number, field: keyof Option, value: any) => {
    const updated = [...options];
    if (field === "availableColors") return;
    (updated[index] as any)[field] = value;
    setOptions(updated);
  };

  const handleAddColor = (optIndex: number) => {
    const updated = [...options];
    if (!updated[optIndex].availableColors) {
      updated[optIndex].availableColors = [];
    }
    updated[optIndex].availableColors!.push({ name: "", hex: "#000000", enabled: true });
    setOptions(updated);
  };

  const handleColorChange = (
    optIndex: number,
    colorIndex: number,
    field: "name" | "hex" | "enabled",
    value: string | boolean
  ) => {
    const updated = [...options];
    if (!updated[optIndex].availableColors) return;
    const color = updated[optIndex].availableColors![colorIndex];
    if (!color) return;

    if (field === "name" && typeof value === "string") color.name = value;
    else if (field === "hex" && typeof value === "string") color.hex = value;
    else if (field === "enabled" && typeof value === "boolean") color.enabled = value;

    setOptions(updated);
  };

  const handleSave = () => {
    const newErrors: string[] = [];

    if (!group.trim()) {
      newErrors.push("El nombre del grupo es obligatorio.");
    }

    options.forEach((opt, idx) => {
      if (!opt.name.trim()) {
        newErrors.push(`La opción #${idx + 1} debe tener un nombre.`);
      }

      const priceNumber = parseFloat(opt.price);
      if (isNaN(priceNumber)) {
        newErrors.push(`La opción #${idx + 1} tiene un precio inválido.`);
      }

      if (opt.activeQuantity) {
        if (!opt.availableColors || opt.availableColors.length === 0) {
          newErrors.push(`La opción #${idx + 1} requiere al menos un color.`);
        } else {
          opt.availableColors.forEach((color, cIdx) => {
            if (!color.name.trim()) {
              newErrors.push(`La opción #${idx + 1} el color #${cIdx + 1} debe tener un nombre.`);
            }
          });
        }
      }
    });


    if (newErrors.length > 0) {
      setErrors(newErrors);
      setShowErrors(true);

      setTimeout(() => {
        setShowErrors(false);
        setErrors([]);
      }, 5000); // 3 segundos

      return;
    }

    onSubmit(group, groupDescription, allowMultiple, options);
  };

  if (!show) return null;

  const handleRemoveOption = (index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-primary-900 p-6 rounded shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] animate-slide-up">
        <h2 className="text-lg font-semibold mb-4 text-primary-900 dark:text-primary-100">
          {defaultData?._id ? 'Editar grupo configurable' : 'Crear nuevo grupo'}
        </h2>
        {errors.length > 0 && (
          <div
            className={`mb-4 p-4 bg-danger-100 text-danger-700 rounded border border-danger-500 transition-opacity duration-500 ease-in-out ${showErrors ? "opacity-100" : "opacity-0"
              }`}
          >
            <ul className="list-disc list-inside text-sm">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
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
          className="w-full mb-6 px-4 py-2 rounded border border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-800"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 mb-6">
          {/* Switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const newState = !allowMultiple;
                setAllowMultiple(newState);
                if (!newState) {
                  setOptions([]);
                }
              }}
              className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${allowMultiple ? "bg-primary-600" : "bg-primary-300"
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${allowMultiple ? "translate-x-6" : ""
                  }`}
              />
            </button>
            <span className="text-sm text-primary-900 dark:text-primary-100">Permite múltiples</span>
          </div>

          {/* Agregar opción */}
          {allowMultiple && (
            <button
              onClick={handleAddOption}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm rounded-md border border-primary-400 text-primary-600 hover:bg-primary-100 hover:text-primary-800 transition-colors"
            >
              <span className="text-lg">＋</span>
              Agregar opción
            </button>
          )}
        </div>

        {options.map((opt, idx) => (
          <div key={idx} className="border p-4 mb-4 rounded bg-primary-50 dark:bg-primary-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-primary-900 dark:text-primary-100">Opción #{idx + 1}</h3>
              <button
                onClick={() => handleRemoveOption(idx)}
                className="p-1 rounded-full text-danger-400 hover:text-danger-600 transition"
                title="Eliminar opción"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
              type="text"
              inputMode="decimal"
              value={opt.price}
              onChange={(e) => {
                const rawValue = e.target.value;
                // Permitir solo números con punto decimal opcional
                if (/^[0-9]*[.,]?[0-9]*$/.test(rawValue) || rawValue === "") {
                  handleOptionChange(idx, "price", rawValue);
                }
              }}
              placeholder="Precio"
              className="w-full mb-2 px-3 py-2 border rounded appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />




            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => handleOptionChange(idx, "activeQuantity", !opt.activeQuantity)}
                className={`w-10 h-5 rounded-full transition-colors duration-300 relative ${opt.activeQuantity ? "bg-primary-600" : "bg-primary-300"
                  }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ${opt.activeQuantity ? "translate-x-5" : ""
                    }`}
                />
              </button>
              <span className="text-sm text-primary-900 dark:text-primary-100">Activar colores</span>
            </div>

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
                  className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-sm rounded-md border border-primary-300 text-primary-600 hover:bg-primary-100 hover:text-primary-800 transition"
                >
                  <span className="text-base leading-none">＋</span>
                  Agregar color
                </button>

              </div>
            )}
          </div>
        ))}


        {/* Botones finales */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-white dark:bg-primary-800 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-700/70 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-white dark:bg-primary-800 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-700/70 transition-colors"
          >
            {defaultData?._id ? 'Actualizar' : 'Guardar'}
          </button>

        </div>
      </div>
    </div>
  );
}
