import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Profil = () => {
  const [profileIcon, setProfileIcon] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false); // État pour afficher/cacher la popup de l'icône de profil
  const [showPasswordPopup, setShowPasswordPopup] = useState(false); // Nouvel état pour la popup de modification du mot de passe

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
        setEmail(decodedToken.email);
        const Expire = decodedToken.exp;
        if (Date.now() >= Expire * 1000) {
          Cookies.remove("token");
          window.location.href = "/login";
          setIsLogged(false);
          return;
        }
        const userId = decodedToken._id;
        const profileIconUrl = `http://fr-game-02.myheberge.com:3000/uploads/${userId}.png`;
        fetch(profileIconUrl).then((res) => {
          if (res.ok) {
            setProfileIcon(profileIconUrl);
          } else {
            setProfileIcon("");
          }
        });
        setIsLogged(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setIsLogged(false);
      window.location.href = "/login";
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("Aucun fichier sélectionné.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);
    const token = Cookies.get("token");
    if (!token) {
      console.log("Aucun token trouvé, veuillez vous connecter.");
      return;
    }

    fetch("fr-game-02.myheberge.com:3000/user/profile-picture", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then((data) => {
        console.log("Success:", data);
        window.location.reload();
        setShowPopup(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="text-center">
      <h1 className="py-2">Profil</h1>
      <h2 className="py-4 text-2xl font-bold">{username}</h2>
      <div className="flex flex-col gap-4">
        <img
          src={profileIcon || "default-profile-icon.png"}
          alt="Profil"
          className="rounded-full w-24 h-24 flex m-auto border-2"
        />
        <button
          className="btn btn-outline btn-primary w-fit m-auto"
          onClick={() => setShowPopup(!showPopup)}
        >
          Modifier
        </button>
        {showPopup && (
          <div className="popup">
            <input type="file" onChange={handleFileChange} accept=".png" />
          </div>
        )}
      </div>
      <div className="py-4 flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold">Email :</h3>
          <p>{email}</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <h3 className="text-lg font-bold">Mot de passe :</h3>
          <span>********</span>
          <button
            className="border-2 w-fit p-2 rounded-md"
            onClick={() => setShowPasswordPopup(!showPasswordPopup)}
          >
            Modifier
          </button>

          {showPasswordPopup && (
            <div className="flex flex-col gap-2">
              {}
              <input
                type="password"
                placeholder="Mot de passe Actuel"
                className="border-2  w-fit p-2 rounded-md"
                onChange={(e) => setoldPassword(e.target.value)}
              />
              <input
                type="password"
                className="border-2  w-fit p-2 rounded-md"
                placeholder="Nouveau mot de passe"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button className="border-2 p-2 rounded-xl">Confirmer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profil;
