import { prisma } from './prisma';
import type { CreateUserInput, UpdateUserInput } from '@invitely/validators';
import type { User } from '@invitely/types';

export const userService = {
  async findByTelegramId(telegramId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { telegramId } });
    return user as unknown as User | null;
  },

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user as unknown as User | null;
  },

  async create(input: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        telegramId: input.telegramId,
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
        language: input.language ?? 'az',
      },
    });
    await prisma.userSettings.create({ data: { userId: user.id } });
    return user as unknown as User;
  },

  async findOrCreate(telegramUser: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  }): Promise<User> {
    const existing = await this.findByTelegramId(String(telegramUser.id));
    if (existing) return existing;
    return this.create({
      telegramId: String(telegramUser.id),
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name ?? null,
      username: telegramUser.username ?? null,
      language: (telegramUser.language_code === 'en' ? 'en' : 'az') as CreateUserInput['language'],
    });
  },

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await prisma.user.update({ where: { id }, data: input });
    return user as unknown as User;
  },
};
