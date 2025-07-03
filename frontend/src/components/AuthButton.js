"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Redirigir a / si ya está autenticado y está en /login
  useEffect(() => {
    if (session && pathname === "/login") {
      router.replace("/");
    }
  }, [session, pathname, router]);

  return (
    <button
      onClick={() => signIn('google')}
      className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-300 rounded-xl shadow hover:shadow-md transition-all duration-200 font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none"
      style={{ minWidth: 240 }}
    >
      <span className="inline-block">
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_17_40)">
            <path d="M47.5 24.5C47.5 22.8333 47.3333 21.3333 47.0833 19.8333H24V28.5H37.3333C36.8333 31.3333 35.1667 33.6667 32.6667 35.1667V40.1667H40.1667C44.1667 36.5 47.5 31.1667 47.5 24.5Z" fill="#4285F4"/>
            <path d="M24 48C30.5 48 35.8333 45.8333 40.1667 40.1667L32.6667 35.1667C30.6667 36.5 28.1667 37.3333 24 37.3333C17.8333 37.3333 12.5 33.1667 10.6667 27.6667H2.83334V32.8333C7.16667 41.1667 15.1667 48 24 48Z" fill="#34A853"/>
            <path d="M10.6667 27.6667C10.1667 26.3333 10 24.8333 10 23.3333C10 21.8333 10.1667 20.3333 10.6667 19H2.83334V13.8333C5.83334 8.83333 12.1667 4.66667 24 4.66667C28.1667 4.66667 30.6667 5.5 32.6667 6.83333L40.1667 1.83333C35.8333 -3.83333 30.5 -6 24 -6C15.1667 -6 7.16667 0.833333 2.83334 9.16667L10.6667 19Z" fill="#FBBC05"/>
          </g>
          <defs>
            <clipPath id="clip0_17_40">
              <rect width="48" height="48" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </span>
      <span>Iniciar sesión con Google</span>
    </button>
  );
}