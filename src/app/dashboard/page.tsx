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
import { getLogCount } from "@/logs/logs";
import { getProjects } from "@/projects/projects";
import { Project } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AnimatedCounter } from "react-animated-counter";

export default function Dashboard() {
    const router = useRouter();
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [logCount, setLogCount] = React.useState<Map<string, number>>(
        new Map()
    );

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

    useEffect(() => {
        for (const project of projects) {
            getLogCount(project.id, project.secret).then((count) => {
                setLogCount(new Map(logCount.set(project.id, count)));
            });
        }
    }, [projects]);

    const logCountSum = () => {
        try {
            return logCount.values().reduce((a, b) => a + b, 0);
        } catch (e) {
            return 0;
        }
    };

    return (
        <main className="flex flex-col gap-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>{projects.length} Project(s)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row justify-start gap-1">
                        <div>With a sum of:</div>{" "}
                        <AnimatedCounter
                            value={logCountSum()}
                            includeDecimals={false}
                            fontSize="16px"
                        />{" "}
                        <div className="flex-1">log entries</div>
                    </div>
                </CardContent>
            </Card>
            {projects.map((project) => (
                <Card key={project.id}>
                    <CardHeader>
                        <CardTitle>Project: {project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Log entries: {logCount.get(project.id)}</p>
                    </CardContent>
                </Card>
            ))}
        </main>
    );
}
