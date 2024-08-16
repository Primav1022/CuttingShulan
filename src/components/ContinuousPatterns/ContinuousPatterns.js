import React, {useRef, useEffect, useCallback, forwardRef, useState} from 'react';
import './ContinuousPatterns.css'; // 引入样式文件




const ContinuousPatterns = forwardRef(({ dataUrl,sketchDataURL, selectedColor, connectionType, currentStep, onSave,spacing,setSpacing,imgscale,setImgscale }, ref) => {
    const canvasRef = useRef(null);
    const [offsetX, setOffsetX] = useState(0); // 用于存储X轴偏移量的状态

    // 用于设置 canvas 尺寸的函数
    const setCanvasSize = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas && canvas.parentElement) {
            canvas.width = 4096;
            canvas.height = 2048;

        }
    }, []);

    // 绘制图案到 canvas
    const drawPattern = useCallback(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // 清除 canvas
        clearCanvas();
        // 设置 canvas 背景颜色


        context.fillStyle = selectedColor; // 使用 selectedColor 作为背景颜色
        context.fillRect(0, 0, canvas.width, canvas.height); // 填充整个 canvas

        const img = new Image();

        img.onload = () => {
            // const scaledWidth = img.width * 0.25+spacing; 'Butting',
            //     'Lapping 1/4 on a row',
            //     'Lapping 1/3 on a row',
            //     'Lapping 1/2 on a row',
            //     'Lapping 2/3 on a row',
            //     'Lapping 3/4 on a row'
            // const scaledHeight = img.height * 0.25+spacing;
            const scaledWidth = img.width*imgscale ;
            const scaledHeight = img.height*imgscale ;
            const numTilesY = Math.ceil(canvas.height / scaledHeight);
            const offsetMap = {
                'Butting': 0,
                'Lapping 1/4 on a row': 0.25,
                'Lapping 1/3 on a row': 1 / 3,
                'Lapping 1/2 on a row': 0.5,
                'Lapping 2/3 on a row': 2 / 3,
                'Lapping 3/4 on a row': 0.75,
            };
            const jumpOffset = offsetMap[connectionType] || 0;

            let currentOffsetX = 0;

            for (let y = 0; y < numTilesY; y++) {
                currentOffsetX = y * (scaledWidth + spacing) * jumpOffset % (scaledWidth + spacing);

                for (let x = currentOffsetX - scaledWidth - spacing; x < canvas.width; x += scaledWidth + spacing) {
                    context.drawImage(img, x, y * (scaledHeight + spacing), scaledWidth, scaledHeight);
                }
            }

            // 更新 offsetX 状态以存储当前的 X 轴偏移量
            setOffsetX(currentOffsetX);
            handleSave();
        };

        img.src = dataUrl;


    }, [dataUrl, connectionType, currentStep, selectedColor, setOffsetX,spacing,imgscale]); // 添加 setOffsetX 作为依赖项
    const handleSave = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const imageData = canvas.toDataURL("image/png", 1, 300);
            onSave(imageData); // 将图像数据传递给父组件
        }
    }, [onSave]);
    
    // 防抖函数
    const debounce = useCallback((func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, wait);
        };
    }, []);
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        // 清除画布
        context.clearRect(0, 0, canvas.width, canvas.height);
    };



    useEffect(() => {
        clearCanvas(); // 清除画布

        // 设置 canvas 尺寸
        setCanvasSize();

        // 绘制新的图案
        drawPattern();

        // 定义窗口大小调整时的处理函数，该函数使用防抖以减少执行次数
        const handleResize = debounce(() => {
            clearCanvas(); // 在设置新尺寸之前先清除画布
            setCanvasSize();
            drawPattern(); // 重新绘制图案
        }, 250);

        // 监听窗口大小调整事件
        window.addEventListener('resize', handleResize);

        // 清理函数
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [debounce, setCanvasSize, drawPattern, sketchDataURL, selectedColor, connectionType, currentStep, spacing,imgscale]); // 将spacing添加到依赖项数组中

    return (
         // <div className="continuous-patterns" style={{ backgroundColor: selectedColor }}>
             <div className="continuous-patterns" >
        <canvas ref={canvasRef} id="myCanvas" style={{ width: '60vw', height: '60vh' }}/>
        {/*<button onClick={handleSave}>Save next</button>*/}
        {/*<button onClick={saveCanvasAsImage}>Save as Image</button>*/}
    </div>
    );
});

export default ContinuousPatterns;