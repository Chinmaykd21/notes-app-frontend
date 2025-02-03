import { FC } from "react";

export type NavigationProps = {
  title: string;
};

export const Navigation: FC<Readonly<NavigationProps>> = ({ title }) => {
  return (
    <header className="w-full p-4 bg-gray-200 shadow text-center text-xl font-bold mb-3 flex justify-evenly">
      {title}
    </header>
  );
};
