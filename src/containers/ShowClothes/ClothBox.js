import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './ShowClothes.css';
import clothImageSrc from './dress.png';

const ClothBox = forwardRef(({ fileCounter,sketchDataURL, patternDataURL, selected, spacing, selectedColor,selectedName}, ref) => {
  const canvasRef = useRef(null);


  const saveCanvasAsImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = patternDataURL;
      const fileName = selectedName || "衬衫"; // 如果选中了名字则用选中的名字，否则使用默认名字"衬衫"
      const fileNumber = fileCounter; // 使用自增的编号
      console.log('fi'+fileCounter)
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `${fileName}_${fileNumber}.png`; // 设置下载的文件名，带上自增编号
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [patternDataURL, selectedName, fileCounter]); // 添加了fileCounter到依赖数组中


  useImperativeHandle(ref, () => ({
    saveCanvasAsImage,
  }));

  useEffect(() => {
    const clothCanvas = canvasRef.current;
    if (!clothCanvas) return;
    const clothCtx = clothCanvas.getContext('2d');
    const patternImage = new Image();
    const clothImage = new Image();
    const maskImage = new Image();
    const maskDataURL = "/image/img.png";

    clothImage.onload = () => {
      clothCanvas.width = clothImage.width;
      clothCanvas.height = clothImage.height;
      clothCtx.clearRect(0, 0, clothCanvas.width, clothCanvas.height);
      clothCtx.drawImage(clothImage, 0, 0);

      patternImage.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = clothCanvas.width;
        tempCanvas.height = clothCanvas.height;

        const scaleX = tempCanvas.width / patternImage.width;
        const scaleY = tempCanvas.height / patternImage.height;
        const scale = Math.max(scaleX, scaleY);

        const patternWidth = patternImage.width * scale;
        const patternHeight = patternImage.height * scale;
        const offsetX = (tempCanvas.width - patternWidth) / 2;
        const offsetY = (tempCanvas.height - patternHeight) / 2;

        tempCtx.drawImage(patternImage, offsetX, offsetY, patternWidth, patternHeight);

        const patternMaskCanvas = document.createElement('canvas');
        const patternMaskCtx = patternMaskCanvas.getContext('2d');
        patternMaskCanvas.width = maskImage.width;
        patternMaskCanvas.height = maskImage.height;
        patternMaskCtx.drawImage(maskImage, 0, 0);

        const patternMaskImageData = patternMaskCtx.getImageData(0, 0, maskImage.width, maskImage.height);
        const tempImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        for (let i = 0; i < patternMaskImageData.data.length; i += 4) {
          if (patternMaskImageData.data[i + 3] === 0) {
            tempImageData.data[i + 3] = 0;
          }
        }
        tempCtx.putImageData(tempImageData, 0, 0);

        clothCtx.globalCompositeOperation = 'multiply';
        clothCtx.drawImage(tempCanvas, 0, 0);

        clothCtx.globalCompositeOperation = 'source-over';
      };
      patternImage.src = patternDataURL;
    };

    clothImage.src = clothImageSrc;
    maskImage.src = maskDataURL;
  }, [patternDataURL, selectedName]);

  return (
      <div>
        <div>
          <div className="canvas-container">

        <canvas ref={canvasRef} className="cloth-canvas"></canvas>
          </div>
        </div>
      </div>
  );
});

export default ClothBox;
