"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = pathname.startsWith("/login") || pathname.startsWith("/api");

  useEffect(() => {
    if (!isPublic && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [isPublic, status, router]);

  if (!isPublic && status !== "authenticated") {
    return null;
  }

  return children;
} 