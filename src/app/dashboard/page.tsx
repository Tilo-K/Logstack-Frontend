"use client";

import { isLoggedIn } from "@/auth/login";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        const loggedIn = isLoggedIn();

        if (!loggedIn) {
            router.push("/login", { scroll: false });
        }
    }, [router]);
    
    return <main>Test</main>;
}
