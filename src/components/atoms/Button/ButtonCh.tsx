import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      className={`bg-blue-600 text-white font-medium py-3 px-6 rounded w-full ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
