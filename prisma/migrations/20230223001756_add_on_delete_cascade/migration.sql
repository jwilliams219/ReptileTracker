-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feeding" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reptileId" INTEGER NOT NULL,
    "foodItem" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Feeding_reptileId_fkey" FOREIGN KEY ("reptileId") REFERENCES "Reptile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Feeding" ("createdAt", "foodItem", "id", "reptileId", "updatedAt") SELECT "createdAt", "foodItem", "id", "reptileId", "updatedAt" FROM "Feeding";
DROP TABLE "Feeding";
ALTER TABLE "new_Feeding" RENAME TO "Feeding";
CREATE TABLE "new_Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reptileId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monday" BOOLEAN NOT NULL,
    "tuesday" BOOLEAN NOT NULL,
    "wednesday" BOOLEAN NOT NULL,
    "thursday" BOOLEAN NOT NULL,
    "friday" BOOLEAN NOT NULL,
    "saturday" BOOLEAN NOT NULL,
    "sunday" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Schedule_reptileId_fkey" FOREIGN KEY ("reptileId") REFERENCES "Reptile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("createdAt", "description", "friday", "id", "monday", "reptileId", "saturday", "sunday", "thursday", "tuesday", "type", "updatedAt", "userId", "wednesday") SELECT "createdAt", "description", "friday", "id", "monday", "reptileId", "saturday", "sunday", "thursday", "tuesday", "type", "updatedAt", "userId", "wednesday" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE TABLE "new_HusbandryRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reptileId" INTEGER NOT NULL,
    "length" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "temperature" REAL NOT NULL,
    "humidity" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HusbandryRecord_reptileId_fkey" FOREIGN KEY ("reptileId") REFERENCES "Reptile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HusbandryRecord" ("createdAt", "humidity", "id", "length", "reptileId", "temperature", "updatedAt", "weight") SELECT "createdAt", "humidity", "id", "length", "reptileId", "temperature", "updatedAt", "weight" FROM "HusbandryRecord";
DROP TABLE "HusbandryRecord";
ALTER TABLE "new_HusbandryRecord" RENAME TO "HusbandryRecord";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
