import React, {useEffect} from 'react';
import './InputBox.css';

function InputBox({ variationimg,value, onChange, onUpload, onKeyPress, isUploading }) {

  // 原有按钮样式
  const buttonStyle = {
    backgroundColor: '#ccc', // 默认背景颜色
    // 添加其他按钮样式，例如padding, border, borderRadius等
  };
  // 根据上传状态动态更改按钮背景颜色
  const dynamicButtonStyle = {
    ...buttonStyle, // 保持原有样式
    backgroundColor: isUploading ? '#F00264' : buttonStyle.backgroundColor, // 根据isUploading状态修改背景颜色
  };



  return (
    <div className="input-container">
      <input
        type="text"
        placeholder="Prompt"
        className="input-box"
        value={value}

        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      <button
        className="upload-btn"
        onClick={onUpload}
        style={dynamicButtonStyle} // 应用合并后的样式
      >


       <svg width="8" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 10L10 2L18 10" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      </button>
    </div>
  );
}


export default InputBox;
