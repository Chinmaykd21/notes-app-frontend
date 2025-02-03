export const generateGuestUsername = (): string => {
  const storedUsername = localStorage.getItem("username");
  if (storedUsername) return storedUsername; // Use previously stored username

  const randomUsername = `Guest-${Math.floor(Math.random() * 1000)}`;
  localStorage.setItem("username", randomUsername); // Store username in localStorage
  return randomUsername;
};
