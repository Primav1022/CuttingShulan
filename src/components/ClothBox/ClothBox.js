import React from 'react';
import './ClothBox.css'; // 确保这里有正确的路径

const ClothBox = ({ isSelected, onClick }) => {
  const className = `cloth-box ${isSelected ? 'selected' : ''}`;
  return (
    <div className={className} onClick={onClick}>
      {/* Box content goes here */}
    </div>
  );
};

export default ClothBox;
