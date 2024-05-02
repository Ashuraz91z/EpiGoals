import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const AddMatch = () => {
  const [usernames, setUsernames] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState({
    equipe1: ["", ""], // Initialisé avec des chaînes vides pour indiquer qu'aucun joueur n'est sélectionné
    equipe2: ["", ""],
  });
  const [scoreEquipe1, setScoreEquipe1] = useState(0);
  const [scoreEquipe2, setScoreEquipe2] = useState(0);
  const [borderEquipe1, setBorderEquipe1] = useState("border-white");
  const [borderEquipe2, setBorderEquipe2] = useState("border-white");

  const saveMatch = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token non trouvé, utilisateur non authentifié");
      return;
    }

    try {
      const response = await fetch(
        "fr-game-02.myheberge.com:3000/match/pre-record-match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            equipe1: selectedPlayers.equipe1,
            equipe2: selectedPlayers.equipe2,
            scoreEquipe1: scoreEquipe1,
            scoreEquipe2: scoreEquipe2,
          }),
        }
      );

      if (response.ok) {
        setSelectedPlayers({
          equipe1: ["", ""],
          equipe2: ["", ""],
        });
        setScoreEquipe1(0);
        setScoreEquipe2(0);
        setBorderEquipe1("border-white");
        setBorderEquipe2("border-white");
        console.log("Match enregistré avec succès !");
      } else {
        // Gérer les erreurs de la réponse, par exemple afficher un message d'erreur
        const errorData = await response.json();
        console.error("Erreur lors de l'enregistrement du match :", errorData);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête :", error);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUsernames = async () => {
      try {
        const response = await fetch(
          "fr-game-02.myheberge.com:3000/user/username",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsernames(data);
        } else {
          throw new Error(
            "Erreur lors de la récupération des noms d'utilisateur"
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des noms d'utilisateur :",
          error
        );
      }
    };

    fetchUsernames();
  }, []);

  useEffect(() => {
    if (scoreEquipe1 > scoreEquipe2) {
      setBorderEquipe1("border-green-500");
      setBorderEquipe2("border-red-500");
    } else if (scoreEquipe1 < scoreEquipe2) {
      setBorderEquipe1("border-red-500");
      setBorderEquipe2("border-green-500");
    } else {
      setBorderEquipe1("border-white");
      setBorderEquipe2("border-white");
    }
  }, [scoreEquipe1, scoreEquipe2]);

  const handleChangePlayerSelection = (equipe, joueurIndex, event) => {
    const nouveauJoueur = event.target.value;
    setSelectedPlayers((prevState) => ({
      ...prevState,
      [equipe]: prevState[equipe].map((joueur, index) =>
        index === joueurIndex ? nouveauJoueur : joueur
      ),
    }));
  };

  const handleChangeScore = (setScoreFunction, event) => {
    setScoreFunction(Number(event.target.value));
  };

  const getAvailablePlayers = (equipe, joueurIndex) => {
    const allSelectedPlayers = [
      ...selectedPlayers.equipe1,
      ...selectedPlayers.equipe2,
    ];
    // Retirer le joueur actuel de la liste des joueurs déjà sélectionnés pour qu'il soit disponible pour être re-sélectionné si nécessaire
    allSelectedPlayers.splice(
      allSelectedPlayers.indexOf(selectedPlayers[equipe][joueurIndex]),
      1
    );
    return usernames.filter(
      (username) => !allSelectedPlayers.includes(username)
    );
  };

  return (
    <div className="py-2 flex flex-col items-center justify-center">
      <h1>Ajouter un match</h1>
      <div
        className={`my-4 py-2 flex flex-col items-center border-2 rounded-xl w-5/6 ${borderEquipe1}`}
      >
        <h2>Équipe 1</h2>
        <div className="flex flex-col items-center">
          {selectedPlayers.equipe1.map((player, index) => (
            <div key={`equipe1-joueur${index}`} className="py-2 flex">
              <label>{`Joueur ${index + 1} :`}</label>
              <select
                className="mx-2"
                value={player}
                onChange={(event) =>
                  handleChangePlayerSelection("equipe1", index, event)
                }
              >
                <option value="">Sélectionner un joueur</option>
                {getAvailablePlayers("equipe1", index).map(
                  (username, uIndex) => (
                    <option key={uIndex} value={username}>
                      {username}
                    </option>
                  )
                )}
              </select>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <label>Score Équipe</label>
            <input
              className="border-2 rounded-md flex p-auto text-center my-2"
              type="number"
              min="-10"
              max="10"
              value={scoreEquipe1}
              onChange={(event) => handleChangeScore(setScoreEquipe1, event)}
            />
          </div>
        </div>
      </div>
      <h3>VS</h3>
      <div
        className={`my-4 py-2 flex flex-col items-center border-2 rounded-xl w-5/6 ${borderEquipe2}`}
      >
        <h2>Équipe 2</h2>
        <div className="flex flex-col items-center">
          {selectedPlayers.equipe2.map((player, index) => (
            <div key={`equipe2-joueur${index}`} className="py-2 flex">
              <label>{`Joueur ${index + 1} :`}</label>
              <select
                className="mx-2"
                value={player}
                onChange={(event) =>
                  handleChangePlayerSelection("equipe2", index, event)
                }
              >
                <option value="">Sélectionner un joueur</option>
                {getAvailablePlayers("equipe2", index).map(
                  (username, uIndex) => (
                    <option key={uIndex} value={username}>
                      {username}
                    </option>
                  )
                )}
              </select>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <label>Score Équipe</label>
            <input
              className="border-2 rounded-md flex p-auto text-center my-2"
              type="number"
              min="-10"
              max="10"
              value={scoreEquipe2}
              onChange={(event) => handleChangeScore(setScoreEquipe2, event)}
            />
          </div>
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={saveMatch}
      >
        Enregistrer le match
      </button>
    </div>
  );
};

export default AddMatch;
