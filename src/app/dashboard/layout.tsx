import { Button } from "@/components/ui/button";
import { TreePine, Home, NotebookTabs } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";
import { namePlaceholder } from "@/util/placeholder";
import { Suspense, useState } from "react";
import { createProject } from "@/projects/projects";
import ProjectDialog from "./dialog";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LogStack",
    description: "LogStack the simple log aggregation software",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold"
                        >
                            <TreePine />
                            <span className="">LogStack</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/projects"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <NotebookTabs className="h-4 w-4" />
                                Projects
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <ProjectDialog />
                </header>
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
        </div>
    );
}
