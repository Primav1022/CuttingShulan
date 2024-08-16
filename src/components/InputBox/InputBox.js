import React, {useEffect} from 'react';
import './InputBox.css';

function InputBox({ variationimg,value, onChange, onUpload, onKeyPress, isUploading }) {

  // ԭ�а�ť��ʽ
  const buttonStyle = {
    backgroundColor: '#ccc', // Ĭ�ϱ�����ɫ
    // ���������ť��ʽ������padding, border, borderRadius��
  };
  // �����ϴ�״̬��̬���İ�ť������ɫ
  const dynamicButtonStyle = {
    ...buttonStyle, // ����ԭ����ʽ
    backgroundColor: isUploading ? '#F00264' : buttonStyle.backgroundColor, // ����isUploading״̬�޸ı�����ɫ
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
        style={dynamicButtonStyle} // Ӧ�úϲ������ʽ
      >


       <svg width="8" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 10L10 2L18 10" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      </button>
    </div>
  );
}


export default InputBox;
