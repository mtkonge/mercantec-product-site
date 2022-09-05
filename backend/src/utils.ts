import { Database } from "./Database";
import { Request } from "express";

export const generateUUID = (length: number = 32) => {
    const chars = "abcdef";
    let uuid = "";
    for (let i = 0; i < length; i++)
        uuid += chars.charAt(Math.random() * chars.length);
    return uuid;
};
export const checkSession = async (req: Request, database: Database) => {
    const token = req.cookies.token || req.headers.token;

    return await database.findSessionByToken(token);
};

export const random = (min: number, max: number) => {
    const random = Math.random();
    const shifted = random * (max - min);
    return shifted + min;
};

export const randId = (min: number, max: number) => {
    return Math.floor(random(min, max));
};

export const doesExist = (values: any[]) => {
    for (let v in values) {
        if (v === null) return false;
        if (v === undefined) return false;
    }
    return true;
};
