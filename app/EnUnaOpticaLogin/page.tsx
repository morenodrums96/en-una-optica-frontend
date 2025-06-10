'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({
  weight: ['400', '700'],
  subsets: ['latin'],
})
export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
                        src="/logo_transparent_background.png"
                        alt="Logo de En Una Óptica"
                        width={400}
                        height={200}
                        className="mb-4"
                    />

                </div>

                {/* Lado derecho - Login */}
                <div className="w-1/2 bg-white/10 backdrop-blur-lg border-l border-white/30 flex items-center justify-center p-10">
                    <form className="w-full max-w-sm">
                        <h2
                            className={`text-3xl font-bold text-center text-primary-900 mb-8 ${dancingScript.className}`}
                        >
                            Bienvenido
                        </h2>

                        <div className="mb-4">
                            <label htmlFor="email" className="text-sm text-gray-700 block mb-1">
                                Correo empresarial
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="ejemplo@optica.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
