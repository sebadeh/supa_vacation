import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  // Get the user favorites
  if (req.method === 'GET') {
    try {
      // Get all homes from the authenticated user
      const homes = await prisma.user.findMany({
        where: { email: session.user.email },
        include: { favoriteHomes: true },
      });
      res.status(200).json(homes);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['GET']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
