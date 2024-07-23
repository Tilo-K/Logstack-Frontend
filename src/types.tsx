export interface LoginData {
    username: string;
    password: string;
}

export interface Ulid {
    random: string;
    time: string;
}

export interface RefreshToken {
    token: string;
    userId: string;
    creationDate: string;
    expirationDate: string;
}

export interface LoginResult {
    issuingTime: string;
    authToken: string;
    refreshToken: RefreshToken;
}

export interface User {
    id: Ulid;
    username: string;
    password: string;
    email: string;
    admin: boolean;
}

export interface Project {
    id: string;
    name: string;
    secret: string;
    creationDate: string;
}

export interface Token{
    UserId: string;
    ProjectAccess: string[];
    ExpirationDate: string;
    Admin: boolean;
    Hash: string;
}