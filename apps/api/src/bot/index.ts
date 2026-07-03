import { Bot, InlineKeyboard } from 'grammy';
import { telegramConfig } from '@invitely/config';
import { logger } from '@invitely/shared';
import { userService } from '../services/user.service';

let bot: Bot | null = null;

export function getBot(): Bot {
  if (!bot) {
    throw new Error('Bot not initialized. Call startBot() first.');
  }
  return bot;
}

export async function startBot() {
  if (!telegramConfig.botToken || telegramConfig.botToken === 'your_telegram_bot_token_here') {
    logger.warn('Telegram bot token not configured. Bot not started.');
    return;
  }

  bot = new Bot(telegramConfig.botToken);

  bot.catch((err) => {
    logger.error('Bot error caught', {
      error: err.error?.message || String(err),
    });
  });

  await bot.api.setMyCommands([
    { command: 'start', description: 'Dəvət kartı yarat' },
    { command: 'my', description: 'Dəvətlərim' },
    { command: 'help', description: 'Kömək' },
  ]);

  bot.command('start', async (ctx) => {
    try {
      const user = ctx.from;
      await userService.findOrCreate({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        language_code: user.language_code,
      });

      const miniAppUrl = `${telegramConfig.miniAppUrl}?start=${user.id}`;
      const isHttps = telegramConfig.miniAppUrl.startsWith('https://');

      await ctx.reply(
        '🎉 *Invitely* - Rəqəmsal dəvət kartları\n\n'
        + '30 saniyədən az müddətdə gözəl dəvət kartları yaradın.\n\n'
        + 'Aşağıdakı linkə toxunaraq başlayın:\n'
        + miniAppUrl,
        {
          parse_mode: 'Markdown',
          ...(isHttps ? { reply_markup: new InlineKeyboard().webApp('Dəvət kartı yarat', miniAppUrl) } : {}),
        },
      );
    } catch (err) {
      logger.error('Error in /start', { error: String(err) });
      try {
        await ctx.reply(
          '🎉 *Invitely* - Rəqəmsal dəvət kartları\n\n'
          + '30 saniyədən az müddətdə gözəl dəvət kartları yaradın.\n\n'
          + `Link: ${telegramConfig.miniAppUrl}`,
          { parse_mode: 'Markdown' },
        );
      } catch {}
    }
  });

  bot.command('my', async (ctx) => {
    try {
      const miniAppUrl = `${telegramConfig.miniAppUrl}/my-invitations`;
      const isHttps = telegramConfig.miniAppUrl.startsWith('https://');
      await ctx.reply(
        'Dəvətləriniz:',
        isHttps ? { reply_markup: new InlineKeyboard().webApp('Dəvətlərim', miniAppUrl) } : {},
      );
    } catch {
      await ctx.reply('Dəvətləriniz.');
    }
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      '❓ *Kömək*\n\n'
      + '• /start - Yeni dəvət kartı yaradın\n'
      + '• /my - Dəvətlərinizə baxın\n'
      + '• /help - Bu mesaj\n\n'
      + 'Hər hansı problem olarsa, bot vasitəsilə bildirin.',
      { parse_mode: 'Markdown' },
    );
  });

  bot.start({ onStart: () => logger.info('Telegram bot started') });
}
