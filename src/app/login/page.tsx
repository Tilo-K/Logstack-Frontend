"use client";

import { login } from "@/auth/login";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginError, setLoginError] = useState<boolean>(false);

    const router = useRouter();

    async function makeLoginRequest() {
        try {
            const res = await login(username, password);

            router.push("/dashboard", { scroll: false });
        } catch (e) {
            console.error(e);
            setLoginError(true);
        }
    }

    return (
        <main className="w-full h-[100vh] flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        {loginError ? (
                            <span className="text-red-700 animate-bounce -">
                                There has been an error logging in
                            </span>
                        ) : (
                            "Enter your credentials below to login."
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.currentTarget.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            onKeyDownCapture={(e) => {
                                if (e.key === "Enter") makeLoginRequest();
                            }}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={makeLoginRequest}>
                        Sign in
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}
