import { useEffect } from "react";

const BACKEND_HEALTH_URL = import.meta.env.VITE_BACKEND_URL + "/health";

export const KeepBackEndAlive = () => {
  useEffect(() => {
    const keepAlive = () => {
      fetch(BACKEND_HEALTH_URL)
        .then((res) => res.json())
        .then((data) => console.log("✅ Backend is alive:", data))
        .catch((error) => console.log("⚠️ Backend may be sleeping:", error));
    };

    const interval = setInterval(keepAlive, 14000);

    return () => clearInterval(interval);
  }, []);
  return null;
};
