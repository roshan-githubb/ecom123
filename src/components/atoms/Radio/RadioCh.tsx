import React from "react";

interface RadioProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Radio: React.FC<RadioProps> = ({ label, selected, onClick }) => {
  return (
    <div
      className={`flex items-center space-x-2 cursor-pointer`}
      onClick={onClick}
    >
      <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${selected ? "border-blue-600" : "border-gray-400"}`}>
        {selected && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
      </div>
      <span>{label}</span>
    </div>
  );
};

export default Radio;
