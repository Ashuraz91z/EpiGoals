import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [send, setSend] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const emailValue = e.target.email.value;
    setEmail(emailValue);

    fetch("http://fr-game-02.myheberge.com:3000/user/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailValue }),
    })
      .then((res) => res.json())
      .then(() => {
        window.location.href = "/login";
        setSend(true);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setSend(false);
        setError(true);
      });
  }

  return (
    <div className=" flex flex-col items-center justify-center">
      <h2 className="text-center">Mot de passe oublié</h2>
      <form
        onSubmit={handleSubmit}
        className="flex  flex-col justify-center items-center w-3/4 py-4 gap-4"
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="email"
          required
        />
        <button type="submit" className="border-2 rounded-xl p-2">
          Envoyer
        </button>
      </form>
      {send && <p>Un email vous a été envoyé sur votre adresse</p>}
      {error && (
        <p className="text-center">
          L'email n'est pas enregistré. Reesayer avec une autre adresse email.
          Si le problème persiste, contactez l'administrateur.
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
