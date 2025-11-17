// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Welcome to Koinsave</h1>
      <div className="flex gap-4">
        <Link href="/auth/login">
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Login
          </button>
        </Link>
        <Link href="/auth/signup">
          <button className="bg-gray-200 text-black px-6 py-2 rounded hover:bg-gray-300">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
}
