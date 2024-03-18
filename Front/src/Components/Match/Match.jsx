import React from "react";

const Match = () => {
  return (
    <div className="flex justify-center my-2 w-full">
      <div>
        <h1 className="flex justify-center">Match</h1>
        <input
          type="button"
          value="Ajouter un match"
          className="btn sm:hidden my-2"
          onClick={() => {
            window.location.href = "/ajouter-match";
          }}
        />
      </div>
    </div>
  );
};

export default Match;
