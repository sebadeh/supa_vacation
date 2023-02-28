import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Card from '@/components/Card';
import { ExclamationIcon } from '@heroicons/react/outline';

const Grid = ({ homes = [], areFavorites = false }) => {
  const [favorites, setFavorites] = useState(areFavorites ? homes : []);

  const isEmpty = homes.length === 0;

  const toggleFavorite = (id) => {
    if (-1 !== favorites.findIndex((home) => home.id === id)) {
      axios.delete(`/api/homes/${id}/favorite`).then(({ data }) => {});
    } else {
      axios.put(`/api/homes/${id}/favorite`).then(({ data }) => {
        setFavorites(data);
      });
    }
  };

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map((home) => (
        <Card
          key={home.id}
          {...home}
          onClickFavorite={toggleFavorite}
          favorite={
            favorites.findIndex(
              (favoriteHome) => favoriteHome.id === home.id
            ) !== -1
          }
        />
      ))}
    </div>
  );
};

export default Grid;
