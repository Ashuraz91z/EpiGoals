import React, { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

function Match_historique(props) {
  const [joueursEquipe1, setJoueursEquipe1] = useState([]);
  const [joueursEquipe2, setJoueursEquipe2] = useState([]);

  useEffect(() => {
    async function fetchJoueurs() {
      try {
        const token = Cookies.get("token");

        if (!token) {
          window.location.href("/login");
          return;
        }

        // Recup User ID pour username Team 1
        const equipe1Promises = props.equipe1.map(async (joueurId) => {
          const response = await fetch(
            `http://localhost:3000/user/username/${joueurId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          return data.username;
        });

        // recup user ID pour username Team 2
        const equipe2Promises = props.equipe2.map(async (joueurId) => {
          const response = await fetch(
            `http://localhost:3000/user/username/${joueurId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          return data.username;
        });

        const joueursEquipe1 = await Promise.all(equipe1Promises);
        const joueursEquipe2 = await Promise.all(equipe2Promises);

        setJoueursEquipe1(joueursEquipe1);
        setJoueursEquipe2(joueursEquipe2);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des noms d'utilisateur:",
          error
        );
      }
    }

    fetchJoueurs();
  }, [props.equipe1, props.equipe2]);

  const decoded = jwtDecode(Cookies.get("token"));

  const utilisateurDansEquipe1 = props.equipe1.includes(decoded._id);
  const utilisateurDansEquipe2 = props.equipe2.includes(decoded._id);

  let equipeUtilisateurGagnante = true;
  if (utilisateurDansEquipe1) {
    equipeUtilisateurGagnante = props.scoreEquipe1 > props.scoreEquipe2;
  } else if (utilisateurDansEquipe2) {
    equipeUtilisateurGagnante = props.scoreEquipe2 > props.scoreEquipe1;
  }

  const couleurTeam = props.estConfirmé
    ? equipeUtilisateurGagnante
      ? "bg-blue-500"
      : "bg-red-500"
    : "hidden";
  return (
    <div
      className={`flex gap-2 justify-center flex-row h-20 w-4/5 rounded-md ${couleurTeam} items-center max-w-3xl`}
    >
      <div className="w-2/5 flex flex-col justify-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          {joueursEquipe1.map((joueur, index) => (
            <span key={index}>{joueur}</span>
          ))}
        </div>
      </div>
      <div className="w-1/5 flex flex-row justify-between text-xl">
        <div className="flex justify-center">{props.scoreEquipe1}</div>
        <div className="flex justify-center">-</div>
        <div className="flex justify-center">{props.scoreEquipe2}</div>
      </div>
      <div className="w-2/5 flex flex-col justify-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          {joueursEquipe2.map((joueur, index) => (
            <span key={index}>{joueur}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const Match = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");

    // Récupération des données des matchs depuis l'API
    fetch("http://localhost:3000/match/historique", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMatches(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des matchs:", error)
      );
  }, []);

  return (
    <div className="flex-col my-2 w-full items-center justify-center text-white">
      <h1 className="flex justify-center">Match</h1>
      <div className="flex justify-end px-2">
        <a
          href="/ajouter-match"
          className="fixed bottom-12 bg-black right-4 border-2 rounded-xl sm:hidden"
        >
          <IoIosAdd size="40px" color="white" />
        </a>
      </div>
      <div className="flex flex-col gap-4 mt-6 w-full justify-center items-center">
        {matches.length === 0 && (
          <span className="loading loading-infinity loading-lg"></span>
        )}
        {matches.map((match, index) => (
          <Match_historique
            key={index}
            equipe1={match.equipe1}
            equipe2={match.equipe2}
            scoreEquipe1={match.scoreEquipe1}
            scoreEquipe2={match.scoreEquipe2}
            estConfirmé={match.estConfirmé}
          />
        ))}
      </div>
    </div>
  );
};

export default Match;
