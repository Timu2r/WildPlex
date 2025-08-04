import React from 'react'
import wildplex from '../assets/wildplex.png';
import '../styles/Banner.css'

const Banner = () => {
  return (
    <div className="banner-section">
      <div className="banner-content">
        <div className="banner-image-container">
          <img 
            src={wildplex} 
            alt="Новая Эра баннер" 
            className="banner-image"
          />
          <div className="banner-overlay"></div>
        </div>
        <div className="banner-text-content">
          <div className="server-info">
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner