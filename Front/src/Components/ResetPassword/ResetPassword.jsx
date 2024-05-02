import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const url = "http://fr-game-02.myheberge.com:3000/user/reset-password";
    const payload = {
      token,
      newPassword: password,
      confirmPassword: confirmPassword,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.href = "/login";
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(
        "Une erreur est survenue lors de la réinitialisation du mot de passe: " +
          error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h2>Réinitialiser votre mot de passe</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-3/4 justify-center items-center gap-4 px-4"
      >
        <label>Nouveau mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Confirmer le mot de passe</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="border-2 p-2 rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
