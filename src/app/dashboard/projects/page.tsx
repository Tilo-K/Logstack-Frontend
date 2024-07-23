"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { getProjects } from "@/projects/projects";
import { Project } from "@/types";
import React, { useEffect } from "react";
import DeleteDialog from "./deleteDialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function ProjectsPage() {
    const [projects, setProjects] = React.useState<Project[]>([]);
    const router = useRouter();
    const { toast } = useToast()

    useEffect(() => {
        getProjects().then((projects) => {
            setProjects(projects);
        });
    }, []);

    return (
        <div className="p-4">
            {projects.map((project) => (
                <Card key={project.id}>
                    <CardHeader>
                        <CardTitle>Project: {project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Log entries: {";("}</p>
                        <p>
                            Creation Date:{" "}
                            {new Date(project.creationDate).toLocaleString()}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push(`/dashboard/projects/${project.id}`)
                            }
                        >
                            View
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                navigator.clipboard.writeText(project.secret);
                                toast({
                                    title: "Copied to clipboard",
                                    description: "The secret has been copied to your clipboard",
                                    variant: "default",
                                });
                            }}
                        >
                            Copy Secret
                        </Button>
                        <DeleteDialog project={project} />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
