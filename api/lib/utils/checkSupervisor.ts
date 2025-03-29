import prisma from '@/prisma/prisma-client';

export default async function checkSupervisor(userId: string, targetUserId: string): Promise<boolean> {
  const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { manager: true }
  });

  if (!targetUser?.manager) return false;
  if (targetUser.manager.id === userId) return true;
  return checkSupervisor(userId, targetUser.manager.id);
}