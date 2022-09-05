import { Database } from "./Database";
import { Router, Request, Response } from "express";
import { Session, User } from "./Models";
import { doesExist, checkSession, generateUUID } from "./utils";
import bcrypt from "bcrypt";

export const userApiRoutes = (router: Router, database: Database) => {
    router.post("/user/register", async (req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password || /[<>]/.test(username))
            return res.json({ msg: "Invalid username/password" });

        if (await database.findUserByUsername(username))
            return res.json({ msg: "Username occupied" });

        const user = new User(username, await bcrypt.hash(password, 10));

        await database.addUser(user);

        return res.json({ msg: "Ok", userId: user.id });
    });

    router.post("/user/login", async (req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!doesExist([username, password]) === null) {
            return res.json({ msg: "Missing input" });
        }

        const user = await database.findUserByUsername(username);

        if (user === null) {
            return res.json({ msg: "Wrong username/password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.json({ msg: "Wrong username/password" });
        }

        const session = new Session(generateUUID(), user.id);

        await database.addSession(session);

        res.cookie("token", session.token, {
            httpOnly: true,
            sameSite: "lax",
        });

        return res.json({ msg: "Ok", id: user.id });
    });

    router.post("/user/logout", async (req: Request, res: Response) => {
        const session = await checkSession(req, database);
        if (session !== null) {
            await database.removeSession(session);
        }

        res.clearCookie("token");

        return res.json({ msg: "Ok" });
    });

    router.get("/user/one/:id", async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        const session = await checkSession(req, database);
        if (session === null) {
            return res.json({ msg: "Unauthorized" });
        }

        const user = await database.findUserById(id);

        if (user === null) return res.json({ msg: "User doesn't exist" });

        return res.json({ msg: "Ok", id: user.id, username: user.username });
    });

    router.get("/user/data", async (req: Request, res: Response) => {
        const session = await checkSession(req, database);

        if (session === null) {
            return res.json({ msg: "Unauthorized" });
        }

        const user = await database.findUserById(session.userId);

        if (user === null) return res.json({ msg: "User doesn't exist" });

        const noPasswordUser = { ...user, password: undefined };

        return res.json({ msg: "Ok", data: noPasswordUser });
    });
    return router;
};
