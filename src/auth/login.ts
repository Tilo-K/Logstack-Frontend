"use client";

import { LoginData, LoginResult, RefreshToken, Token, User } from "@/types";
import { get } from "http";
import { UserMinus } from "lucide-react";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";
import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from "next/dist/shared/lib/constants";

async function login(username: string, password: string) {
    const api_endpoint = `${process.env["NEXT_PUBLIC_API_URL"]}/auth/login`;
    const data: LoginData = {
        username,
        password,
    };

    const result = await fetch(api_endpoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!result.ok) throw "Login error";

    const loginResult = (await result.json()) as LoginResult;

    setToken(loginResult.authToken);
    setRefreshToken(loginResult.refreshToken);

    //@ts-ignore
    const currentRefreshInter = window.tokenInterval;
    try {
        clearInterval(currentRefreshInter);
    } catch (e) {}

    //@ts-ignore
    window.tokenInterval = setInterval(async () => {
        await getNewToken();
    }, 1000 * 60 * 15);

    return loginResult;
}

async function getNewToken() {
    let refToken = getRefreshToken();
    if (!refToken) throw "No Refreshtoken found";

    const api_endpoint = `${process.env["NEXT_PUBLIC_API_URL"]}/auth/refresh?refreshToken=${refToken.token}`;
    const result = await fetch(api_endpoint, {
        method: "POST",
    });

    const newToken = await result.text();
    setToken(newToken);

    return getToken();
}

async function getMe() {
    const token = getToken();
    if (!token) return null;

    const api_endpoint = `${process.env["NEXT_PUBLIC_API_URL"]}/auth/me`;
    const result = await fetch(api_endpoint, {
        method: "GET",
    });

    const user = (await result.json()) as User;

    return user;
}

function setToken(token: string) {
    localStorage.setItem("AUTH_TOKEN", token);
}

function setRefreshToken(token: RefreshToken) {
    localStorage.setItem("AUTH_REFRESHTOKEN", JSON.stringify(token));
}

function getToken() {
    validateToken();
    return localStorage?.getItem("AUTH_TOKEN");
}

function getRefreshToken() {
    const data = localStorage?.getItem("AUTH_REFRESHTOKEN");
    if (!data) return null;

    return JSON.parse(data) as RefreshToken;
}

function isLoggedIn() {
    const refToken = getRefreshToken();
    if (!refToken) return false;

    const token = getToken();
    if (!token) return false;

    const expDate = new Date(refToken.expirationDate);
    if (expDate < new Date()) {
        localStorage.clear();
        return false;
    }

    return true;
}

function getTokenObj() {
    const token = getToken();
    if (!token) return;
    const tokenstr = atob(token);
    const tokenObj = JSON.parse(tokenstr) as Token;

    return tokenObj;
}

function validateToken() {
    const token = localStorage?.getItem("AUTH_TOKEN");
    if (!token) return false;
    const tokenstr = atob(token);
    const tokenObj = JSON.parse(tokenstr) as Token;

    if (tokenObj.ExpirationDate < new Date().toISOString()) {
        localStorage.removeItem("AUTH_TOKEN");
        getNewToken();
    }
}

export { login, getToken, isLoggedIn, getMe };
