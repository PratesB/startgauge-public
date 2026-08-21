"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        
        await fetchAPI("/api/v1/users/me");
        
        router.push("/dashboard");
      } catch (err) {
        router.push("/login");
      }
    };
    
    checkUser();
  }, [router]);

 
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}