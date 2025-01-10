import React from 'react';
import './imageContainer.css';

const ImageContainer = ({imageSource, description}) => {
    return (
        <div className="image-container">
            <img className="image" src={imageSource} alt="alt text"/>
            <p className="date">{description}</p>
        </div>
    );
};

export default ImageContainer;