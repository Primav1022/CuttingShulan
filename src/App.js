// App.js
import React, {useState, useRef, useCallback, useEffect} from 'react';
import './App.css';

import GenerationImg from './containers/GenerationImg/GenerationImg';
import Makeunit from './containers/Makeunit/Makeunit';
import MakeContionous from './containers/MakeContinuous/MakeContinuous';
import ShowClothes from './containers/ShowClothes/ShowClothes';
import localForage from "localforage";



function App() {
  useEffect(() => {
    // 检查并清理存储的数据
    const keysToClear = ['generatedImages']; // 列出所有你想清理的key
    keysToClear.forEach(key => {
      localForage.getItem(key).then(value => {
        if (value !== null) {
          console.log(`Clearing data for key: ${key}`);
          localForage.removeItem(key).then(() => {
            console.log(`Data cleared for key: ${key}`);
          }).catch(err => {
            console.error(`Error clearing data for key: ${key}`, err);
          });
        }
      });
    });
  }, []);
  const [spacing, setSpacing] = useState(0); // 初始间距
  const [imgscale, setImgscale] = useState(1); // 初始倍数
  const [fileCounter, setFileCounter] = useState(1); // 用于生成文件名的自增计数器
// 增加间距
  const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // 默认为白色
  const [savedPatternDataURL, setSavedPatternDataURL] = useState(null);
  const [dataUrl, setDataUrl] = useState(""); // 创建状态变量

  const makeContinuousRef=useRef(null);
 
    const handlePatternSave = useCallback((dataURL) => {
        setSavedPatternDataURL(dataURL);
    }, []);


  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sketchDataURL, setSketchDataURL] = useState(null); 
  const handleAddMaterial = (newMaterial) => {
    setSelectedMaterials(prevMaterials => [...prevMaterials, newMaterial]);
  };
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep(currentStep < 4 ? currentStep + 1 : 4);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep > 1 ? currentStep - 1 : 1);
};

  const handleSaveSketch = (dataURL) => {
    setSketchDataURL(dataURL); 
  };
  const [connectionType, setConnectionType] = useState('平接');

  return (
    <div className="content">

      {currentStep === 1 && <div>
        <GenerationImg currentStep={currentStep} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} selectedMaterials={selectedMaterials} onAddMaterial={handleAddMaterial}/>

        </div>}
      {currentStep === 2 && <div>
        <Makeunit dataUrl={dataUrl} setDataUrl={setDataUrl} currentStep={currentStep} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} selectedMaterials={selectedMaterials} onAddMaterial={handleAddMaterial}  onSaveSketch={handleSaveSketch}/>
      </div>}
      {currentStep === 3 && <div>
        <MakeContionous dataUrl={dataUrl} setDataUrl={setDataUrl} imgscale={imgscale} setImgscale={setImgscale} connectionType={connectionType}  setConnectionType={setConnectionType} spacing={spacing} selectedColor={selectedColor}  setSelectedColor={setSelectedColor} setSpacing={setSpacing} ref={makeContinuousRef} currentStep={currentStep} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} onSaveSketch={handleSaveSketch} sketchDataURL={sketchDataURL} onSave={handlePatternSave}/>
      </div>}
      {currentStep === 4 && <div>
        <ShowClothes fileCounter={fileCounter} setFileCounter={setFileCounter} selectedColor={selectedColor} imgscale={imgscale} setImgscale={setImgscale} spacing={spacing} setSpacing={setSpacing}  patternDataURL={savedPatternDataURL} currentStep={currentStep} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} sketchDataURL={sketchDataURL}/>
        <MakeContionous  dataUrl={dataUrl} setDataUrl={setDataUrl} imgscale={imgscale} setImgscale={setImgscale} connectionType={connectionType} patternDataURL={savedPatternDataURL}  setConnectionType={setConnectionType} selectedColor={selectedColor} spacing={spacing} setSpacing={setSpacing} ref={makeContinuousRef} currentStep={currentStep} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} onSaveSketch={handleSaveSketch} sketchDataURL={sketchDataURL} onSave={handlePatternSave}
                        style={{
                          visibility: 'hidden',
                          position: 'absolute',
                          left: '-9999px', // 将组件移至屏幕外，确保不占用布局空间
                        }}/>
    </div>}
    </div>
  );
}

export default App;
