import React, { useState, useEffect, useRef } from 'react';
import "./LandingPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Loader from '../Loader/Loader';
import logo from '../Images/chatrathLogo.png';
import hidev from "../Images/hi-dev.png";

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Stato di caricamento
    const cursorRef = useRef(null);

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

    const handleMouseMove = (event) => {
        if (cursorRef.current) {
            cursorRef.current.style.left = `${event.clientX}px`;
            cursorRef.current.style.top = `${event.clientY}px`;
        }
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

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

    useEffect(() => {
        // Simula un caricamento di 2 secondi
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const moveTo = (id) => {
        setTimeout(() => {
            const section = document.getElementById(id);
            if (section) {
                const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: sectionPosition,
                    behavior: 'smooth'
                });
            }
        }, 150);
    }

    return (
        <>
            <div ref={cursorRef} className="custom-cursor"></div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`landing-container ${!isLoading ? 'landing-appear' : ''}`}>
                    <nav className='navbar'>
                        <img src={logo} alt="Logo" className="logo" />
                        <ul>
                            <li><a className="ai-assistant" href="#ai-assistant">AI Assistant</a></li>
                            <li><a className="contact-me" href="#contact-me">Contact Me</a></li>
                            <li className="menu-hamburger">
                                {isMenuOpen ? (
                                    <button
                                        ref={closeButtonRef}
                                        className="hamburger-button"
                                        onClick={toggleMenu}
                                    >
                                        <i className="fas fa-x"></i>
                                    </button>
                                ) : (
                                    <button className="hamburger-button" onClick={toggleMenu}>
                                        <i className="fas fa-bars"></i>
                                    </button>
                                )}
                            </li>
                        </ul>
                    </nav>
                    <div ref={menuRef} className={isMenuOpen ? 'menu-appear view' : 'menu-appear hidden'}>
                        <p className='menu-item' onClick={() => moveTo('coaching')}>1. Why Coaching</p>
                        <p className='menu-item'>2. Why Nick</p>
                        <p className='menu-item'>3. How AI coaching works</p>
                        <p className='menu-item'>4. Testimonials</p>
                        <p className='menu-item'>5. Selecting the best coach</p>
                        <p className='menu-item'>6. Understanding The Threshold</p>
                    </div>

                    <div className="hero-section">
                        <div className="hero-overlay">
                            <h1 className='hero-title' id="title">Welcome to Our AI Assistant</h1>
                            <h4 className='hero-subtitle'>This is an example of a subtitle, will be cheanged</h4>
                        </div>
                        <div className="logo-slider">
                            <div className="slider">
                                <img src={hidev} alt="Logo 1" />
                                <img src={hidev} alt="Logo 2" />
                                <img src={hidev} alt="Logo 3" />
                            </div>
                        </div>
                    </div>
                    <div className='why-coaching' id='coaching'></div>
                </div>
            )}
        </>
    );
}

export default LandingPage;