import React from "react";

const Header = () => {
  return (
    <nav className="flex bg-red-200">
      <ul className="flex bg-blue-500 w-full justify-center gap-8">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/Sinscrire">Inscription</a>
        </li>
        <li>
          <a href="/Login">Login</a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
