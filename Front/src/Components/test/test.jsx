import React, { useState } from "react";

function Test() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    const newChecked = event.target.checked;
    setIsChecked(newChecked); // Met à jour l'état avec la nouvelle valeur

    // Logique conditionnelle basée sur la nouvelle valeur
    if (newChecked) {
      console.log("La checkbox est cochée :", newChecked);
    } else {
      console.log("La checkbox n'est pas cochée : ", newChecked);
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        Cochez-moi
      </label>
      {isChecked ? (
        <p>La checkbox est cochée!</p>
      ) : (
        <p>La checkbox n'est pas cochée.</p>
      )}
    </div>
  );
}

export default Test;
