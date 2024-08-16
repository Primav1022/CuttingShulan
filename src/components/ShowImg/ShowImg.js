import React, { useEffect, useRef, useState } from 'react';
import './ShowImg.css';
import axios from 'axios'; // 导入 Axios

const ShowImg = ({ onAddToLibrary, images, onRefresh, showImages, isClicked,setvariationimg }) => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [buttonStyle, setButtonStyle] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);
  const galleryRef = useRef(null);
  const [isButtonsVisible, setIsButtonsVisible] = useState(true);
  const [addedImages, setAddedImages] = useState([]);
  const [threeisClicked, setThreeIsClicked] = useState(false);
  const [twoisClicked, setTwoIsClicked] = useState(false);
  const [oneisClicked, setOneIsClicked] = useState(false);


  const handleImageClick = (index, event) => {
    setSelectedImg(index);
    // console.log(selectedImg)
    setIsZoomed(false);
    setIsButtonsVisible(true);
    const rect = event.target.getBoundingClientRect();
    const isLeftSide = index % 2 === 0;
    let buttonLeftStyle = isLeftSide ? rect.left - 140 + 'px' : rect.right -10  + 'px';

    setButtonStyle({
      position: 'absolute',
      top: `${rect.top}px`,
      left: buttonLeftStyle,
    });
  };

  const handleZoomImage = () => {
    if (selectedImg !== null) {
      setIsZoomed(true);
    }
  };

  const handleAddClick = () => {
    setTwoIsClicked(true);
    setTimeout(() => setTwoIsClicked(false), 50);
    if (onAddToLibrary && selectedImg !== null) {
      const imageUrl = images[selectedImg];

      if (!addedImages.includes(imageUrl)) {
        onAddToLibrary(imageUrl);
        setAddedImages([...addedImages, imageUrl]);
      } else {
        alert("Have been added!");
      }
    }
  };

  const handleClick =  () => {
    setThreeIsClicked(true);
    setTimeout(() => setThreeIsClicked(false), 50);
    // 获取选中的图片
    const selectedkey = images[selectedImg];
    setvariationimg([selectedkey]);
  };

  const closeZoom = () => {
    setIsZoomed(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsButtonsVisible(false);
    };

    const handleClickOutside = (event) => {
      if (galleryRef.current && !galleryRef.current.contains(event.target)) {
        setIsButtonsVisible(false);
      }
    };
    const defaultImages = [
      '/image1.png',
      '/image2.png',
      '/image3.png',
      '/image4.png',
    ];
    const galleryElement = galleryRef.current;
    galleryElement.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    galleryElement.scrollTop = galleryElement.scrollHeight;

    return () => {
      galleryElement.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (galleryRef.current && images.length > 0) {
      const nodes = galleryRef.current.querySelectorAll('.image-wrapper');
      if (nodes.length > 0) {
        const lastImageElement = nodes[nodes.length - 1];
        lastImageElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [images.length]); // Only re-run the effect if images array length changes

  return (
      <div className="image-gallery" ref={galleryRef}>
        {(images || []).map((imageURL, index) => (
            <div
                className={`image-wrapper ${selectedImg === index ? 'selected' : ''}`}
                key={index}
                onMouseEnter={(e) => handleImageClick(index, e)}
            >
              <img src={imageURL} alt={`Gallery ${index + 1}`} className="gallery-image" />
            </div>
        ))}
        {selectedImg !== null && isButtonsVisible && (
            <div className="buttons" style={buttonStyle}>
              <button className="image-button" onClick={handleClick}>
                {threeisClicked ?
                    <img src="/icon/variationafter.svg" alt="Icon 2" /> :
                    <img src="/icon/variation.svg" alt="Icon 1" />
                }
              </button>
              <button className="image-button" onClick={handleAddClick}>
                {twoisClicked ?
                    <img src="/icon/selectclick.svg" alt="Icon 2" /> :
                    <img src="/icon/select.svg" alt="Icon 1" />
                }
              </button>
              <button className="image-button" onClick={handleZoomImage}>
                {oneisClicked ?
                    <img src="/icon/magnifyclick.svg" alt="Icon 2" /> :
                    <img src="/icon/magnify.svg" alt="Icon 1" />
                }
              </button>
            </div>
        )}
        {isZoomed && (
            <>
              <div className="overlay" onClick={closeZoom}></div>
              <div className="zoomed-image-container">
                <img
                    src={images[selectedImg]}
                    alt={`Zoomed ${selectedImg + 1}`}
                    className="zoomed-image"
                />
                <button className="close-button" onClick={closeZoom}>X</button>
              </div>
            </>
        )}
        {showImages && (
            <button className="regenerate-button" onClick={onRefresh}>
              {isClicked ? <img src="/icon/redoafter.svg" alt="Icon 1" /> : <img src="/icon/redobefor.svg" alt="Icon 2" />}
            </button>
        )}
      </div>
  );

};

export default ShowImg;