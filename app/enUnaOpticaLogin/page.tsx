'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Dancing_Script } from 'next/font/google'
import { useRouter } from 'next/navigation'

const dancingScript = Dancing_Script({
    weight: ['400', '700'],
    subsets: ['latin'],
})

export default function LoginPage() {
    const [companyEmail, setCompanyEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [showError, setShowError] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:5000/api/secure/entrada-de-control-personal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ companyEmail, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error desconocido')
            }

            setErrorMsg('')
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error('Error en el login:', error.message)
            setErrorMsg(error.message)
            setShowError(true)

            setTimeout(() => {
                setShowError(false)
                setTimeout(() => setErrorMsg(''), 300) // espera a que termine la animación antes de borrarlo
            }, 3000)

        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4">
            {/* Fondo con imagen difuminada */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/bg-login.jpg"
                    alt="Fondo Ciudad de México"
                    fill
                    className="object-cover blur-sm opacity-60"
                    priority
                />
            </div>
            <div className="flex w-full max-w-5xl min-h-[40vh] rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-xl transition-all duration-700 ease-in-out animate-fade-in">
                <div className="w-1/2 bg-primary-100 flex flex-col items-center justify-center p-10 bg-white/10">
                    <Image
                        src="/dark_logo_transparent_background.png"
                        alt="Logo de En Una Óptica"
                        width={400}
                        height={200}
                        className="mb-4"
                    />

                </div>

                {/* Lado derecho - Login */}
                <div className="w-1/2 bg-white/10 backdrop-blur-lg border-l border-white/30 flex items-center justify-center p-10">
                    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                        <h2
                            className={`text-3xl font-bold text-center text-primary-900 mb-8 ${dancingScript.className}`}
                        >
                            Bienvenido
                        </h2>
                        <div
                            className={`mb-4 p-3 rounded-md bg-red-100 border border-red-300 text-red-700 text-sm shadow-sm transition-all duration-300 transform ${showError ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                        >
                            {errorMsg}
                        </div>


                        <div className="mb-4">
                            <label htmlFor="email" className="text-sm text-gray-700 block mb-1">
                                Correo empresarial
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="ejemplo@optica.com"
                                value={companyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="text-sm text-gray-700 block mb-1">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-500 text-white font-semibold py-2 rounded-md hover:bg-primary-600 transition-all"
                        >
                            Iniciar sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
