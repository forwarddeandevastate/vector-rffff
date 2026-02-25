// lib/telegram-sync.ts
import { prisma } from "@/lib/prisma";
import { tgDeleteMessage, tgEditMessageText } from "@/lib/telegram";

export type TgInlineKeyboardMarkup = {
  inline_keyboard: Array<Array<{ text: string; callback_data?: string; url?: string }>>;
};

export async function deleteOrderMessagesEverywhere(orderId: string) {
  const msgs = await prisma.telegramMessage.findMany({
    where: { kind: "order", orderId },
    select: { chatId: true, messageId: true },
  });

  for (const m of msgs) {
    try {
      await tgDeleteMessage(m.chatId, m.messageId);
    } catch {
      // уже удалено/нет прав/истекло — игнор
    }
  }

  await prisma.telegramMessage.deleteMany({ where: { kind: "order", orderId } });
}

export async function editOrderMessagesEverywhere(orderId: string, text: string, replyMarkup?: TgInlineKeyboardMarkup) {
  const msgs = await prisma.telegramMessage.findMany({
    where: { kind: "order", orderId },
    select: { chatId: true, messageId: true },
  });

  for (const m of msgs) {
    try {
      await tgEditMessageText(m.chatId, m.messageId, text, replyMarkup);
    } catch {
      // сообщение могло пропасть — игнор
    }
  }
}

export async function editAnnouncementEverywhere(annId: string, text: string, replyMarkup?: TgInlineKeyboardMarkup) {
  const msgs = await prisma.telegramMessage.findMany({
    where: { kind: "announcement", annId },
    select: { chatId: true, messageId: true },
  });

  for (const m of msgs) {
    try {
      await tgEditMessageText(m.chatId, m.messageId, text, replyMarkup);
    } catch {
      // игнор
    }
  }
}