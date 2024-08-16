import React, { forwardRef, useCallback, useEffect, useRef, useImperativeHandle } from 'react';
import './ShowClothes.css';
import clothImageSrc from './Remove-bg.ai_1713274468747(1).png';

const ClothBox = forwardRef(({ imgscale, sketchDataURL, patternDataURL, selected, spacing,selectedcolor }, ref) => {
    const canvasRef = useRef(null);

    // const saveCanvasAsImage = useCallback(() => {
    //     const canvas = canvasRef.current;
    //     if (canvas) {
    //         const imageData = canvas.toDataURL('image/png', 1.0); // Ensure you use the canvas data.
    //         const link = document.createElement('a');
    //         link.href = imageData;
    //         link.download = '裙子.png';
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     }
    // }, []);
    //
    // useImperativeHandle(ref, () => ({
    //     saveCanvasAsImage,
    // }));

    useEffect(() => {
        const clothCanvas = canvasRef.current;
        if (!clothCanvas) return;
        const clothCtx = clothCanvas.getContext('2d');
        const patternImage = new Image();
        const clothImage = new Image();
        const maskImage = new Image(); // ����ɰ�ͼ��
        const maskDataURL = "/image/Remove.png";
        const neckWidth = clothCanvas.width * 0.3; // ��ڿ��Ϊ������ȵ�30%
        const neckHeight = clothCanvas.height * 0.1; // ��ڸ߶�Ϊ�����߶ȵ�10%
        const neckX = (clothCanvas.width - neckWidth) / 2; // ���ˮƽ����
        const neckY = 0; // ����ڻ�������

        clothImage.onload = () => {
            clothCanvas.width = clothImage.width;
            clothCanvas.height = clothImage.height;
            clothCtx.clearRect(0, 0, clothCanvas.width, clothCanvas.height);
            clothCtx.drawImage(clothImage, 0, 0);
            clothCtx.fillStyle = selectedcolor ? selectedcolor : 'transparent'; // ��� selected Ϊ true��ʹ�� selectedColor������͸��
            clothCtx.fillRect(neckX, neckY, neckWidth, neckHeight);

            patternImage.onload = () => {
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = clothCanvas.width;
                tempCanvas.height = clothCanvas.height;

                // ����ͼ���Ŵ��ĳߴ�
                const scaleX = tempCanvas.width / patternImage.width;
                const scaleY = tempCanvas.height / patternImage.height;
                const scale = Math.max(scaleX, scaleY); // ѡ��ϴ�����ű�����������������

                const patternWidth = patternImage.width * scale;
                const patternHeight = patternImage.height * scale;
                const offsetX = (tempCanvas.width - patternWidth) / 2;  // ˮƽ����
                const offsetY = (tempCanvas.height - patternHeight) / 2;  // ��ֱ����

                // ����ʱ�����ϻ���ͼ��
                tempCtx.drawImage(patternImage, offsetX, offsetY, patternWidth, patternHeight);

                // ������������ͼ������������ɰ�
                const patternMaskCanvas = document.createElement('canvas');
                const patternMaskCtx = patternMaskCanvas.getContext('2d');
                patternMaskCanvas.width = maskImage.width;
                patternMaskCanvas.height = maskImage.height;
                patternMaskCtx.drawImage(maskImage, 0, 0);

                // Ӧ���ɰ浽ͼ����
                const patternMaskImageData = patternMaskCtx.getImageData(0, 0, maskImage.width, maskImage.height);
                const tempImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                for (let i = 0; i < patternMaskImageData.data.length; i += 4) {
                    if (patternMaskImageData.data[i + 3] === 0) {
                        tempImageData.data[i + 3] = 0;
                    }
                }
                tempCtx.putImageData(tempImageData, 0, 0);

                // ��ͼ��Ӧ�õ��·���
                clothCtx.globalCompositeOperation = 'multiply';
                clothCtx.drawImage(tempCanvas, 0, 0);

                // ���úϳɲ���
                clothCtx.globalCompositeOperation = 'source-over';
            };
            patternImage.src = patternDataURL;
        };

        clothImage.src = clothImageSrc;
        maskImage.src = maskDataURL; // �����ɰ�ͼ��
    }, [patternDataURL]);


    return (
        <div className="canvas-container" >
            <canvas ref={canvasRef} className="cloth-canvas2"></canvas>
        </div>
    );
});

export default ClothBox;
