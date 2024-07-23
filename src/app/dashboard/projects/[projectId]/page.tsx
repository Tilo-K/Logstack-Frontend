"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { getProjects } from "@/projects/projects";
import { Project } from "@/types";
import { useParams } from "next/navigation";
import router from "next/router";
import React, { useEffect } from "react";
import DeleteDialog from "../deleteDialog";
import { getLogCount } from "@/logs/logs";
import LogTable from "@/logs/logtable";
import { Car } from "lucide-react";

export default function ProjectDetailsPage() {
    const hiddenText = "⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤";
    const params = useParams<{ projectId: string }>();
    const [project, setProject] = React.useState<Project>();
    const [logCount, setLogCount] = React.useState<number>(0);
    const [hiddenSecret, setHiddenSecret] = React.useState<string>(hiddenText);

    useEffect(() => {
        getProjects().then((projects) => {
            const project = projects.find((p) => p.id === params.projectId);
            setProject(project);
        });
    }, []);

    useEffect(() => {
        if (project) {
            getLogCount(project.id, project.secret).then((count) => {
                setLogCount(count);
            });
        }
    }, [project]);

    const copySecret = () => {
        navigator.clipboard.writeText(project?.secret ?? "");
        toast({
            title: "Copied to clipboard",
            description: "The secret has been copied to your clipboard",
            variant: "default",
        });
    };

    return project ? (
        <div className="p-4 flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Project: {project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Id: {project.id}</p>
                    <p>Log entries: {logCount}</p>
                    <p>
                        Creation Date:{" "}
                        {new Date(project.creationDate).toLocaleString()}
                    </p>
                    <p
                        onMouseEnter={() => setHiddenSecret(project.secret)}
                        onMouseLeave={() => setHiddenSecret(hiddenText)}
                        onClick={() => copySecret()}
                        className="cursor-pointer"
                    >
                        Secret: {hiddenSecret.substring(0, 40)}...
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            copySecret();
                        }}
                    >
                        Copy Secret
                    </Button>
                    <DeleteDialog project={project} />
                </CardFooter>
            </Card>

            <Card>
                <CardContent>
                    <LogTable project={project} />
                </CardContent>
            </Card>
        </div>
    ) : (
        <div>Loading...</div>
    );
}
