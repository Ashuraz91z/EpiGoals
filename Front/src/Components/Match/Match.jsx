import React from "react";
import { IoIosAdd } from "react-icons/io";

function Match_historique(props) {
  return (
    <div className="flex gap-2 justify-center flex-row h-20 w-4/5 rounded-md bg-red-500 items-center max-w-3xl">
      <div className="w-2/5 flex justify-center">Equipe 1</div>
      <div className="w-1/5 flex justify-center text-4xl">-</div>
      <div className="w-2/5 flex justify-center">Equipe 2</div>
    </div>
  );
}

const Match = () => {
  return (
    <div className="flex-col my-2 w-full items-center justify-center">
      <h1 className="flex justify-center">Match</h1>
      <div className="flex justify-end px-2">
        <a
          href="/ajouter-match"
          className="fixed bottom-12 right-4 border-2 rounded-xl sm:hidden"
        >
          <IoIosAdd size="40px" />
        </a>
      </div>
      <div className="flex flex-col gap-4 mt-6 w-full justify-center items-center">
        <Match_historique matchName="Match 1" />
        <Match_historique matchName="Match 2" />
        <Match_historique matchName="Match 3" />
        <Match_historique matchName="Match 3" />
        <Match_historique matchName="Match 3" />
        <Match_historique matchName="Match 3" />
        <Match_historique matchName="Match 3" />
        <Match_historique matchName="Match 3" />
        <Match_historique matchName="Match 3" />
      </div>
    </div>
  );
};

export default Match;
