import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { VscAccount } from "react-icons/vsc";

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
        fetch(profileIconUrl)
          .then((res) => {
            if (res.ok) {
              setProfileIcon(profileIconUrl);
            } else {
              setProfileIcon("");
            }
          })
          .catch((err) => console.error(err));
        setIsLogged(true);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <div className="flex-col bg-gradient-to-r from-blue-700 to-purple-500 dark:bg-red-500">
      <div className="navbar">
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
                {profileIcon ? (
                  <img src={profileIcon} alt="Icône de profil" />
                ) : (
                  <VscAccount size="40" />
                )}
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
      {isLogged && (
        <div className="p-2">
          <ul className="flex gap-2 p-2  bg-white justify-center m-auto rounded-md h-12 items-center w-max">
            <li className="hover:drop-shadow hover:text-black w-24">
              <a
                className="flex items-center justify-center"
                href="/classement"
              >
                Classement
              </a>
            </li>
            <li className="w-24 hover:drop-shadow hover:text-black">
              <a href="/match" className="flex items-center justify-center">
                Match
              </a>
            </li>
            <li className="hover:text-black hover:drop-shadow w-24">
              <a
                href="/notifications"
                className="flex items-center justify-center"
              >
                Notifications
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
