import React, { useState, useEffect, useRef } from 'react';
import "./LandingPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Loader from '../Loader/Loader';
import logo from '../Images/chatrathLogo.png';
import hidev from "../Images/hi-dev.png";
import bg2 from "../Images/bg3.mp4";
import bg3 from "../Images/how-ai2.mp4";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Squash as Hamburger } from 'hamburger-react'
import ImageContainer from '../LoginPage/ImageContainer/imageContainer';
import image1 from '../Images/duomo.jpg';
import image2 from '../Images/firenze1.jpg';
import image3 from '../Images/vista.jpg';

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const closeButtonRef = useRef(null);

    const nickSectionRef = useRef(null);


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
                const scrollPromise = new Promise((resolve) => {
                    section.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Funzione per controllare se lo scroll è completato
                    const checkIfScrollFinished = () => {
                        const rect = section.getBoundingClientRect();
                        // Consideriamo lo scroll completato quando la sezione è vicina al top della viewport
                        if (Math.abs(rect.top) < 50) {
                            resolve();
                        } else {
                            requestAnimationFrame(checkIfScrollFinished);
                        }
                    };
                    
                    checkIfScrollFinished();
                });

                // Chiudi il menu solo dopo che lo scroll è completato
                scrollPromise.then(() => {
                    setIsMenuOpen(false);
                });
            }
        }, 150);
    };

    
    const stepsData = [
        {
            icon: "fas fa-star",
            title: "Step 1: Introduction",
            description: "This is the description for the first step.",
        },
        {
            icon: "fas fa-rocket",
            title: "Step 2: Analysis",
            description: "This is the description for the second step.",
        },
        {
            icon: "fas fa-brain",
            title: "Step 3: Development",
            description: "This is the description for the third step.",
        },
        {
            icon: "fas fa-cogs",
            title: "Step 4: Implementation",
            description: "This is the description for the fourth step.",
        },
        {
            icon: "fas fa-check",
            title: "Step 5: Feedback",
            description: "This is the description for the fifth step.",
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

    
    const HorizontalScrollCarousel = () => {
        const targetRef = useRef(null);
        const { scrollYProgress } = useScroll({
            target: targetRef,
        });
        
        const x = useTransform(scrollYProgress, [0, 1], ["60%", "-50%"]);
        
        return (
            <section ref={targetRef} className="horizontal-scroll-section">
                    <div className="horizontal-scroll-overlay"></div>

                <video autoPlay loop muted>
                    <source src={bg3} type="video/mp4" />
                    Il tuo browser non supporta i video.
                </video>
                <div className="how-ai-coaching-works" id='how-ai-coaching-works'>
                    <div className="how-ai-coaching-works-content">
                        <h3 className="how-ai-coaching-works-title">HOW AI COACHING WORKS</h3>
                        <h2 className="how-ai-coaching-works-subtitle">Step 1: Introduction</h2>   
                        <p className="how-ai-coaching-works-text">
                            This is the content of the how-ai-coaching-works section.
                        </p>
                    </div>
                </div>
                <div className="horizontal-scroll-container">
                    <motion.div style={{ x }} className="horizontal-scroll-cards-wrapper">
                        {stepsData.map((card, index) => {
                            return <Card 
                                card={card} 
                                key={card.id} 
                                index={index}
                                totalCards={stepsData.length}
                            />;
                        })}
                    </motion.div>
                </div>
                <div className="horizontal-scroll-overlay-bottom"></div>
            </section>
        );
    };

    const Card = ({ card, index, totalCards }) => {
        // Colori neon di base (in formato HSL per facilitare l'interpolazione)
        const startColor = { h: 210, s: 100, l: 50 }; // Blu neon
        const endColor = { h: 60, s: 100, l: 50 };    // Giallo neon

        const getInterpolatedColor = (index, total) => {
            if (index === 0) return 'rgb(0, 123, 255)'; // Prima card: blu neon
            if (index === total - 1) return 'rgba(224, 255, 51, 1)'; // Ultima card: giallo neon
            
            // Calcola il colore intermedio
            const progress = index / (total - 1);
            const h = startColor.h + (endColor.h - startColor.h) * progress;
            return `hsl(${h}, 100%, 50%)`;
        };

        const cardColor = getInterpolatedColor(index, totalCards);

        return (
            <div 
                key={card.id} 
                className="horizontal-card"
                style={{
                    borderColor: cardColor,
                    boxShadow: `0 0 10px ${cardColor}80,
                             0 0 20px ${cardColor}40,
                             0 0 30px ${cardColor}20`,
                    '--card-color': cardColor, // Variabile CSS personalizzata
                    '&::before': {
                        backgroundColor: cardColor
                    }
                }}
            >
                <div className="horizontal-card-content">
                    <div className="card-icon">
                        <i className={card.icon}></i>
                    </div>
                    <div className="card-text">
                        <h3 className="horizontal-card-title">
                            {card.title}
                        </h3>
                        <p className="horizontal-card-description">
                            {card.description}
                        </p>
                    </div>
                </div>
            </div>
        );
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
                            <Hamburger size={30} toggle={setIsMenuOpen} toggled={isMenuOpen} color='white'/>
                        </ul>
                    </nav>
                    <div className={`menu-appear ${!isMenuOpen ? '' : 'view'}`}>
                        
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
                    <div className="why-nick-overlay-top"></div>

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
                                <a href="#i">Follow</a>
                            </div>
                            <div className="card" style={{'--delay': '0'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-rocket"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 2</span>
                                        <p>This is the content of the second card.</p>
                                    </div>

                                </div>
                                <a href="#i">Follow</a>
                            </div>
                            <div className="card" style={{'--delay': '1'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-brain"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 3</span>
                                        <p>This is the content of the third card.</p>
                                    </div>

                                </div>
                                <a href="#i">Follow</a>
                            </div>
                            <div className="card" style={{'--delay': '2'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-cogs"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 4</span>
                                        <p>This is the content of the fourth card.</p>
                                    </div>

                                </div>
                                <a href="#i">Follow</a>
                            </div>
                            <div className="card" style={{'--delay': '2'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-check"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 5</span>
                                        <p>This is the content of the first card.</p>
                                    </div>

                                </div>
                                <a href="#i">Follow</a>
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
                        <div className="why-nick-overlay-bottom"></div>

                    </div>

                    <HorizontalScrollCarousel />

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
