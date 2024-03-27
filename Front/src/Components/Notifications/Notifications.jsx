import React from "react";
import { CiCircleQuestion } from "react-icons/ci";

const Notifications = () => {
  return (
    <div className="flex justify-center py-2">
      <h1>Notifications</h1>
      <a href="/ajouter-match" className="fixed bottom-2 right-2">
        <CiCircleQuestion size="50px" color="white" />
      </a>
    </div>
  );
};

export default Notifications;
