import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const Header = () => {
  const [profileIcon, setProfileIcon] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;
        const profileIconUrl = `http://localhost:3000/uploads/${userId}.png`;
        setProfileIcon(profileIconUrl);
        setIsLogged(true);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <div className="flex-col">
      <div className="navbar bg-blue-700">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/">
            EpiGoals
          </a>
        </div>
        <div className="flex-none gap-8">
          {isLogged && (
            <div className="form-control hidden sm:flex">
              <input
                type="button"
                value="Ajouter un match"
                className="input input-bordered w-30 md:w-auto md:p-2"
                onClick={() => {
                  window.location.href = "/add-match";
                }}
              />
            </div>
          )}
          {isLogged ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="Icône de profil" src={profileIcon} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="justify-between" href="/profil">
                    Profil
                  </a>
                </li>
                <li>
                  <a href="/settings">Réglages</a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      Cookies.remove("token");
                      setIsLogged(false);
                      setProfileIcon("");
                    }}
                  >
                    Se déconnecter
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="button"
                value="Login"
                className="btn"
                onClick={() => {
                  window.location.href = "/login";
                }}
              />
              <input
                type="button"
                value="Register"
                className="btn"
                onClick={() => {
                  window.location.href = "/register";
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="p-2">
        <ul className="flex gap-6 p-2 bg-white justify-center m-auto rounded-md h-12 items-center w-max">
          <li>
            <a href="/match" className="hover:drop-shadow hover:text-black">
              Match
            </a>
          </li>
          <li className="hover:drop-shadow hover:text-black ">
            <a href="/notifications">Notifications</a>
          </li>
          <li>
            <a href="/test" className="hover:text-black hover:drop-shadow">
              Carrière
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
