import React, { useState } from "react";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la connexion. Veuillez vérifier vos identifiants."
        );
      }
      const data = await response.json();
      if (data) {
        Cookies.set("token", data.token, { expires: 2, path: "/" });
        window.location.href = "/";
      }
    } catch (error) {
      setMessage(error.message);
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-700 to-purple-500">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 shadow-lg rounded-lg overflow-hidden backdrop-blur-md p-8"
      >
        {message && <p className="text-red-600 text-center py-3">{message}</p>}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-sm">
            Mot de passe oublié ? cliquez{" "}
            <a className="underline decoration-solid" href="/forgot-password">
              ici
            </a>
          </p>
        </div>
        <div className="flex-col flex">
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Se connecter
          </button>
          <p className="text-sm mb-1">
            Pas de compte ?{" "}
            <a className="underline decoration-solid" href="/register">
              S'inscrire
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
