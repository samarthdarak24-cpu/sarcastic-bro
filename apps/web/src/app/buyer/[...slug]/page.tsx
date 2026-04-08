"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuyerCatchAll() {
  const router = useRouter();

  useEffect(() => {
    // Redirect any unknown buyer routes back to dashboard
    router.replace("/buyer/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-slate-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
