'use client'

import Link from 'next/link'

export default function AuthErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
            <p className="mb-8 text-gray-600">
                There was an issue signing you in.
            </p>
            <Link
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Return to Home
            </Link>
        </div>
    )
}