import React, { useState, useEffect, useRef } from 'react';
import "./LandingPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

import logo from '../Images/chatrathLogo.png';
import hidev from "../Images/hi-dev.png";

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const closeButtonRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClickOutside = (event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            (!closeButtonRef.current || !closeButtonRef.current.contains(event.target))
        ) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className="landing-container">
            <nav className="navbar">
                <img src={logo} alt="Logo" className="logo" />
                <ul>
                    <li><a className="ai-assistant" href="#ai-assistant">AI Assistant</a></li>
                    <li><a className="contact-me" href="#contact-me">Contact Me</a></li>
                    <li className="menu-hamburger">
                        {
                            isMenuOpen ?
                            <button
                                ref={closeButtonRef}
                                className="hamburger-button"
                                onClick={toggleMenu}
                            >
                                <i className="fas fa-x"></i>
                            </button>
                        : 
                            <button className="hamburger-button" onClick={toggleMenu}>
                                <i className="fas fa-bars"></i>
                            </button>
                        }
                    </li>
                </ul>
            </nav>
         
            <div ref={menuRef} className={isMenuOpen ? 'menu-appear view' : 'menu-appear hidden'}>
                <p className='menu-item'>1. Why Coaching</p>
                <p className='menu-item'>2. Why Nick</p>
                <p className='menu-item'>3. How AI coaching works</p>
                <p className='menu-item'>4. Testimonials</p>
                <p className='menu-item'>5. Selecting the best coach</p>
                <p className='menu-item'>6. Understanding The Threshold</p>  
          </div>
                
            <div className="hero-section">
                <video autoPlay loop muted className="hero-video">
                    <source src={require('../Images/sfondoProva.mp4')} type="video/mp4" />
                    Il tuo browser non supporta i video.
                </video>
                <div className="hero-overlay">
                    <h1>Welcome to Our AI Assistant</h1>
                </div>
            </div>
            <div className="logo-slider">
                <div className="slider">
                    <img src={hidev} alt="Logo 1" />
                    <img src={hidev} alt="Logo 2" />
                    <img src={hidev} alt="Logo 3" />
                </div>
            </div>
        </div>
    );
}

export default LandingPage;