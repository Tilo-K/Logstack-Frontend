import { getToken } from "@/auth/login";
import { FilterOptions, Log } from "@/types";

export async function getLogs(
    projectId: string,
    secret: string,
    logLevel?: string,
    origin?: string,
    content?: string,
    top: number = 100,
    skip: number = 0
) {
    let api_endpoint = `${process.env["NEXT_PUBLIC_API_URL"]}/log/getlogs?secret=${secret}&projectId=${projectId}&top=${top}&skip=${skip}`;

    if (logLevel) api_endpoint += `&logLevel=${logLevel}`;
    if (origin) api_endpoint += `&origin=${origin}`;
    if (content) api_endpoint += `&content=${content}`;

    const result = await fetch(api_endpoint, {
        method: "GET",
        headers: {
            Authorization: `${secret}`,
        },
    });

    const logs = (await result.json()) as Log[];

    return logs;
}

export async function getLogCount(projectId: string, secret: string) {
    const api_endpoint = `${process.env["NEXT_PUBLIC_API_URL"]}/log/getlogcount?projectId=${projectId}&secret=${secret}`;

    const result = await fetch(api_endpoint, {
        method: "GET",
        headers: {
            Authorization: `${secret}`,
        },
    });

    const count = (await result.json()) as number;

    return count;
}

export async function getFilterOptions(projectId: string, secret: string) {
    const api_endpoint = `${process.env["NEXT_PUBLIC_API_URL"]}/log/getfilteroptions?projectId=${projectId}`;
    const result = await fetch(api_endpoint, {
        method: "GET",
        headers: {
            Authorization: `${secret}`,
        },
    });
    const options = (await result.json()) as FilterOptions;

    return options;
}
