// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* ヘッダー */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">藤江'sサイト</h1>
                    </div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li><Link href="/" className="text-blue-600 font-medium hover:text-blue-800">ホーム</Link>
                            </li>
                            <li><Link href="/lp" className="text-gray-600 hover:text-gray-800">LP</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <footer>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>© 2025 藤江'sサイト All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
        ;
}