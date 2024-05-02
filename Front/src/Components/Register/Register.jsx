import React, { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    const newChecked = event.target.checked;
    setIsChecked(newChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const check = isChecked;
    try {
      const response = await fetch(
        "http://fr-game-02.myheberge.com:3000/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            username,
            confirm,
            check,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Lire le corps de la réponse comme texte brut
        throw new Error(
          errorText || "Erreur lors de l'enregistrement. Veuillez réessayer."
        );
      }
      setMessage("Inscription réussie, vous pouvez vous connecter.");
      setMessageType("success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
      console.error(error);
    }
  };
  const messageClass = `text-center py-3 ${
    messageType === "error" ? "text-red-600" : "text-green-600"
  }`;

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 shadow-lg rounded-lg overflow-hidden backdrop-blur-md p-8"
      >
        {message && <p className={messageClass}>{message}</p>}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            required
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirm-password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Confirmez mot de passe
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirm}
            required
            onChange={(e) => setConfirm(e.target.value)}
            className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="form-control mb-2">
          <label className=" cursor-pointer flex gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="checkbox checkbox-primary"
            />
            <span>J'accepte les conditions d'utilisation</span>
          </label>
        </div>
        <div className="flex-col flex">
          <button
            type="submit"
            className="bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            S'inscrire
          </button>
          <p className="text-sm mb-1">
            Déja un compte ?{" "}
            <a className="underline decoration-solid" href="/login">
              Se connecter
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
