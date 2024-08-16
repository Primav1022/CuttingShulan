
import React, {  useRef, useImperativeHandle, forwardRef, useCallback} from 'react';
import StepBar from '../../components/StepBar/StepBar';
import './MakeContinuous.css';
import ColorSelector from '../../components/ColorSelector.js/ColorSelector';
import ConnectionSelector from '../../components/ColorSelector.js/ConnectionSelector';
import ContinuousPatterns from '../../components/ContinuousPatterns/ContinuousPatterns';


const MakeContinuous = forwardRef((props, ref) => {
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
      clearCanvas() {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);
      }
  }));
  // const [connectionType, setConnectionType] = useState('平接');
  // 从 props 中解构出需要的参数
  const { currentStep, handleNextStep, handlePrevStep, sketchDataURL, onSave,spacing,setSpacing,imgscale,setImgscale,selectedColor,setSelectedColor,setConnectionType,connectionType,dataUrl} = props;
  // const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // 默认为白色
  const handleConnectionTypeChange = useCallback((newType) => {
    setConnectionType(newType);
  }, [setConnectionType]);


  return ( 
    <div className="container containerColumn" style={props.style}>
      
        <StepBar currentStep={currentStep} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
        <div className="middle">
            <div className="bgcolor">
          <ContinuousPatterns dataUrl={dataUrl} imgscale={imgscale} setImgscale={setImgscale} spacing={spacing} setSpacing={setSpacing} onSave={onSave} sketchDataURL={sketchDataURL} selectedColor={selectedColor} connectionType={connectionType} ref={ref} setConnectionType={setConnectionType}/>
            </div>
            </div>
        <div className="bottom">

        <div className="selectors-wrapper">
 <ColorSelector onColorSelect={setSelectedColor} selectedColor={selectedColor}/>
      <ConnectionSelector selectedConnection={connectionType} onConnectionTypeChange={handleConnectionTypeChange}  onColorSelect={setSelectedColor} selectedColor={selectedColor} setConnectionType={setConnectionType}/>
    </div>
        </div>
       
      
    </div>
  );
})

export default MakeContinuous;
