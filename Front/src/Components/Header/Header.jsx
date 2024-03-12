import React from "react";

const Header = () => {
  return (
    <nav className="flex">
      <ul className="flex w-full justify-between gap-8 bg-red-200">
        <div className="flex align-center">
          <li className="m-auto p-2">
            <a href="/">Accueil</a>
          </li>
        </div>
        <div className="flex gap-8 my-auto p-4">
          <li>
            <a href="/login">Se connecter</a>
          </li>
          <li>
            <a href="/register">S'inscrire</a>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Header;
