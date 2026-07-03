import { Bot, InlineKeyboard } from 'grammy';
import { prisma } from './prisma';
import { logger } from '@invitely/shared';
import { telegramConfig } from '@invitely/config';

interface BroadcastInput {
  text: string;
  buttonText?: string;
  buttonUrl?: string;
  miniAppPath?: string;
}

const BATCH_SIZE = 30;
const BATCH_DELAY_MS = 1000;

export const broadcastService = {
  async create(input: BroadcastInput, adminUserId: string) {
    const message = await prisma.broadcastMessage.create({
      data: {
        text: input.text,
        buttonText: input.buttonText,
        buttonUrl: input.buttonUrl,
        miniAppPath: input.miniAppPath,
        createdById: adminUserId,
        status: 'PENDING',
      },
    });
    return message;
  },

  async getMessages(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.broadcastMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.broadcastMessage.count(),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getMessage(id: string) {
    return prisma.broadcastMessage.findUnique({ where: { id } });
  },

  async execute(id: string, bot: Bot) {
    const message = await prisma.broadcastMessage.findUnique({ where: { id } });
    if (!message || message.status !== 'PENDING') {
      throw new Error('Message not found or already processed');
    }

    await prisma.broadcastMessage.update({
      where: { id },
      data: { status: 'SENDING' },
    });

    const users = await prisma.user.findMany({
      where: { telegramId: { not: '' } },
      select: { telegramId: true },
    });

    const totalCount = users.length;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map(async (user) => {
          try {
            const keyboard = new InlineKeyboard();
            if (message.miniAppPath) {
              keyboard.webApp(
                message.buttonText || 'Dəvət kartı yarat',
                `${telegramConfig.miniAppUrl}${message.miniAppPath}`,
              );
            } else if (message.buttonUrl) {
              keyboard.url(message.buttonText || 'Link', message.buttonUrl);
            }

            await bot.api.sendMessage(Number(user.telegramId), message.text, {
              parse_mode: 'Markdown',
              ...(keyboard.rows.length > 0 ? { reply_markup: keyboard } : {}),
            });
            return 'sent';
          } catch {
            return 'failed';
          }
        }),
      );

      for (const r of results) {
        if (r.status === 'fulfilled' && r.value === 'sent') sentCount++;
        else failedCount++;
      }

      await prisma.broadcastMessage.update({
        where: { id },
        data: { sentCount, failedCount },
      });

      if (i + BATCH_SIZE < users.length) {
        await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
      }
    }

    await prisma.broadcastMessage.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        totalCount,
        sentCount,
        failedCount,
        completedAt: new Date(),
      },
    });

    logger.info('Broadcast completed', { id, totalCount, sentCount, failedCount });
    return { totalCount, sentCount, failedCount };
  },
};
