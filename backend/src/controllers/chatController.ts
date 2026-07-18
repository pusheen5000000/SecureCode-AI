import type { Request, Response } from "express";
import { chatWithAI } from "../services/openaiService";
import type { ChatRequestBody } from "../types";

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 4_000;

export async function chatController(req: Request, res: Response) {
  const { messages, scanContext } = req.body as ChatRequestBody;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages is required" });
  }

  const validMessages = messages.slice(-MAX_MESSAGES).every(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0 &&
      message.content.length <= MAX_MESSAGE_LENGTH
  );

  if (!validMessages) {
    return res.status(400).json({ error: "messages must contain valid chat messages" });
  }

  try {
    const message = await chatWithAI(messages.slice(-MAX_MESSAGES), scanContext);
    return res.status(200).json({ message });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(502).json({ error: "AI chat failed" });
  }
}
