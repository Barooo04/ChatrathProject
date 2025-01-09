import React, { useState, useEffect, useRef } from 'react';
import "./LandingPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Loader from '../Loader/Loader';
import logo from '../Images/chatrathLogo.png';
import hidev from "../Images/hi-dev.png";
import bg2 from "../Images/bg3.mp4";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Mousewheel, Pagination, Autoplay, Navigation } from 'swiper/modules';

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const menuRef = useRef(null);
    const closeButtonRef = useRef(null);

    const nickSectionRef = useRef(null);

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

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
                });
            }
        }, 150);
    };

    const stepsData = [
        {
            icon: "fas fa-star",
            title: "Step 1: Introduction",
            description: "This is the description for the first step."
        },
        {
            icon: "fas fa-rocket",
            title: "Step 2: Analysis",
            description: "This is the description for the second step."
        },
        {
            icon: "fas fa-brain",
            title: "Step 3: Development",
            description: "This is the description for the third step."
        },
        {
            icon: "fas fa-cogs",
            title: "Step 4: Implementation",
            description: "This is the description for the fourth step."
        },
        {
            icon: "fas fa-check",
            title: "Step 5: Feedback",
            description: "This is the description for the fifth step."
        },
    ];

    const testimonialsData = [
        {
            icon: "fas fa-user",
            name: "John Doe",
            profession: "Software Engineer",
            description: "This service has changed my life for the better!"
        },
        {
            icon: "fas fa-user",
            name: "Jane Smith",
            profession: "Product Manager",
            description: "An amazing experience, highly recommend!"
        },
        {
            icon: "fas fa-user",
            name: "Alice Johnson",
            profession: "UX Designer",
            description: "I learned so much and grew professionally."
        },
        {
            icon: "fas fa-user",
            name: "Bob Brown",
            profession: "Data Scientist",
            description: "A fantastic program that delivers results."
        },
        {
            icon: "fas fa-user",
            name: "Charlie Green",
            profession: "Marketing Specialist",
            description: "Incredible insights and support throughout."
        },
        {
            icon: "fas fa-user",
            name: "Diana White",
            profession: "Business Analyst",
            description: "I can't recommend this enough!"
        },
    ];

    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`landing-container ${!isLoading ? 'landing-appear' : ''}`}>
                    <nav className="navbar">
                        <img src={logo} alt="Logo" className="logo" onClick={() => moveTo('home')}/>
                        <ul>
                            <li><a className="ai-assistant" href="/login">Client Login</a></li>
                            <li><a className="contact-me" href="#contact-me">Request Coaching</a></li>
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
                        <p className='menu-item' onClick={() => moveTo('nick')}>2. Why Nick</p> 
                        <p className='menu-item' onClick={() => moveTo('how-ai-coaching-works')}>3. How AI coaching works</p>
                        <p className='menu-item' onClick={() => moveTo('testimonials')}>4. Testimonials</p>
                        <p className='menu-item'>5. Selecting the best coach</p>
                        <p className='menu-item'>6. Understanding The Threshold</p>
                    </div>

                    <div className="hero-section" id='home'>
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
                                <h3 className="coaching-title">WHY INTEGRATED AI-HUMAN COACHING?</h3>
                                <h2 className="coaching-subtitle">Supercharge your leadership effectiveness in a world that is having an AI moment.</h2>
                                <p className='coaching-text'>
                                    As AI accelerates, what need will there be for human leaders? Doomers think that AI will wipe out our species. Gloomers think the robots will take all our jobs. I’m a cautious Bloomer: we humans can inspire responsible, sustainable growth, during at least the medium term. In this context, leadership is the vital lever.
                                    <br /><br />
                                    AI-human coaching will help you explore the threshold across which you gain new leadership operating systems. You will gain leadership capabilities and mindsets useful for your increasingly integrated human-AI contexts.
                                </p>
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
                        <div className="wrapper">
                            <div className="card" style={{'--delay': '-1'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-star"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 1</span>
                                        <p>This is the content of the first card.</p>
                                    </div>

                                </div>
                                <a href="#">Follow</a>
                            </div>
                            <div className="card" style={{'--delay': '0'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-rocket"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 2</span>
                                        <p>This is the content of the second card.</p>
                                    </div>

                                </div>
                                <a href="#">Follow</a>
                            </div>
                            <div className="card" style={{'--delay': '1'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-brain"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 3</span>
                                        <p>This is the content of the third card.</p>
                                    </div>

                                </div>
                                <a href="#">Follow</a>
                            </div>
                            <div className="card" style={{'--delay': '2'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-cogs"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 4</span>
                                        <p>This is the content of the fourth card.</p>
                                    </div>

                                </div>
                                <a href="#">Follow</a>
                            </div>
                            <div className="card" style={{'--delay': '2'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-check"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 5</span>
                                        <p>This is the content of the first card.</p>
                                    </div>

                                </div>
                                <a href="#">Follow</a>
                            </div>
                        </div>
                        <div className="why-nick-content">
                            <h3 className="why-nick-title">WHY CHOOSE NICK AS YOUR COACH?</h3>
                            <h2 className="why-nick-subtitle">Unlock Your Potential with Personalized Coaching.</h2>
                            <p className="why-nick-text">
                                In a rapidly changing world, having a coach who understands your unique challenges is crucial. Nick brings a wealth of experience and a personalized approach to coaching that empowers you to reach your goals.
                                <br /><br />
                                With a focus on actionable strategies and continuous support, Nick helps you navigate the complexities of leadership and personal development. His coaching style is tailored to your needs, ensuring that you gain the insights and skills necessary to thrive in any environment.
                            </p>
                        </div>
                    </div>

                    <div className="how-ai-coaching-works" id='how-ai-coaching-works'>
                        <h2 className="coaching-title">How AI Coaching Works</h2>
                        <Swiper
                            direction={'vertical'}
                            slidesPerView={1}
                            spaceBetween={30}
                            mousewheel={true}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Mousewheel, Pagination]}
                            className="mySwiper"
                        >
                            {stepsData.map((step, index) => (
                                <SwiperSlide key={index}>
                                    <div className='step-item-content'>
                                        <i className={step.icon}></i>
                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="testimonials-section" id='testimonials'>
                        <h2 className="coaching-title">Testimonials</h2>
                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                              delay: 2500,
                              disableOnInteraction: false,
                            }}
                            pagination={{
                              clickable: true,
                            }}
                            navigation={true}
                            modules={[Autoplay, Pagination, Navigation]}
                            onAutoplayTimeLeft={onAutoplayTimeLeft}
                            className="myTestimonialsSwiper"
                        >
                            {testimonialsData.map((testimonial, index) => (
                                <SwiperSlide key={index} className='testimonial-ss'>
                                    <div className="testimonial-card">
                                        <div className="testimonial-icon">
                                            <i className={testimonial.icon}></i>
                                        </div>
                                        <h3>{testimonial.name}</h3>
                                        <p className="profession">{testimonial.profession}</p>
                                        <p className="testimonial-description">"{testimonial.description}"</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                            <div className="autoplay-progress" slot="container-end">
                                <svg viewBox="0 0 48 48" ref={progressCircle}>
                                    <circle cx="24" cy="24" r="20"></circle>
                                </svg>
                                <span ref={progressContent}></span>
                            </div>
                        </Swiper>
                    </div>
                </div>
            )}
        </>
    );
}

export default LandingPage;
