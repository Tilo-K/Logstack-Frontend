"use client";

import { isLoggedIn } from "@/auth/login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const loggedIn = isLoggedIn();

        if (!loggedIn) {
            router.replace("/login", { scroll: false });
        }else{
          router.replace("/dashboard", { scroll: false });
        }
    }, [router]);
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Loading...
        </main>
    );
}
