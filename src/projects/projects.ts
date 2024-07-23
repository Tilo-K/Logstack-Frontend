import { getToken } from "@/auth/login";
import { Project } from "@/types";

async function getProjects() {
    const api_endpoint = `${process.env["NEXT_PUBLIC_API_URL"]}/project/getprojects`;
    const result = await fetch(api_endpoint, {
        method: "GET",
        headers: {
            "Authorization": `${getToken()}`,
        }
    });

    const projects = (await result.json()) as Project[];

    return projects;
}

async function createProject(name: string) {
    const api_endpoint = `${process.env["NEXT_PUBLIC_API_URL"]}/project/createproject?projectName=${name}`;

    const result = await fetch(api_endpoint, {
        method: "POST",
        headers: {
            "Authorization": `${getToken()}`,
        }
    });

    if (!result.ok) throw "Create project error";

    const project = (await result.json()) as Project;

    return project;
}

async function deleteProject(id: string) {
    const api_endpoint = `${process.env["NEXT_PUBLIC_API_URL"]}/project/deleteproject?projectId=${id}`;

    const result = await fetch(api_endpoint, {
        method: "DELETE",
        headers: {
            "Authorization": `${getToken()}`,
        }
    });

    if (!result.ok) throw "Delete project error";

    return true;
}

export { getProjects, createProject, deleteProject };