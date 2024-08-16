import React, { useState, useEffect ,useRef} from 'react';
import Moveable from 'react-moveable';

import './SketchBox.css';


const SketchBox = ({ targets, setTargets }) => {
  const [lastTranslate, setLastTranslate] = useState([0, 0]);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [moveableTarget, setMoveableTarget] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const deleteButtonSize = 30;
  const deleteButtonOffset = deleteButtonSize / 2;
  const [deleteButtonPosition, setDeleteButtonPosition] = useState({ x: 0, y: 0 });

  const calculateRotatedTopRight = (x, y, width, height, rotate) => {
    // �?心点坐标
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // 右上角相对于�?心点的相对位
    const relativeX = width / 2;
    const relativeY = -height / 2;

    // 将旋�?角度从度�?�?为弧�?
    const radians = rotate * (Math.PI / 180);

    // 应用旋转
    const rotatedX = relativeX * Math.cos(radians) - relativeY * Math.sin(radians);
    const rotatedY = relativeX * Math.sin(radians) + relativeY * Math.cos(radians);

    // �?换回绝�?�坐�?
    const absoluteX = centerX + rotatedX;
    const absoluteY = centerY + rotatedY;

    return { x: absoluteX, y: absoluteY };
  };

  // 使用该函数来获取旋转后右上�?�的坐标
  let rotatedTopRight = { x: 0, y: 0 };

if (selectedTarget) {
  rotatedTopRight = calculateRotatedTopRight(selectedTarget.x, selectedTarget.y, selectedTarget.width, selectedTarget.height, selectedTarget.rotate);
}


  // 现在你可以使�? rotatedTopRight.x �? rotatedTopRight.y 作为删除�?的坐�?

  const onDrag = ({ target, beforeTranslate }) => {
    const id = parseInt(target.parentElement.getAttribute('data-id'));
    const targetData = targets.find(t => t.id === id);

    if (targetData) {
      const deltaX = beforeTranslate[0] - lastTranslate[0];
      const deltaY = beforeTranslate[1] - lastTranslate[1];

      const radians = targetData.rotate * (Math.PI / 180);
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);

      const adjustedX = deltaX * cos - deltaY * sin;
      const adjustedY = deltaY * cos + deltaX * sin;
   // 计算新位�?，但尚未应用边界限制
   let newX = targetData.x + adjustedX;
   let newY = targetData.y + adjustedY;

   // 使用 SketchBox �? 60vh 作为活动区域的垂直限�?
   // const maxHeight = window.innerHeight * 0.6-targetData.height;
   // const maxWidth = window.innerHeight * 0.6-targetData.width;
const maxWidth=10000000000;
const maxHeight=100000000000;
   // 应用边界限制
   newX = Math.max(-100000100, Math.min(newX, maxWidth));
    newY = Math.max(-100000000, Math.min(newY,maxHeight));

   // 更新�?标位�?
   updateTarget(id, {
     x: newX,
     y: newY
   });

      setLastTranslate(beforeTranslate); // 更新 lastTranslate 为当前的 beforeTranslate
    }
  };


  const onRotate = ({ target, beforeRotate }) => {
    const id = parseInt(target.parentElement.getAttribute('data-id'));
    const targetData = targets.find(t => t.id === id);

    if (targetData) {

      const newRotate = targetData.rotate + beforeRotate;


      updateTarget(id, { rotate: newRotate });
    }
  };



  useEffect(() => {
    if (selectedTarget) {
      setMoveableTarget(document.querySelector(`.img-container[data-id="${selectedTarget.id}"] > img`));
    }
  },
   [selectedTarget, targets]);

   const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
   const containerRef = useRef(null);

   useEffect(() => {
     if (containerRef.current) {
       setContainerSize({
         width: containerRef.current.offsetWidth,
         height: containerRef.current.offsetHeight,
       });
     }
   }, [containerRef.current]);
   function onDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/json');

    // �?保只有当有数�?时才尝试解析
    if (data) {
      const { type, url } = JSON.parse(data);

      if (type === 'library') {
        // 获取 SketchBox 容器的边�?
        const boxRect = event.currentTarget.getBoundingClientRect();

        // 调整坐标，使其相对于 SketchBox 容器
        // const x = event.clientX - boxRect.left;
        // const y = event.clientY - boxRect.top;
        const x = 0;
        const y = 0;

        // 创建新图�?
        const newImage = {
          id: Date.now(),
          src: url,
          x: x,
          y: y,
          width: 100,
          height: 100,
          rotate: 0,
        };
        setTargets([...targets, newImage]);
      }
    }
  }


  useEffect(() => {
    if (selectedTarget) {
      // 使用计算旋转后右上�?�坐标的函数
      const { x, y } = calculateRotatedTopRight(
        selectedTarget.x,
        selectedTarget.y,
        selectedTarget.width,
        selectedTarget.height,
        selectedTarget.rotate
      );

      // 更新删除�?的位�?状�?
      setDeleteButtonPosition({ x, y });
    }
  }, [selectedTarget]);

  const onDragOver = (event) => {
    event.preventDefault();
  };


  const onDragStart = ({ target }) => {
    setIsDragging(true);
    const id = parseInt(target.parentElement.getAttribute('data-id'));
    const targetData = targets.find(target => target.id === id);
    if (targetData) {
      setLastTranslate([0, 0]); // 重置为初始�?
    }
  };
   const onDragEnd = ({ target }) => {
    setIsDragging(false);
  };
  const deleteImage = (id) => {
    setTargets(targets.filter(target => target.id !== id));
    setSelectedTarget(null);
    setMoveableTarget(null);

  };


  const updateTarget = (id, updatedFields) => {
    setTargets(targets.map(target => target.id === id ? { ...target, ...updatedFields } : target));
  };

  const handleSketchBoxClick = (event) => {

    const isImageOrContainerClicked = event.target.closest('.img-container');


    if (!isImageOrContainerClicked) {
      setSelectedTarget(null);
      setMoveableTarget(null);
    }
  };
  const onResize = ({ target, width, height }) => {
    const id = parseInt(target.parentElement.getAttribute('data-id'));
    const targetData = targets.find(t => t.id === id);

    if (targetData) {
      // 确定新的宽度和高度，但不允许超过 SketchBox 的尺寸
      const newWidth = width;
      const newHeight = height;

      // 更新目标尺寸
      updateTarget(id, { width: newWidth, height: newHeight });
    }
  };


  return (
    <div className="sketch-box" ref={containerRef} onClick={handleSketchBoxClick} onDrop={onDrop} onDragOver={onDragOver}>
      {targets.map((target) => {
        // 计算旋转后右上�?�的坐标，用于定位删除键
        const { x, y } = calculateRotatedTopRight(target.x, target.y, target.width, target.height, target.rotate);

        return (
          <React.Fragment key={target.id}>
      <div
        data-id={target.id}
        className="img-container"
        style={{
          position: 'absolute',
          left: target.x,
          top: target.y,
          transform: `rotate(${target.rotate}deg)`,
          width: `${target.width}px`,
          height: `${target.height}px`
        }}
      >
        <img
          src={target.src}
          alt={`Element ${target.id}`}
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          onClick={() => setSelectedTarget(target)}
        />
      </div>
      {selectedTarget && selectedTarget.id === target.id && (
        <div
          onClick={() => deleteImage(target.id)}
          style={{
            position: 'absolute',
            left: `${x - deleteButtonOffset}px`, // 调整以使圆心与右上顶点重�?
            top: `${y - deleteButtonOffset}px`, // 调整以使圆心与右上顶点重�?
            cursor: 'pointer',
            zIndex: 100000000, // �?保删除按�?在图像上�?
            width: `${deleteButtonSize}px`,
            height: `${deleteButtonSize}px`,
            borderRadius: '50%', // 创建圆形按钮
            backgroundColor: 'red',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
             <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="15" fill="#333333"/>
          <path d="M10.7563 19.2422L19.2416 10.7569" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M19.2437 19.2422L10.7584 10.7569" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        </div>
      )}
    </React.Fragment>
        );
      })}
        <Moveable
          target={moveableTarget}
          draggable={true}
          resizable={true}
          rotatable={true}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrag={onDrag}
        onResize={onResize}
          onRotate={onRotate}

        />
    </div>
  );
        }
export default SketchBox;