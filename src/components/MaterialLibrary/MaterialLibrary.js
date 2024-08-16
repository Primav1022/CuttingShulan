import React from 'react';
import './MaterialLibrary.css';

function MaterialLibrary({ materials }) {
    function handleDragStart(event, imageUrl)  {

        const dragData = JSON.stringify({ type: 'library', url: imageUrl });
        event.dataTransfer.setData('application/json', dragData);
    }

    return (
        <div className="materialall">
            <div className="title-bar">
                <span>
                    <svg width="15" height="13" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.3894 6.75092L15.941 6.9722L16.3894 6.75092L13.8451 1.5957C13.2949 0.480832 11.7051 0.480838 11.1549 1.5957L8.61064 6.75092C8.53781 6.89849 8.39703 7.00078 8.23418 7.02444L2.54506 7.85112C1.31472 8.02989 0.823464 9.54185 1.71374 10.4097L5.83042 14.4224C5.94826 14.5373 6.00204 14.7028 5.97422 14.865L5.0024 20.5311C4.79224 21.7565 6.07839 22.6909 7.17883 22.1124L12.2673 19.4372C12.413 19.3606 12.587 19.3606 12.7327 19.4372L17.8212 22.1124C18.9216 22.6909 20.2078 21.7565 19.9976 20.5311L19.0258 14.865C18.998 14.7028 19.0517 14.5373 19.1696 14.4224L23.2863 10.4097C24.1765 9.54185 23.6853 8.02989 22.4549 7.85112L16.7658 7.02444C16.603 7.00077 16.4622 6.89849 16.3894 6.75092Z"
                            fill="#333333" stroke="#333333"/>
                    </svg>
                    <span className="skipspan"> </span>
                  Material Library
                </span>
            </div>
            <div className="image-container">
                {materials && materials.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, image)}
                        alt={`Material ${index}`}
                        className="material-image"
                    />
                ))}
            </div>
        </div>
    );
}

export default MaterialLibrary;
