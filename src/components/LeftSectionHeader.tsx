import { useEffect, useState } from "react";
import { WebSocketService, WS_URL } from "../utils/websocket";
import { motion } from "motion/react";
import { generateGuestUsername } from "../utils/userUtils";

const username = generateGuestUsername();
const ws = WebSocketService.getInstance(username, WS_URL);

const getRandomColor = (username: string) => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFC733"];
  const hash = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const LeftSectionHeader = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    ws.onMessage((message) => {
      if (message.type === "user_joined") {
        setOnlineUsers((prev) => [...prev, message.user]);
      } else if (message.type === "user_left") {
        setOnlineUsers((prev) => prev.filter((user) => user !== message.user));
      }
    });
  }, []);
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 mb-1">
      <button className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600">
        New Note
      </button>

      <div className="flex space-x-[-8px]">
        {onlineUsers.length > 0 ? (
          onlineUsers.map((user) => (
            <motion.div
              key={user}
              className={`relative flex justify-center items-center text-white font-bold rounded-full w-10 h-10 ${getRandomColor(
                user
              )}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{
                zIndex: onlineUsers.length - onlineUsers.indexOf(user),
              }}
            >
              {user.charAt(0).toUpperCase()}{" "}
              {/* ✅ Show first letter as uppercase */}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No Users Online</p>
        )}
      </div>
    </div>
  );
};
