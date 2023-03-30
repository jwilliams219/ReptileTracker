import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { userController, reptileController } from "./controller";
import cors from "cors";

const client = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

userController(app, client);
reptileController(app, client);


type jwtBody = {
  userId: number,
}

export type RequestWithJWTBody = Request & {
  jwtBody?: jwtBody,
}

// Return index page.
app.get("/", (req, res) => {
  res.send(`<h1>Reptile Tracker Coming Soon!</h1>`);
})

const port = 3000;
app.listen(port, () => {
  console.log("Started at Port:", port);
});