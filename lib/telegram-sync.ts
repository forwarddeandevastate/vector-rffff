// lib/telegram-sync.ts
import { prisma } from "@/lib/prisma";
import { deleteTelegramMessage, editTelegramMessage } from "@/lib/telegram";

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
      await deleteTelegramMessage(m.chatId, m.messageId);
    } catch {
      // уже удалено/нет прав/слишком старое — игнор
    }
  }

  await prisma.telegramMessage.deleteMany({ where: { kind: "order", orderId } });
}

export async function editOrderMessagesEverywhere(
  orderId: string,
  text: string,
  replyMarkup?: TgInlineKeyboardMarkup
) {
  const msgs = await prisma.telegramMessage.findMany({
    where: { kind: "order", orderId },
    select: { chatId: true, messageId: true },
  });

  for (const m of msgs) {
    try {
      await editTelegramMessage(m.chatId, m.messageId, text, replyMarkup);
    } catch {
      // сообщение могло исчезнуть — игнор
    }
  }
}

export async function editAnnouncementEverywhere(
  annId: string,
  text: string,
  replyMarkup?: TgInlineKeyboardMarkup
) {
  const msgs = await prisma.telegramMessage.findMany({
    where: { kind: "announcement", annId },
    select: { chatId: true, messageId: true },
  });

  for (const m of msgs) {
    try {
      await editTelegramMessage(m.chatId, m.messageId, text, replyMarkup);
    } catch {
      // игнор
    }
  }
}