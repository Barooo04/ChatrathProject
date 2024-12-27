import React, { useState, useEffect, useRef } from 'react';
import "./LandingPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Loader from '../Loader/Loader';
import logo from '../Images/chatrathLogo.png';
import hidev from "../Images/hi-dev.png";
import bg2 from "../Images/bg3.mp4";

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const cursorRef = useRef(null);
    const scrollRef = useRef(null);

    const menuRef = useRef(null);
    const closeButtonRef = useRef(null);

    const [isScrollingHorizontally, setIsScrollingHorizontally] = useState(false);
    const nickSectionRef = useRef(null);
    const horizontalScrollRef = useRef(null);

    const [isScrollingLocked, setIsScrollingLocked] = useState(false);

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

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };
    
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start', // Scorre fino all'inizio della sezione
                });
            }
        }, 150);
    };

    const cardsData = [
        {
            icon: "fas fa-star",
            title: "Card 1",
            description: "Questa è una descrizione di esempio che occupa due righe."
        },
        {
            icon: "fas fa-rocket",
            title: "Card 2",
            description: "Questa è una descrizione di esempio che occupa due righe."
        },
        {
            icon: "fas fa-brain",
            title: "Card 3",
            description: "Questa è una descrizione di esempio che occupa due righe."
        },
    ];

    const handleScrollLock = () => {
        if (isScrollingLocked) {
            document.body.classList.add('lock-scroll');
        } else {
            document.body.classList.remove('lock-scroll');
        }
    };

    useEffect(() => {
        handleScrollLock();
    }, [isScrollingLocked]);

    const handleScrollEnd = () => {
        const scrollContainer = document.querySelector('.scroll-container');
        if (scrollContainer) {
            const lastChild = scrollContainer.lastElementChild;
            if (lastChild && lastChild.getBoundingClientRect().bottom <= window.innerHeight) {
                setIsScrollingLocked(false); // Sblocca lo scorrimento
            }
        }
    };

    useEffect(() => {
        const scrollContainer = document.querySelector('.scroll-container');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScrollEnd);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScrollEnd);
            }
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className="custom-cursor"></div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`landing-container ${!isLoading ? 'landing-appear' : ''}`}>
                    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
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
                        <p className='menu-item' onClick={() => moveTo('nick')}>2. Why Nick</p> {/* Aggiunto il click per "Why Nick" */}
                        <p className='menu-item'>3. How AI coaching works</p>
                        <p className='menu-item'>4. Testimonials</p>
                        <p className='menu-item'>5. Selecting the best coach</p>
                        <p className='menu-item'>6. Understanding The Threshold</p>
                    </div>

                    <div className="hero-section">
                        <div className="hero-overlay">
                            <h1 className='hero-title' id="title">Welcome to Our AI Assistant</h1>
                            <h4 className='hero-subtitle'>This is an example of a subtitle, will be changed</h4>
                        </div>
                        <div className="logo-slider">
                            <div className="slider">
                                <img src={hidev} alt="Logo 1" />
                                <img src={hidev} alt="Logo 2" />
                                <img src={hidev} alt="Logo 3" />
                            </div>
                        </div>
                    </div>
                    <div className='why-coaching' id='coaching'>
                        <div className="coaching-content">
                            <div className="coaching-description">
                                <h2 className="coaching-title">1. Why Coaching?</h2>
                                <p className='coaching-text'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                            </div>
                            <div className="coaching-card">
                                <p>Questa è una card con informazioni aggiuntive.</p>
                            </div>
                        </div>
                    </div>

                    <div className='why-nick' id='nick' ref={nickSectionRef}>
                        <video autoPlay loop muted>
                            <source src={bg2} type="video/mp4" />
                            Il tuo browser non supporta i video.
                        </video>
                        <div className="scroll-container">
                            <div className="cards-container">
                                {cardsData.map((card, index) => (
                                    <div className="scroll-item" key={index}>
                                        <div className="card">
                                            <i className={card.icon}></i>
                                            <h3>{card.title}</h3>
                                            <p>{card.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="why-nick-content">
                            <h2 className="coaching-title">2. Why Nick?</h2>
                            <p className="description" style={{color: 'white'}}>
                                Descrizione aggiuntiva qui se necessaria
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default LandingPage;
