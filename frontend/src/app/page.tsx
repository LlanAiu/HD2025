import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Solo Mafia</h1>
      <Link href="/new">
        <div className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
          New Game
        </div>
      </Link>
    </div>
  );
}
