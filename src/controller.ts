import express, { Express, Request, RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { createUser, logIn, getMe, listUserSchedules } from './userEndPoints';
import { createReptile, deleteReptile, updateReptile, listReptiles, createFeeding, listFeedings, 
    createHusbandryRecord, listHusbandryRecords, createSchedule, listReptileSchedules } from './reptileEndpoints';
dotenv.config();


type jwtBody = {
    userId: number,
}
  
type RequestWithJWTBody = Request & {
    jwtBody?: jwtBody,
}

const authentication: RequestHandler = async (req: RequestWithJWTBody, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const jwtBody = jwt.verify(token || '', process.env.ENCRYPTION_KEY!!) as jwtBody;
        req.jwtBody = jwtBody;
    } catch (error) {
        console.log("token failed validation");
    } finally {
        next();
    }
}

type Route = {
    path: string,
    method: "post" | "get" | "put" | "delete",
    endpoint: (client: PrismaClient) => RequestHandler,
    skipAuthentication?: boolean,
}

const controller = (name: string, routes: Route[]) => (app: Express, client: PrismaClient) => {
    const router = express.Router();
    routes.forEach(route => {
        if (!route.skipAuthentication) {
            router.use(route.path, (req, res, next) => {
                if (req.method.toLowerCase() === route.method) {
                    authentication(req, res, next);
                } else {
                    next();
                }
            });
        }
        router[route.method](route.path, route.endpoint(client));
    });
    app.use(`/${name}`, router);
}
 
export const userController = controller(
    "users",
    [
        { path: "/", method: "post", endpoint: createUser, skipAuthentication: true },
        { path: "/login", method: "get", endpoint: logIn, skipAuthentication: true },
        { path: "/schedules/:userId", method: "get", endpoint: listUserSchedules},
        { path: "/me", method: "get", endpoint: getMe },
    ]
)

export const reptileController = controller(
    "reptiles",
    [
        { path: "/", method: "post", endpoint: createReptile },
        { path: "/:reptileId", method: "delete", endpoint: deleteReptile },
        { path: "/:reptileId", method: "put", endpoint: updateReptile },
        { path: "/all", method: "get", endpoint: listReptiles },
        { path: "/feeding/:reptileId", method: "post", endpoint: createFeeding },
        { path: "/feeding/:reptileId", method: "get", endpoint: listFeedings },
        { path: "/husbandry/:reptileId", method: "post", endpoint: createHusbandryRecord },
        { path: "/husbandry/:reptileId", method: "get", endpoint: listHusbandryRecords },
        { path: "/schedule/:reptileId", method: "post", endpoint: createSchedule },
        { path: "/schedule/:reptileId", method: "get", endpoint: listReptileSchedules },
    ]
)
