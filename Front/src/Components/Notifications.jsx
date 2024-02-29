// src/Notifications.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// Remplacez 'http://localhost:3000' par l'URL de votre serveur Socket.IO
const socket = io.connect("http://localhost:3000");

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Écouter l'événement 'notification-match' pour recevoir les notifications
    socket.on("notification-match", (notification) => {
      setNotifications((notifs) => [...notifs, notification]);
    });

    // Nettoyer en se déconnectant du socket lors du démontage du composant
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
