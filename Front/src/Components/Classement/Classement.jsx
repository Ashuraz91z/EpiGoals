import React, { useEffect, useState } from "react";
import { IoHelp } from "react-icons/io5";
import Cookies from "js-cookie";

const Classement = () => {
  const [classement, setClassement] = useState([]);
  const [Help, setHelp] = useState(false); // Gestion de l'état pour l'affichage de l'aide

  useEffect(() => {
    const fetchClassement = async () => {
      const token = Cookies.get("token");

      try {
        const response = await fetch(
          "http://fr-game-02.myheberge.com:3000/user/classement/epi",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setClassement(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du classement:", error);
      }
    };

    fetchClassement();
  }, []);

  const getColorForEPI = (epi) => {
    // Définition des classes en fonction de l'EPI
    if (epi >= 3200) return "bg-yellow-500"; // Master
    else if (epi >= 2400 && epi < 3200) return "bg-green-500"; // Emerald
    else if (epi >= 2000 && epi < 2400) return "bg-teal-300"; // Platine
    else if (epi >= 1600 && epi < 2000) return "bg-amber-500"; // Gold
    else if (epi >= 1200 && epi < 1600) return "bg-gray-400"; // Silver
    else if (epi >= 800 && epi < 1200) return "bg-orange-800"; // Bronze
    else if (epi < 800) return "bg-red-900"; // Fer
    return "bg-gray-700";
  };

  return (
    <div className="flex flex-col items-center justify-center w-full my-6">
      <h1 className="text-lg text-center text-white mb-4">
        Classement des Joueurs par EPI
      </h1>
      {Help && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center text-center">
          <div className="bg-white p-4 rounded-md w-4/5 sm:w-2/5">
            <h2 className="text-lg font-bold py-4">
              Classements et Plages de Points
            </h2>
            <div className="flex flex-col gap-2 text-center text-white">
              <p>
                <span className={`inline-block px-2 ${getColorForEPI(3300)}`}>
                  Master: 3200+ EPI
                </span>
              </p>
              <p>
                <span className={`inline-block px-2 ${getColorForEPI(2500)}`}>
                  Emerald: 2400 - 3199 EPI
                </span>
              </p>
              <p>
                <span className={`inline-block px-2 ${getColorForEPI(2200)}`}>
                  Platine: 2000 - 2399 EPI
                </span>
              </p>
              <p>
                <span className={`inline-block px-2 ${getColorForEPI(1800)}`}>
                  Gold: 1600 - 1999 EPI
                </span>
              </p>
              <p>
                <span className={`inline-block px-2 ${getColorForEPI(1400)}`}>
                  Silver: 1200 - 1599 EPI
                </span>
              </p>
              <p>
                <span className={`inline-block px-2 ${getColorForEPI(1000)}`}>
                  Bronze: 800 - 1199 EPI
                </span>
              </p>
              <p>
                <span className={`inline-block px-2 ${getColorForEPI(200)}`}>
                  Fer: Moins de 800 EPI
                </span>
              </p>
            </div>
            <button
              onClick={() => setHelp(!Help)}
              className="bg-black text-white rounded-md p-2 mt-4"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setHelp(!Help)}
        className="fixed bottom-12 bg-black right-4 border-2 rounded-full sm:hidden"
      >
        <IoHelp size="30px" color="white" />
      </button>
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
