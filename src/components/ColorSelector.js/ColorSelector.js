import React, { useState } from 'react';
import './SelectorStyles.css';


function ColorSelector(props) {
  const { selectedColor, onColorSelect } = props;
  const [isOpen, setIsOpen] = useState(false);

  const colors = ['#002FA8', '#80D8CF', '#003153', '#018380','#FFFFFF','#000000','#F1F2F8','#09132D','#3873DA','#0480EE','#003FB7','#831C2E','#FC5759','#FF4C95','#32954A','#406667','#FEDC00','#D7D3C7','#9CD2C4','#DEE2D7','#DDDDDD','#CAD3E2','#D8D6C7','#FAC4A2','#F9C6CC','#9BC6EE','#98DED4','#ECF1FD','#B0BAB9','#A0B0CF','#BDB0D4','#B8A79F','#E8E8E8','#BEBFB8','#AC9F8A','#7A6961','#919BA1','#55514D','#CC934D','#8F7F70','#DFCDAF','#A54636']; // 预定义的颜色列表

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectColor = (color) => {

    onColorSelect(color);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-selector" onClick={toggleDropdown}>
        <div className="color-preview" style={{ backgroundColor: selectedColor }}></div>
        <div className="arrow down"></div>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {colors.map(color => (
            <div key={color} className="dropdown-item" onClick={() => selectColor(color)}>
              <div className="color-block" style={{ backgroundColor: color }}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ColorSelector;
