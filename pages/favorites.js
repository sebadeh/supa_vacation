import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { prisma } from '@/lib/prisma';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  // Get all favorite homes from the authenticated user
  const { favoriteHomes } = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { favoriteHomes: true },
  });

  return {
    props: {
      homes: JSON.parse(JSON.stringify(favoriteHomes)),
    },
  };
}

const Favorites = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your favorites</h1>
      <p className="text-gray-500">Manage your favorite homes</p>
      <div className="mt-8">
        <Grid homes={homes} areFavorites />
      </div>
    </Layout>
  );
};

export default Favorites;
