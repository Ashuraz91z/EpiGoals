import React, { useState, useEffect } from "react";
import { IoHelp } from "react-icons/io5";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Assurez-vous d'avoir installé jwt-decode

const Notifications = () => {
  const [matchsNonAcceptes, setMatchsNonAcceptes] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [Help, setHelp] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded._id);
      } catch (error) {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }

    // Fonction pour récupérer les matchs non acceptés
    const recupererMatchsNonAcceptes = async () => {
      setIsLoading(true);
      if (!token) {
        console.error("Token non trouvé, utilisateur non authentifié");
        setIsLoading(false);
        return;
      }
      try {
        const reponse = await fetch(
          "http://fr-game-02.myheberge.com:3000/user/notif",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (reponse.ok) {
          const matchs = await reponse.json();
          setMatchsNonAcceptes(matchs.filter((match) => !match.estConfirmé));
        } else {
          throw new Error("Erreur lors de la récupération des matchs");
        }
      } catch (erreur) {
        console.error("Erreur lors de la récupération des matchs:", erreur);
      }
      setIsLoading(false);
    };

    recupererMatchsNonAcceptes();
  }, []);

  const accepterMatch = async (idMatch) => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token non trouvé, utilisateur non authentifié");
      return;
    }
    try {
      const reponse = await fetch(
        `fr-game-02.myheberge.com:3000/match/confirm/${idMatch}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (reponse.ok) {
        window.location.reload();
      } else {
        throw new Error("Erreur lors de l'acceptation du match");
      }
    } catch (erreur) {
      console.error("Erreur lors de l'acceptation du match:", erreur);
    }
  };

  return (
    <div className="flex-col my-2 w-full items-center justify-center text-center">
      <h1>Notifications</h1>
      {Help ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md w-4/5 sm:w-2/5">
            <h2 className="text-lg font-bold">Aide</h2>
            <p>
              Cette page vous permet de voir les matchs auxquels vous avez jouer
              et que vous n'avez pas encore acceptés. Il faut que le match soit
              accepté par 3 des 4 joueurs pour qu'il soit validé. Si le match
              est validé, vous ne pouvez plus le refuser. Si le match ne
              contient pas le bon score ou les bonnes équipes, vous pouvez le
              refuser en ne cliquant pas sur le bouton "Accepter".
            </p>
            <button
              onClick={() => setHelp(!Help)}
              className="bg-black text-white rounded-md p-2 mt-4"
            >
              Fermer
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex justify-end px-2">
        <button
          onClick={() => setHelp(!Help)}
          className="fixed bottom-12 bg-black right-4 border-2 rounded-full sm:hidden"
        >
          <IoHelp size="30px" color="white" />
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-6 w-full justify-center items-center">
        {isLoading ? (
          <span className="loading loading-infinity loading-lg"></span>
        ) : matchsNonAcceptes.length > 0 ? (
          matchsNonAcceptes.map((match) => (
            <div
              key={match._id}
              className={`flex gap-2 justify-center flex-col h-28 w-4/5 rounded-md items-center max-w-3xl text-white ${
                match.scoreEquipe1 > match.scoreEquipe2
                  ? match.equipe1.some((joueur) => joueur._id === userId)
                    ? "bg-blue-500"
                    : "bg-red-500"
                  : match.scoreEquipe2 > match.scoreEquipe1
                  ? match.equipe2.some((joueur) => joueur._id === userId)
                    ? "bg-blue-500"
                    : "bg-red-500"
                  : "bg-gray-500"
              }`}
            >
              <div className="flex flex-row w-full justify-center items-center">
                <div className="w-2/5 flex flex-col justify-center">
                  <div className="flex flex-col gap-2 justify-center items-center">
                    {match.equipe1.map((joueur, index) => (
                      <span key={index}>{joueur.username}</span>
                    ))}
                  </div>
                </div>
                <div className="w-1/5 flex flex-row justify-between text-xl">
                  <div className="flex justify-center">
                    {match.scoreEquipe1}
                  </div>
                  <div className="flex justify-center">-</div>
                  <div className="flex justify-center">
                    {match.scoreEquipe2}
                  </div>
                </div>
                <div className="w-2/5 flex flex-col justify-center">
                  <div className="flex flex-col gap-2 justify-center items-center">
                    {match.equipe2.map((joueur, index) => (
                      <span key={index}>{joueur.username}</span>
                    ))}
                  </div>
                </div>
              </div>
              {match.confirmations.includes(userId) ? (
                <p className="text-sm">
                  En attente de validation des autres joueurs
                </p>
              ) : (
                <button
                  onClick={() => accepterMatch(match._id)}
                  className="mt-2 border text-white font-bold py-1 px-4 rounded"
                >
                  Accepter
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="my-2 p-2 rounded">
            <p className="text-center">
              Aucun Match a enregistrer pour le moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
