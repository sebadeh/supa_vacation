import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Retrieve the authenticated user
  const { id: userId } = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const { id: homeId } = req.query;

  if (req.method === 'PUT') {
    try {
      const { favoriteHomes } = await prisma.user.update({
        where: { id: userId },
        include: { favoriteHomes: true },
        data: {
          favoriteHomes: {
            connect: {
              id: homeId,
            },
          },
        },
      });
      res.status(200).json(favoriteHomes);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Remove the user from the home's savedBy array
      await prisma.home.update({
        where: { id: homeId },
        data: {
          savedBy: {
            disconnect: { id: userId },
          },
        },
      });
      // Remove the home from the user's favoriteHomes array
      const { favoriteHomes } = await prisma.user.update({
        where: { id: userId },
        include: { favoriteHomes: true },
        data: {
          favoriteHomes: {
            disconnect: { id: homeId },
          },
        },
      });
      res.status(200).json(favoriteHomes);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
