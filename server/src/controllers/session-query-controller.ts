import { Request, Response } from "express";
import { Run } from "../models/run";
import { dbConnect } from "../lib/mongodb";
import { cypressService } from "../services/cypress-service";

export const getAllSessions = async (req: Request, res: Response) => {
  try {
    await dbConnect();

    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    let result: any;

    if (!isNaN(page) && !isNaN(limit)) {
      const { sessions, total } = await cypressService.getAllSessions(page, limit);
      const totalPages = Math.ceil(total / limit);

      result = {
        sessions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } else {
      const { sessions } = await cypressService.getAllSessions();
      result = { sessions };
    }

    return res.status(200).json(result);
  } catch (error) {
    throw new Error(`Failed at getAllSessions: ${(error as Error).message}`);
  }
};

export const getFlaggedSessions = async (req: Request, res: Response) => {
  try {
    await dbConnect();

    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    let result: any;

    let query = Run.find({ isFlagged: true }).sort({ createdAt: -1 });

    if (!isNaN(page) && !isNaN(limit)) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
      const total = await Run.countDocuments({ isFlagged: true });
      const totalPages = Math.ceil(total / limit);

      const sessions = await query.exec();

      result = {
        sessions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } else {
      const sessions = await query.exec();
      result = {
        sessions,
        pagination: {
          total: sessions.length,
          totalPages: 1,
        },
      };
    }

    return res.status(200).json(result);
  } catch (error) {
    throw new Error(`Failed at getFlaggedSessions: ${(error as Error).message}`);
  }
};

export const getSpecs = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  try {
    await dbConnect();

    const currentSession = await Run.findOne({ sessionId: sessionId });
    if (!currentSession) return res.status(404).json({ message: "Session not found" });

    return res.status(200).json({ session: currentSession });
  } catch (error) {
    throw new Error(`Failed at getSpecs: ${(error as Error).message}`);
  }
};

export const getTestResultsTimeline = async (req: Request, res: Response) => {
  try {
    await dbConnect();

    const allSessions = await Run.find({});

    return res.status(200).json({ allSessions });
  } catch (error) {
    throw new Error(`Failed at getTestResultsTimeline: ${(error as Error).message}`);
  }
};
