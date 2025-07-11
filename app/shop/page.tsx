'use client'

import { useEffect, useState, useCallback } from 'react'
import { getProductSelected } from '@/lib/productsApis/productApis'
import { useWishlist } from '@/hooks/useWishlist'
import logoLends from '@/components/icons/logoLends.svg'
import logoLendsBlue from '@/components/icons/logoLendsBlue.svg'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'


export default function ShopPage() {
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({})
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const { toggleWishlist, isInWishlist } = useWishlist()
    const { addToCart } = useCart()

    // Define useCallback hooks at the top level, unconditionally
    const goToPreviousImage = useCallback(() => {
        // Ensure images is always an array, even if product or variants are null
        const currentImages = product?.variants?.[0]?.images || [];
        setCurrentImageIndex((prev) =>
            prev === 0 ? currentImages.length - 1 : prev - 1
        )
    }, [product]) // Dependency on product, as images depends on it

    const goToNextImage = useCallback(() => {
        // Ensure images is always an array, even if product or variants are null
        const currentImages = product?.variants?.[0]?.images || [];
        setCurrentImageIndex((prev) =>
            prev === currentImages.length - 1 ? 0 : prev + 1
        )
    }, [product]) // Dependency on product, as images depends on it

    useEffect(() => {
        const fetchProduct = async () => {
            const id = localStorage.getItem('selectedProductId')
            if (!id) {
                setLoading(false)
                return
            }

            try {
                const data = await getProductSelected(id)
                setProduct(data.product)
                console.log('VARIANTS:', data.product.variants)

            } catch (error) {
                console.error('Error cargando producto:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [])

    const handleOptionToggle = useCallback((groupId: string, option: any) => {
        setSelectedOptions(prev => {
            const group = prev[groupId] || []
            const alreadySelected = group.some((o: any) => o._id === option._id)
            const allowMultiple = product.configurableOptions.find((g: any) => g._id === groupId)?.allowMultiple

            if (allowMultiple) {
                return {
                    ...prev,
                    [groupId]: alreadySelected
                        ? group.filter((o: any) => o._id !== option._id)
                        : [...group, { ...option, quantity: 1, selectedColor: null }]
                }
            } else {
                return {
                    ...prev,
                    [groupId]: [{ ...option, quantity: 1, selectedColor: null }]
                }
            }
        })
    }, [product])

    const handleColorSelect = useCallback((groupId: string, optionId: string, color: any) => {
        setSelectedOptions(prev => {
            const updatedGroup = (prev[groupId] || []).map((o: any) => {
                if (o._id === optionId) {
                    return { ...o, selectedColor: color }
                }
                return o
            })

            return {
                ...prev,
                [groupId]: updatedGroup
            }
        })
    }, [])

    const handleQuantityChange = useCallback((groupId: string, optionId: string, quantity: number) => {
        setSelectedOptions(prev => {
            const updatedGroup = (prev[groupId] || []).map((o: any) => {
                if (o._id === optionId) {
                    return { ...o, quantity: Math.max(1, quantity) }
                }
                return o
            })

            return {
                ...prev,
                [groupId]: updatedGroup
            }
        })
    }, [])

    if (loading) return <div className="flex justify-center items-center h-screen text-lg text-gray-700">Cargando producto...</div>
    if (!product) return <div className="flex justify-center items-center h-screen text-lg text-red-500">Producto no encontrado o error al cargar.</div>

    const images = product.variants?.[0]?.images?.length
        ? product.variants[0].images
        : product.variants?.[0]?.image
            ? [product.variants[0].image]
            : ['/images/placeholder-product.png']; const hasMultipleImages = images.length > 1;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <div className="flex items-center justify-center gap-4 mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800 text-center">{product.name}</h1>

                <button
                    onClick={() => toggleWishlist(product._id)}
                    className="p-2 rounded-full bg-white shadow hover:scale-105 transition-transform"
                    aria-label="Agregar a favoritos"
                >
                    <Image
                        src={isInWishlist(product._id) ? logoLendsBlue : logoLends}
                        alt="Me gusta"
                        width={30}
                        height={30}
                        className="w-7 h-7 object-contain"
                    />
                </button>
            </div>

            {/* Main content area: Image on left, Options on right */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16"> {/* Added flex container */}

                {/* VISOR DE IMÁGENES - Left Column */}
                {images.length > 0 && (
                    <div className="w-full md:w-7/12 flex-shrink-0"> {/* Adjusted width for image */}
                        <div className="relative w-full mx-auto mb-4 bg-gray-100 rounded-xl overflow-hidden shadow-xl">
                            <img
                                src={images[currentImageIndex]}
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/imagen/placeholder-product.webp'
                                }}
                                alt={`Imagen de ${product.name} ${currentImageIndex + 1}`}
                                className="w-full h-[450px] object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                            />


                            {/* Miniaturas de imágenes */}
                            {hasMultipleImages && (
                                <div className="flex justify-center mt-4 gap-3">
                                    {images.map((img: string, index: number) => (
                                        <img
                                            key={index}
                                            src={img}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = '/imagen/placeholder-product.webp'
                                            }}
                                            alt={`Miniatura ${index + 1}`}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-transform duration-200 hover:scale-105 ${currentImageIndex === index ? 'border-primary-600' : 'border-transparent'
                                                }`}
                                        />

                                    ))}
                                </div>
                            )}

                            {/* Botones de navegación (flechas) */}
                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={goToPreviousImage}
                                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        aria-label="Imagen anterior"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={goToNextImage}
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        aria-label="Imagen siguiente"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Dots de navegación (puntos) */}
                            {hasMultipleImages && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {images.map((img: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-colors duration-200 ${currentImageIndex === index ? 'bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                            aria-label={`Ver imagen ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PRODUCT DETAILS AND CONFIGURABLE OPTIONS - Right Column */}
                <div className="w-full md:w-5/12"> {/* Adjusted width for options */}
                    {/* Product Name (Optional, as it's at the top, but could be repeated here) */}
                    {/* <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2> */}

                    {/* Example of fixed price or initial price if needed */}
                    {/* <p className="text-3xl font-bold text-primary-700 mb-6">${product.basePrice?.toLocaleString('es-MX') || 'N/A'}</p> */}

                    {/* Description below price, if applicable */}
                    {product.description && (
                        <div className="mb-6 text-gray-700 leading-relaxed">
                            <h3 className="text-xl font-semibold mb-2">Descripción:</h3>
                            <p>{product.description}</p>
                        </div>
                    )}

                    {/* CONFIGURABLE OPTIONS */}
                    <div className="space-y-6"> {/* Added space between option groups */}
                        {product.configurableOptions?.map((group: any) => (
                            <div key={group._id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-700 mb-3">{group.group}</h3>
                                {group.groupDescription && <p className="text-md text-gray-600 mb-5">{group.groupDescription}</p>}

                                <div className="space-y-4">
                                    {group.options.filter((o: any) => o.enabled).map((option: any) => {
                                        const isSelected = (selectedOptions[group._id] || []).some(
                                            (o: any) => o._id === option._id
                                        )
                                        const selectedOptionData = (selectedOptions[group._id] || []).find(
                                            (o: any) => o._id === option._id
                                        );
                                        return (
                                            <div
                                                key={option._id}
                                                className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 ease-in-out
                                            ${isSelected ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => handleOptionToggle(group._id, option)}
                                            >
                                                <label className="flex items-center cursor-pointer justify-between">
                                                    <div className="flex-1">
                                                        <span className="font-semibold text-lg text-gray-800">{option.name}</span>
                                                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="font-bold text-lg text-green-600 ml-4">${option.price.toLocaleString('es-MX')}</span>
                                                        <input
                                                            type={group.allowMultiple ? 'checkbox' : 'radio'}
                                                            name={group._id}
                                                            checked={isSelected}
                                                            onChange={() => handleOptionToggle(group._id, option)}
                                                            className="ml-4 h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                </label>

                                                {/* COLORES */}
                                                {option.availableColors?.length > 0 && isSelected && (
                                                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                                                        <span className="text-md font-medium text-gray-700 mr-2">Color:</span>
                                                        {option.availableColors
                                                            .filter((c: any) => c.enabled)
                                                            .map((color: any) => (
                                                                <div
                                                                    key={color._id}
                                                                    onClick={(e) => { e.stopPropagation(); handleColorSelect(group._id, option._id, color); }}
                                                                    className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-transform duration-200 hover:scale-110
                                                                    ${selectedOptionData?.selectedColor?._id === color._id ? 'ring-2 ring-offset-2 ring-primary-500' : ''
                                                                        }`}
                                                                    style={{ backgroundColor: color.hex, borderColor: color.hex === '#FFFFFF' ? '#CCCCCC' : color.hex }}
                                                                    title={color.name}
                                                                />
                                                            ))}
                                                    </div>
                                                )}

                                                {/* CANTIDAD */}
                                                {option.activeQuantity && isSelected && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center">
                                                        <label htmlFor={`quantity-${option._id}`} className="text-md font-medium text-gray-700 mr-3">Cantidad:</label>
                                                        <input
                                                            id={`quantity-${option._id}`}
                                                            type="number"
                                                            min={1}
                                                            value={selectedOptionData?.quantity || 1}
                                                            onChange={(e) => { e.stopPropagation(); handleQuantityChange(group._id, option._id, parseInt(e.target.value)); }}
                                                            className="w-24 border border-gray-300 rounded-md px-3 py-2 text-md text-center focus:ring-primary-500 focus:border-primary-500"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-10 text-center md:text-left">
                        <button
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300"
                            onClick={() => {
                                const totalPrice = Object.values(selectedOptions)
                                    .flat()
                                    .reduce((acc, opt: any) => acc + opt.price * (opt.quantity || 1), 0)

                                addToCart({
                                    _id: product._id,
                                    name: product.name,
                                    customerPrice: product.customerPrice,
                                    variantImage: product.variants?.[0]?.images?.[0] || '/images/placeholder.png',
                                    selectedOptions,
                                })


                                alert('¡Producto añadido al carrito!')
                            }}
                        >
                            Añadir al Carrito
                        </button>

                    </div>

                    {/* Details / Guarantees Section (as seen in Sam example) */}
                    <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Detalles y Garantías</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Devolución por gusto</li>
                            <li>Devolución por graduación inadecuada</li>
                            <li>Garantía antirayaduras</li>
                            <li>Garantía por defectos de fábrica</li>
                            <li>Échale ojo a tus <a href="#" className="text-primary-600 hover:underline">garantías</a></li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Resumen de la selección (moved to bottom, optional) */}
            <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-inner">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Tu selección actual:</h3>
                {Object.keys(selectedOptions).length === 0 ? (
                    <p className="text-gray-600">Aún no has seleccionado ninguna opción.</p>
                ) : (
                    <ul className="space-y-2">
                        {Object.entries(selectedOptions).map(([groupId, options]) => {
                            const groupName = product.configurableOptions.find((g: any) => g._id === groupId)?.group || 'Opción desconocida';
                            return (
                                <li key={groupId} className="text-gray-700">
                                    <span className="font-semibold">{groupName}:</span>
                                    <ul className="ml-4 list-disc list-inside">
                                        {(options as any[]).map((opt: any) => (
                                            <li key={opt._id}>
                                                {opt.name} - ${opt.price.toLocaleString('es-MX')}
                                                {opt.selectedColor && (
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        (Color: {opt.selectedColor.name})
                                                    </span>
                                                )}
                                                {opt.quantity && (
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        (Cantidad: {opt.quantity})
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    )
}