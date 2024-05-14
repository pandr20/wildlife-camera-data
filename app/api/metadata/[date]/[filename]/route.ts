import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

const PHOTO_DIR = path.join("/home/pi/photos"); // Update this path accordingly

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date, filename } = req.query;
  const jsonFilename = (filename as string).replace(".jpg", ".json");
  const filepath = path.join(PHOTO_DIR, date as string, jsonFilename);
  fs.readFile(filepath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading metadata file:", err);
      return res.status(404).send("File not found");
    }
    res.status(200).json(JSON.parse(data));
  });
}
