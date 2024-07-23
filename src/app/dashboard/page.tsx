"use client";

import { isLoggedIn } from "@/auth/login";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { getProjects } from "@/projects/projects";
import { Project } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Dashboard() {
    const router = useRouter();
    const [projects, setProjects] = React.useState<Project[]>([]);

    useEffect(() => {
        const loggedIn = isLoggedIn();

        if (!loggedIn) {
            router.push("/login", { scroll: false });
        }
    }, [router]);

    useEffect(() => {
        getProjects().then((projects) => {
            setProjects(projects);
        });
    }, []);

    return (
        <main className="flex flex-col gap-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>{projects.length} Project(s)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>With a sum of: {";("} log entries</p>
                </CardContent>
            </Card>
            {projects.map((project) => (
                <Card key={project.id}>
                    <CardHeader>
                        <CardTitle>Project: {project.name}</CardTitle>
                        {/* <CardDescription>Card Description</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <p>Log entries: {";("}</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
            ))}
        </main>
    );
}
