import { RequestHandler } from "express";
import { PrismaClient, } from "@prisma/client";
import { RequestWithJWTBody } from "./index";

type Reptile = {
  id?: number,
  species: "ball_python" | "king_snake" | "corn_snake" | "redtail_boa",
  name: string,
  sex: "m" | "f",
}

// Create a reptile
export const createReptile = (client: PrismaClient): RequestHandler =>
 async (req: RequestWithJWTBody, res) => {
  const { species, name, sex } = req.body as Reptile;
  if (!species || !name || !sex || !req.jwtBody) {
    return res.status(400).json({ message: "Missing Data" });
  }
  const userId = req.jwtBody.userId;
  const reptile = await client.reptile.create({
    data: {
      userId: userId,
      species,
      name,
      sex,
    }
  });
  res.json({ reptile });
  return;
}

// Delete a reptile.
export const deleteReptile = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  const reptileId = Number(req.query.reptileId);
  if (!reptileId) {
    return res.status(400).json({message: "Error identifying reptile"});
  }
  const deleteReptile = await client.reptile.delete({
    where: {
      id: reptileId,
    }
  });
  res.json({message: "Reptile deleted"})
  return;
}

// Update a reptile
export const updateReptile = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  let { id, species, name, sex } = req.body as Reptile;
  if (!species || !name || !sex || !req.jwtBody) {
    return res.status(400).json({ message: "Missing Data" });
  }
  const userId = req.jwtBody.userId;
  id = Number(id);
  const updateReptile = await client.reptile.update({
    where: {
      id: id,
    },
    data: {
      userId: userId,
      species,
      name,
      sex,
    }
  });
  res.json({ updateReptile });
  return;
}

// List all of my reptiles
export const listReptiles = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  const userId = req.jwtBody?.userId;
  if (!userId) {
    return res.status(400).json({ message: "Missing user id"});
  }
  const reptiles = await client.reptile.findMany({
    where: {
      userId: {
        equals: userId,
      }
    }
  });
  res.json({ reptiles });
  return;
}

type Feeding = {
  reptileId: number,
  foodItem: string,
}

// Create a feeding for a reptile.
export const createFeeding = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  let { reptileId, foodItem } = req.body as Feeding;
  if (!foodItem || !reptileId) {
    return res.status(400).json({ message: "Missing data"})
  }
  reptileId = Number(reptileId);
  const feeding = await client.feeding.create({
    data: {
      reptileId,
      foodItem,
    }
  });
  res.json({ feeding });
  return;
}

// List all the feedings for a reptile.
export const listFeedings = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  const reptileId = Number(req.query.reptileId);
  if (!reptileId) {
    return res.status(400).json({ message: "Missing Reptile Data"});
  }
  const feedings = await client.feeding.findMany({
    where: {
      reptileId: {
        equals: reptileId,
      }
    }
  });
  res.json({ feedings });
  return;
}

type HusbandryRecord = {
  reptileId: number,
  length: number,
  weight: number,
  temperature: number,
  humidity: number,
}

// Create a husbandry record for a reptile.
export const createHusbandryRecord = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  let { reptileId, length, weight, temperature, humidity } = req.body as HusbandryRecord;
  if (!reptileId || !length || !weight || !temperature || !humidity) {
    return res.status(400).json({ message: "Missing Data"});
  }
  reptileId = Number(reptileId);
  length = Number(length);
  weight = Number(weight);
  temperature = Number(temperature);
  humidity = Number(humidity);
  const husbandry = await client.husbandryRecord.create({
    data: {
      reptileId,
      length,
      weight,
      temperature,
      humidity,
    }
  });
  res.json({ husbandry });
  return;
}

// List all the husbandry records for a reptile.
export const listHusbandryRecords = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  const reptileId = Number(req.query.reptileId);
  if (!reptileId) {
    return res.status(400).json({ message: "Missing Reptile Data"});
  }
  const records = await client.husbandryRecord.findMany({
    where: {
      reptileId: {
        equals: reptileId,
      }
    }
  });
  res.json({ records });
  return;
}

type Schedule = {
  reptileId: number,
  userId: number,
  type: "feed" | "record" | "clean",
  description: string,
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  sunday: boolean,
}

// Create a schedule for a reptile.
export const createSchedule = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  let { reptileId, userId, type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body as Schedule;
  if (!reptileId || !userId || !type || !(monday || tuesday || wednesday || thursday || friday || saturday || sunday)) {
    return res.status(400).json({ message: "Missing Data"});
  }
  reptileId = Number(reptileId);
  userId = Number(userId);
  monday = Boolean(monday);
  tuesday = Boolean(tuesday);
  wednesday = Boolean(wednesday);
  thursday = Boolean(thursday);
  friday = Boolean(friday);
  saturday = Boolean(saturday);
  sunday = Boolean(sunday);
  const schedule = await client.schedule.create({
    data: {
      reptileId,
      userId,
      type,
      description,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    }
  });
  res.json({ schedule });
  return;
}

// List all the schedules for a reptile.
export const listReptileSchedules = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  const reptileId = Number(req.query.reptileId);
  if (!reptileId) {
    return res.status(400).json({ message: "Missing Reptile Data"});
  }
  const schedule = await client.schedule.findMany({
    where: {
      reptileId: {
        equals: reptileId,
      }
    }
  });
  res.json({ schedule });
  return;
}