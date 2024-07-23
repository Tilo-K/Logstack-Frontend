"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createProject, deleteProject } from "@/projects/projects";
import { Project } from "@/types";
import { namePlaceholder } from "@/util/placeholder";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";

export default function DeleteDialog(props: { project: Project }) {
    const [open, setOpen] = useState(false);

    const deleteProjectAction = async () => {
        await deleteProject(props.project.id);

        setOpen(false);
        window.location.reload();
    };

    const cancelAction = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                        Do you really want to delete the project{" "}
                        {props.project.name}?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-6 justify-center"> 
                    <Button type="submit" variant="destructive" onClick={deleteProjectAction}>
                        Delete
                    </Button>
                    <Button type="submit" variant="secondary" onClick={cancelAction}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
