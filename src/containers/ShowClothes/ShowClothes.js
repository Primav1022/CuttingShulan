import React, { useRef, useState } from 'react';
import './ShowClothes.css';
import StepBar from '../../components/StepBar/StepBar';
import ClothBox from './ClothBox';
import ClothBox2 from './ClothBox2';

const ShowClothes = ({fileCounter ,setFileCounter, selectedColor, imgscale, setImgscale, setSpacing, spacing, currentStep, handleNextStep, handlePrevStep, sketchDataURL, patternDataURL, setConnectionType, connectionType }) => {
    const [selectedBox, setSelectedBox] = useState(null); // 用于追踪选中的 ClothBox

    const clothBoxRef = useRef(null);
    const [outputSuccess, setOutputSuccess] = useState(false); // 用于控制输出成功信息的显示

    const handleSelectBox = (boxName) => {
        if (selectedBox === boxName) {
            setSelectedBox(null); // 如果已经选中，再次点击取消选中
        } else {
            setSelectedBox(boxName); // 否则选中
        }
    };

    const handleSaveImage = () => {
        if (clothBoxRef.current) {
            const boxName = selectedBox === 'clothbox' ? '衬衫' : (selectedBox === 'clothbox2' ? '裙子' : 'image');
            const fileName = `${boxName}_${fileCounter}`; // 文件名加上自增的编号
            setFileCounter(prevCounter => prevCounter + 1); // 使用函数式的状态更新
            console.log('复制')
            console.log(fileCounter)
            clothBoxRef.current.saveCanvasAsImage(fileName);
            setOutputSuccess(true); // 设置输出成功信息为显示
        }
    };

    const increaseSpacing = () => {
        setSpacing(prevSpacing => prevSpacing + 100);
    };

    const decreaseSpacing = () => {
        setSpacing(prevSpacing => (prevSpacing - 100 >= 0 ? prevSpacing - 100 : 0));
    };

    const bigscaleimg = () => {
        setImgscale(previmgscale => {
            if (previmgscale < 2) {
                return previmgscale + 0.25;
            } else {
                return previmgscale;
            }
        });
    };

    const smallscaleimg = () => {
        setImgscale(previmgscale => {
            if (previmgscale > 1) {
                return previmgscale - 0.25;
            } else {
                return previmgscale;
            }
        });
    };

    const selectedName = selectedBox === 'clothbox' ? '衬衫' : (selectedBox === 'clothbox2' ? '裙子' : ''); // 设置选中的名称

    return (
        <div className="container containerColumn">
            <StepBar currentStep={currentStep} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
            <div className="bgcolor">
                <div className="middlecloth">
                    {!outputSuccess ? (
                        <>
                            <div className={`clothbox ${selectedBox === 'clothbox' ? 'selected' : ''}`} onClick={() => handleSelectBox('clothbox')}>
                                <ClothBox2 selectedColor={selectedColor} imgscale={imgscale} setImgscale={setImgscale} setConnectionType={setConnectionType} connectionType={connectionType} spacing={spacing} ref={clothBoxRef} sketchDataURL={sketchDataURL} patternDataURL={patternDataURL} selectedName={selectedName} />
                            </div>
                            <div className={`clothbox ${selectedBox === 'clothbox2' ? 'selected' : ''}`} onClick={() => handleSelectBox('clothbox2')}>
                                <ClothBox fileCounter={fileCounter} selectedColor={selectedColor} imgscale={imgscale} setImgscale={setImgscale} setConnectionType={setConnectionType} connectionType={connectionType} spacing={spacing} ref={clothBoxRef} sketchDataURL={sketchDataURL} patternDataURL={patternDataURL} selectedName={selectedName} />
                            </div>
                        </>
                    ) : (
                        <div className="output-success"><img src="/icon/final.svg" alt="Output Success"
                                                             className="output-success-img"/></div>
                    )}
                </div>
            </div>
            {!outputSuccess ? (
                <div className="bottom">
                    <div className="containerbox">
                        <span className="text-above-buttons">
                            <span className="zoomimg">Spacing </span>
                            <span className="sizetext">Size</span>
                        </span>
                        <div className="button-group">
                            <button className="bottom-buttonbig" onClick={increaseSpacing}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 10H18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 2L10 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="bottom-buttonbig" onClick={decreaseSpacing}>
                                <svg width="20" height="4" viewBox="0 0 20 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 2H18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="bottom-buttonbig" onClick={bigscaleimg}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 10H18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 2L10 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="bottom-buttonbig" onClick={smallscaleimg}>
                                <svg width="20" height="4" viewBox="0 0 20 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 2H18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <button className="bottom-button" onClick={handleSaveImage}>Pattern file output</button>
                    </div>
                </div>
            ):(
                <div className="bottomlast"></div>
            )
            }
        </div>
    );
};

export default ShowClothes;
