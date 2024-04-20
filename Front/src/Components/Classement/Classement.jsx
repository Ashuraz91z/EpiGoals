import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Classement = () => {
  const [classement, setClassement] = useState([]);

  useEffect(() => {
    const fetchClassement = async () => {
      const token = Cookies.get("token");

      try {
        const response = await fetch(
          "http://localhost:3000/user/classement/epi",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setClassement(data); // Directement mis à jour sans tri
      } catch (error) {
        console.error("Erreur lors de la récupération du classement:", error);
      }
    };

    fetchClassement();
  }, []);

  // Définition des couleurs en fonction de l'EPI
  const getColorForEPI = (epi) => {
    if (epi >= 3200) return "bg-yellow-500"; // Master
    else if (epi >= 2000 && epi < 2400) return "bg-green-500"; // Emerald
    else if (epi >= 1600 && epi < 2000) return "bg-teal-300"; // Platine
    else if (epi >= 1200 && epi < 1600) return "bg-amber-500"; // Gold
    else if (epi >= 800 && epi < 1200) return "bg-gray-400"; // Silver
    else if (epi >= 400 && epi < 800) return "bg-orange-800"; // Bronze
    else if (epi >= -4000 && epi < 400) return "bg-red-900"; // Fer
    else return "bg-gray-700";
  };

  return (
    <div className="flex flex-col items-center justify-center w-full my-6">
      <h1 className="text-lg text-center text-white mb-4">
        Classement des Joueurs par EPI
      </h1>
      <div className="flex flex-col gap-2 w-full max-w-4xl justify-center items-center">
        {classement.map((user, index) => (
          <div
            key={index}
            className={`flex w-4/5 justify-between px-6 py-4 rounded-md shadow-lg ${getColorForEPI(
              user.EPI
            )}`}
          >
            <span className="text-white">{user.username}</span>
            <span className="text-white">{user.EPI}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classement;
