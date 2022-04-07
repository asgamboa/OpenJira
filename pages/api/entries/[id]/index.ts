import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../database";
import { Entry, IEntryModel } from "../../../../models";

type Data =
  | {
      message: string;
    }
  | IEntryModel;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;

  // if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "ID not valid" });

  switch (req.method) {
    case "PUT":
      return updateEntry(req, res);

    case "GET":
      return getEntryById(id as string, res);

    case "DELETE":
      return deleteEntry(id as string, res);

    default:
      return res.status(400).json({ message: "ID not valid" });
  }
}

const updateEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;

  await db.connect();

  const entryToUpdate = await Entry.findById(id);

  if (!entryToUpdate) {
    await db.disconnect();
    return res.status(400).json({ message: "No entries with provided ID" });
  }

  const { description = entryToUpdate.description, status = entryToUpdate.status } = req.body;

  try {
    const updatedEntry = await Entry.findByIdAndUpdate(id, { description, status }, { runValidators: true, new: true });
    await db.disconnect();
    return res.status(200).json(updatedEntry!);
  } catch (err: any) {
    console.log(err);
    await db.disconnect();
    return res.status(400).json({ message: err.errors.status.message });
  }

  // entryToUpdate.description = description;
  // entryToUpdate.status = status;
  // entryToUpdate.save();
};

const deleteEntry = async (entryId: string, res: NextApiResponse<Data>) => {
  await db.connect();

  const entryToDelete = await Entry.findById(entryId);

  if (!entryToDelete) {
    await db.disconnect();
    return res.status(400).json({ message: "No entries with provided ID" });
  }

  try {
    const deletedEntry = await Entry.findByIdAndDelete(entryToDelete);
    await db.disconnect();
    return res.status(200).json(deletedEntry!);
  } catch (err: any) {
    console.log(err);
    await db.disconnect();
    return res.status(400).json({ message: err.errors.status.message });
  }
};

const getEntryById = async (entryId: string, res: NextApiResponse<Data>) => {
  if (!mongoose.isValidObjectId(entryId)) return res.status(400).json({ message: "ID not valid" });

  try {
    await db.connect();
    const entry = await Entry.findById(entryId);
    await db.disconnect();

    if (!entry) return res.status(400).json({ message: "Entry doesn't exists" });

    return res.status(200).json(entry);
  } catch (err: any) {
    console.log(err);
    await db.disconnect();
    return res.status(400).json({ message: err.errors.status.message });
  }
};
