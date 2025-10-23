import Pusher from "pusher";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PUSHER_KEY || !process.env.PUSHER_SECRET) throw new Error("PUSHER_KEY and PUSHER_SECRET must be set");

export const pusher = new Pusher({
  appId: "1964268",
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: "us2",
  useTLS: true,
});
