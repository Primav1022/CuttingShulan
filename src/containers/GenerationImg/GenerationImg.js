import React, {useEffect, useState} from 'react';
import StepBar from '../../components/StepBar/StepBar';
import InputBox from '../../components/InputBox/InputBox';
import MaterialLibrary from '../../components/MaterialLibrary/MaterialLibrary';
import ShowImg from '../../components/ShowImg/ShowImg';
import './GenerationImg.css';
import { useIndexedDBStorage } from './storage';
import LoadingAnimation from "../../components/loadingicon/loadingicon";  // 确保导入路径正确


const GenerationImg = ({ currentStep, handleNextStep, handlePrevStep, selectedMaterials, onAddMaterial }) => {
    const [inputValue, setInputValue] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [showImages, setShowImages] = useSessionStorageState('showImages', false);
    const [generatedImages, setGeneratedImages] = useIndexedDBStorage('generatedImages', []);
    const [variationimg,setvariationimg]=useState(null);
    function useSessionStorageState(key, defaultValue) {
        const [state, setState] = useState(() => {
            const storedValue = sessionStorage.getItem(key);
            return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
        });

        useEffect(() => {
            sessionStorage.setItem(key, JSON.stringify(state));
        }, [key, state]);
        return [state, setState];
    }
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    useEffect(() => {
        // 当variationimg变化时，更新value
        console.log(variationimg);
    }, [variationimg]);
    useEffect(() => {
        // 当variationimg变化时，更新value
        if (variationimg) {
            const uniquePrefix = Math.random().toString(36).substr(2, 5); // 生成一个5个字符的随机字符串
            setInputValue(`variationimg: ${uniquePrefix}`);
        }
    }, [variationimg]); // 确保依赖项正确
    const handleUploadWithVariationImg = async () => {
        setIsUploading(true);
        console.log('垫图:', variationimg);

        try {
            const response = await fetch('http://202.120.165.127:8004/variation-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: inputValue,
                    init_images: variationimg, // 使用variationimg作为垫图数据
                    variationimg: variationimg // 如果需要，也可以将variationimg作为另一个字段发送
                })
            });
            if (response.ok) {
                const imagesBase64 = await response.json();
                const imagesUrls = imagesBase64.map(imgBase64 => `data:image/png;base64,${imgBase64}`);
                setGeneratedImages(prevImages => [...prevImages, ...imagesUrls]);
                setShowImages(true);
            } else {
                console.error('Failed to generate image');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setIsUploading(false);
        setIsClicked(false);  // 当按钮被点击时，更新状态为true
    };
    const handleUploadWithoutVariationImg = async () => {
        setIsUploading(true);
        console.log('Uploading:', inputValue);

        try {
            const response = await fetch('http://202.120.165.127:8004/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: inputValue })
            });
            if (response.ok) {
                const imagesBase64 = await response.json();
                const imagesUrls = imagesBase64.map(imgBase64 => `data:image/png;base64,${imgBase64}`);
                setGeneratedImages(prevImages => [...prevImages, ...imagesUrls]);
                setShowImages(true);
            } else {
                console.error('Failed to generate image');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setIsUploading(false);
        setIsClicked(false);  // 当按钮被点击时，更新状态为true
    };

// 根据variationimg的存在与否来选择调用哪个函数
    const handleUpload = () => {
        if (inputValue.startsWith('variationimg')) {
            handleUploadWithVariationImg();
        } else {
            handleUploadWithoutVariationImg();
        }
    };
    const handleRegenerateImages = () => {
        setIsClicked(true);  // 当按钮被点击时，更新状态为true
        handleUpload();  // Reuse the handleUpload function to regenerate images

    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleUpload();
        }
    };

    return (
        <div className="container">
            <div className="left-side">
                <StepBar currentStep={currentStep} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
                <div className="middle">
                    <div className="bgcolor">
                        {/*{showImages && <ShowImg setvariationimg={setvariationimg} setGeneratedImages={setGeneratedImages} onAddToLibrary={onAddMaterial} images={generatedImages} onRefresh={handleRegenerateImages} showImages={showImages} isClicked={isClicked}/>}*/}
                        {1 && <ShowImg setvariationimg={setvariationimg} setGeneratedImages={setGeneratedImages} onAddToLibrary={onAddMaterial} images={generatedImages} onRefresh={handleRegenerateImages} showImages={showImages} isClicked={isClicked}/>}
                        {isUploading && <LoadingAnimation />}
                    </div>
                </div>
                <div className="bottom">
                    <InputBox variationimg={variationimg} value={inputValue} onChange={handleInputChange} onUpload={handleUpload} onKeyPress={handleKeyPress} isUploading={isUploading}  />
                </div>
            </div>
            <div className="right-side">
                <MaterialLibrary materials={selectedMaterials} />
            </div>
        </div>
    );
};

export default GenerationImg;