import React, { useState, useEffect, useRef } from 'react';
import "./LandingPage.css";
import "./LandingPageResponsive.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Squash as Hamburger } from 'hamburger-react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';

import Loader from '../Loader/Loader';
import logo from '../Images/chatrathLogo.png';
import logoSmall from '../Images/LogoSmall.png';

import trainline from "../Images/trainline.png";
import uss from "../Images/uss.png";
import spurgeons from "../Images/spurgeons.png";
import ua from "../Images/ua.png";
import iib from "../Images/iib.png";
import janssen from "../Images/janssen.png";
import jj from "../Images/jj.png";
import mony from "../Images/mony.png";
import moody from "../Images/moody.png";
import nhs from "../Images/nhs.png";
import pu from "../Images/pu.png";
import qb from "../Images/qb.png";

import card from "../Images/card-image.jpeg";

import bg2 from "../Images/bg3.mp4";
import bg3 from "../Images/how-ai2.mp4";
import bg4 from "../Images/bg4.mp4";
import book from "../Images/book.png";
import book2 from "../Images/book2.png";

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const nickSectionRef = useRef(null);
    
    useEffect(() => {
        // Simula un caricamento di 2 secondi
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const timeline = document.querySelector('.timeline-line');
            const timelineHeight = timeline.offsetHeight;
            const scrollPosition = window.scrollY + window.innerHeight / 1.5;
            const timelineTop = timeline.getBoundingClientRect().top + window.scrollY;
            
            let percentage = (scrollPosition - timelineTop) / timelineHeight;
            percentage = Math.min(Math.max(percentage, 0), 1); // Clamp between 0 and 1

            timeline.style.background = `linear-gradient(to bottom, #00f ${percentage * 100}%, #ccc ${percentage * 100}%)`;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
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
            title: "STEP 1: JOIN (weeks 1-2)",
            description: "To understand the process and set goals",
        },
        {
            icon: "fas fa-rocket",
            title: "STEP 2: KICK-OFF (weeks 3-4)",
            description: "To build accountability and form early habits",
        },
        {
            icon: "fas fa-brain",
            title: "STEP 3: IMPLEMENT (months 2-5)",
            description: "To experiment, embed habits and address additional opportunities and challenges",
        },
        {
            icon: "fas fa-cogs",
            title: "STEP 4: SUSTAIN SUCCESS (month 6)",
            description: "To set you up for sustainable success, independent of your coach",
        }
    ];
    

    const testimonialsData = [
        {
            name: "Charles",
            role: "Founder",
            description: "I came to Nick doing well but my communication wasn't cutting through.  Others have tried to coach me on this, but after ten minutes with Nick and I was ready to practice something new.  Seriously impressive as I'm used to people saying 'three bags full' to me. Nick stood toe to toe with me and gave me constructive, insightful, actionable input",
            location: "NA",
            sector: "Financial services"
        },
        {
            name: "Ana",
            role: "Partner",
            description: "I have succeeded as a lawyer in an almost 100% male context, but before working with Nick I felt overwhelmed and didn't feel like a leader.  I lacked confidence in engaging stakeholders, which led to me not sleeping, and getting anxious.  When I got anxious, I couldn't think properly, I couldn't breathe properly.  It blocked my mind.  Nick's coaching helped me break through to settled confidence that I have charisma and presence in my own way.  I became more emotionally connected.  Now I feel like a leader and I realize it is an amazing platform that I can use even more",
            location: "Europe",
            sector: "Professional Services"
        },
        {
            name: "Jos",
            role: "Leadership Development Manager",
            description: "Through leading a series of group coaching and leadership development programs, Nick helped us improve leadership productivity by 15% among hundreds of teams",
            location: "Europe",
            sector: "Semiconductors"
        },
        {
            name: "Susan",
            role: "BU head of HR",
            description: "Our environment is extremely high-pressure and we are tough raters.  Nick designed and delivered our highest-rated leadership program, 'Advanced Coaching'. All 75 participants in the most recent five cohorts rated the program 7/7 on 'value for time spent'",
            location: "UK",
            sector: "Professional Services"
        },
        {
            name: "Sajid",
            role: "Former Chancellor of the Exchequer",
            description: "'Extremely insightful' – in relation to a keynote I delivered about AI and leadership, in the UK parliament",
            location: "UK",
            sector: "Public Sector"
        },
        {
            name: "Khalid",
            role: "Project Manager",
            description: "I came to Nick with two problems to solve: an underperforming support team, and my poor time management.  Through Nick's tech-fuelled coaching, my leadership team learned how to say no to more, we improved alertness, productivity and focus, and the team's satisfaction rose",
            location: "MENA",
            sector: "Technology"
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
                        <p className="how-ai-coaching-works-text" style={{width: '80%', marginLeft: '10%'}}>
                        Save 10% of time per week, fix underperforming teams, increase your leaders' or managers' contribution, and enhance their mindsets.
                        We offer a six-month coaching program delivered by Nick and AI coaches.  The program is for a group of up to five people.  Why choose integrated AI and Human Coaching?
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
                        <img src={logoSmall} alt="Logo" className="logo-mobile" onClick={() => moveTo('home')}/>
                        <ul>
                            <li><a className="ai-assistant" href="/dashboard"><span>Client</span> Login</a></li>
                            <li><a className="contact-me" href="#contact-me">Book a call</a></li>
                            <Hamburger size={30} toggle={setIsMenuOpen} toggled={isMenuOpen} color='white'/>
                        </ul>
                    </nav>
                    <div className={`menu-appear ${!isMenuOpen ? '' : 'view'}`}>
                        
                                    <p className='menu-item' onClick={() => moveTo('coaching')}>1. Why Coaching</p>
                                    <p className='menu-item' onClick={() => moveTo('nick')}>2. Why Nick</p> 
                                    <p className='menu-item' onClick={() => moveTo('how-ai-coaching-works')}>3. How AI coaching works</p>
                                    <p className='menu-item' onClick={() => moveTo('testimonials')}>4. Testimonials</p>
                                    <p className='menu-item' onClick={() => moveTo('understand-threshold')}>5. Understanding The Threshold</p>
                                    <p className='menu-item' onClick={() => moveTo('best-coaching-program')}>6. Selecting the best coach</p>   
                                    <p className='menu-item' onClick={() => moveTo('responsible-ai')}>7. Responsible AI</p>
                           
                        
                    </div>

                    <div className="hero-section" id='home'>
                        <div className="hero-overlay">
                            <h1 className='hero-title' id="title">Integrated AI-human Leadership Coaching</h1>
                            <p className='hero-subtitle'>Accomplish your next level of success and satisfaction:
                            </p>
                            <ul className='hero-subtitle'>
                                <li>Create more time for what matters</li>
                                <li>Inspire a higher-performing team around you</li>
                                <li>Generate more business value</li>
                                <li>Access a better mindset</li>
                            </ul>
                        </div>
                        <div className="logo-slider">
                            <div className="slider">
                                <img src={trainline} alt="Trainline" />
                                <img src={uss} alt="USS" />
                                <img src={spurgeons} alt="Spurgeons" />
                                <img src={ua} alt="UA" />
                                <img src={iib} alt="IIB" />
                                <img src={janssen} alt="Janssen" />
                                <img src={jj} alt="JJ" />
                                <img src={mony} alt="Mony" />
                                <img src={moody} alt="Moody" />
                                <img src={nhs} alt="NHS" />
                                <img src={pu} alt="PU" />
                                <img src={qb} alt="QB" />

                                <img src={trainline} alt="Trainline" />
                                <img src={uss} alt="USS" />
                                <img src={spurgeons} alt="Spurgeons" />
                                <img src={ua} alt="UA" />
                                <img src={iib} alt="IIB" />
                                <img src={janssen} alt="Janssen" />
                                <img src={jj} alt="JJ" />
                                <img src={mony} alt="Mony" />
                                <img src={moody} alt="Moody" />
                                <img src={nhs} alt="NHS" />
                                <img src={pu} alt="PU" />
                                <img src={qb} alt="QB" />
                            </div>
                        </div>
                    </div>
                    <div className='why-coaching' id='coaching'>
                        <div className="coaching-content">
                            <div className="coaching-description">
                                <h3 className="coaching-title">WHY INTEGRATED AI-HUMAN COACHING?</h3>
                                <h2 className="coaching-subtitle">Supercharge your team's effectiveness in a world that is increasingly AI-fueled</h2>
                                <p className='coaching-text'>
                                As AI accelerates, what need will there be for human leaders?  Doomers think that AI will wipe out our species.  Gloomers think the robots will take all our jobs.  Bloomers are more optimistic, seeing the disruption and taking the view that AI can unlock unprecedented human flourishing.
                                    <br /><br />
                                    I'm a cautious Bloomer: we humans can inspire responsible, sustainable growth, at least during the medium term.  In this context, leadership and teamwork are vital levers.  AI-human coaching will help your leaders explore the threshold across which you gain new leadership operating systems.  Participants will gain leadership capabilities and mindsets useful for your increasingly integrated human-AI contexts.
                                </p>
                            </div>
                            <div className="coaching-card">
                                <img src={card} alt="Descrizione dell'immagine" />
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
                                        <span className="title">Time</span>
                                        <p>Save time and create energy for what matters most</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{'--delay': '0'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-rocket"></i></div>
                                    <div className="details"> 
                                        <span className="title">Team</span>
                                        <p>Improve team performance</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{'--delay': '1'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-brain"></i></div>
                                    <div className="details"> 
                                        <span className="title">Mindset</span>
                                        <p>Address mindsets such as being too controlling, protective or people-pleasing</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{'--delay': '2'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-cogs"></i></div>
                                    <div className="details"> 
                                        <span className="title">Purpose</span>
                                        <p>Connect your work with your purpose</p>
                                    </div>

                                </div>
                            </div>
                            <div className="card" style={{'--delay': '3'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-check"></i></div>
                                    <div className="details"> 
                                        <span className="title">Contribution</span>
                                        <p>Add more value to your organization</p>
                                    </div>

                                </div>
                            </div>
                            <div className="card" style={{'--delay': '3'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-check"></i></div>
                                    <div className="details"> 
                                        <span className="title">AI</span>
                                        <p>Leverage always-on AI coaches, including a custom AI coach only for you</p>
                                    </div>

                                </div>
                            </div>
                            <div className="card" style={{'--delay': '3'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-check"></i></div>
                                    <div className="details"> 
                                        <span className="title">Integrated</span>
                                        <p>Benefit from LLMs configured via human-in-the-loop coding and training</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="why-nick-content">
                            <h3 className="why-nick-title">WHY NICK</h3>
                            <h2 className="why-nick-subtitle">Unlock Your Potential with Personalized Coaching.</h2>
                            <p className="why-nick-text">
                            I'm Nick Chatrath. I'm delighted you're here, because you and I are very
                            similar. We are both trying to perform as well as we can and have a
                            positive impact on the world around us, while enjoying life.

                                <br /><br />
                                I work with leaders who are looking for their next level of success. I'm a human Venn Diagram, operating at the intersection of business, technology and human transformation.  Learn more about my journey here.  I'm here on
                                <a href="https://www.linkedin.com/in/nickchatrath/" target="_blank" className="linkedin-link"> LinkedIn</a> too.
                                I recently summarised all the feedback I have received as a coach in the past few years, and was surprised by the results. Clients view me as a practical, energetic, observant, forensically positive, caring, challenging coach who kick-starts profound and lasting change.  They also appreciate the wide ranges of tools I bring to bear.
                            </p>
                        </div>
                        <div className="wrapper-mobile">
                            <div className="card" style={{'--delay': '-1'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-star"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 1</span>
                                        <p>This is the content of the first card.</p>
                                    </div>

                                </div>
    
                            </div>
                            <div className="card" style={{'--delay': '0'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-rocket"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 2</span>
                                        <p>This is the content of the second card.</p>
                                    </div>

                                </div>
    
                            </div>
                            <div className="card" style={{'--delay': '1'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-brain"></i></div>
                                    <div className="details"> 
                                        <span className="title">Card 3</span>
                                        <p>This is the content of the third card.</p>
                                    </div>

                                </div>
    
                            </div>
                            <div className="card" style={{'--delay': '2'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-cogs"></i></div>
                                    <div className="details"> 
                                        <span className="title" >Card 4</span>
                                        <p>This is the content of the fourth card.</p>
                                    </div>

                                </div>
    
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
                        <div className="why-nick-overlay-bottom"></div>

                    </div>

                    <HorizontalScrollCarousel />
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
                        <div className="steps-container" style={{maxWidth: '80%'}}>
                            <h3 className="how-ai-coaching-works-title-2">STEP 1: JOIN (Weeks 1-2)</h3>
                            <p className="how-ai-coaching-works-text" style={{color: 'rgb(173, 173, 173)'}}>
                                Each participant completes their intake and goal-setting process:<br />
                                - Complete onboarding videos and reflections<br />
                                - Submit intake forms<br />
                                - Participate in 1:1 goal-setting and tracking meeting with Nick<br />
                                - Participate in 1:1 goal-setting and tracking meeting with Nick
                            </p>    
                        </div>
                        <div className="steps-container" style={{maxWidth: '80%'}}>
                            <h3 className="how-ai-coaching-works-title-2">STEP 2: KICK-OFF (Weeks 3-4)</h3>
                            <p className="how-ai-coaching-works-text" style={{color: 'rgb(173, 173, 173)'}}>
                                Threshold develops and releases two types of AI coaches:<br />
                                - A custom AI coach for each participant.  No other participant sees your custom AI coach, which incorporates your name, goals and preferences.<br />
                                - Dozens of generic AI coaches, including "How do I improve mental focus?" "How do I lead situationally?" and "How do I master conflict?"<br />
                                The group attends Masterclass I: Lead Self (live with Nick, only for your group).<br />
                                Each participant submits a Virtual Check-In to Nick, receiving custom feedback the next day (via WhatsApp, email or Video depending on individual preference)
                            </p>    
                        </div>
                        <div className="steps-container" style={{maxWidth: '80%'}}>
                            <h3 className="how-ai-coaching-works-title-2">STEP 3: IMPLEMENT (Months 2-5)</h3>
                            <p className="how-ai-coaching-works-text" style={{color: 'rgb(173, 173, 173)'}}>
                            The group attends Masterclass II: Lead others (live with Nick, only for your group).<br />
                            Each participant:<br />
                            - Submits two Virtual Check-Ins per month to Nick, receiving custom feedback the next day (via WhatsApp, email or Video depending on individual preference)<br />
                            - Completes Capability Builds 1, 2 and 3 (recorded workshops on Productivity Through Stillness, Thinking Independently and Leading in Complexity; these Capability Builds integrate with the Virtual Check-Ins)
                            Threshold updates each participant's custom AI coach based on their Virtual Check-In feedback.
                            </p>    
                        </div>
                        <div className="steps-container" style={{maxWidth: '80%'}}>
                            <h3 className="how-ai-coaching-works-title-2">STEP 4: SUSTAIN SUCCESS (Month 6)</h3>
                            <p className="how-ai-coaching-works-text" style={{color: 'rgb(173, 173, 173)'}}>
                            Month 6: Wrap-up of six-month program, including feedback
                            Each participant completes Capability Build 4 (the 77 Minute Program, which sets them up for sustained action planning aligned to your purpose)
                            The group attends Masterclass III: Lead others part 2, or Lead organization:<br />
                            - Topic depending on your context<br />
                            - This Masterclass is live with Nick and only for your group<br />
                            - This masterclass also includes goal-setting, leveraging the 77 Minute Program and setting you up for sustained success<br />
                            Each participant submits feedback, including about impact made
                            </p>    
                        </div>
                    </div>

                    <div className="testimonials-section" id='testimonials'>
                        <div className="testimonials-content">
                            <h3 className="testimonials-title">TESTIMONIALS</h3>
                            <h2 className="testimonials-subtitle">What Our Clients Say</h2>
                            <p className="testimonials-text">
                                Our clients have experienced significant improvements in their leadership effectiveness and personal development.
                            </p>
                        </div>
                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                              delay: 15000,
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
                                        <h3>{testimonial.name}, {testimonial.role}</h3>
                                        <p className="profession">{testimonial.sector}, {testimonial.location}</p>
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

                    <div className="understand-threshold" id='understand-threshold'>
                        <div className="understand-threshold-image">
                            <img src={book} alt="Understand the Threshold" />
                        </div>
                        <div className="understand-threshold-content">
                            <h3 className="understand-threshold-title">UNDERSTANDING THE THRESHOLD</h3>
                            <h2 className="understand-threshold-subtitle">What is the threshold?</h2>
                            <p className="understand-threshold-text">
                                The Threshold is an inspiring and practical framework for how you can thrive as a leader in the Age of AI, by nurturing the qualities that make you uniquely human
                                Available at good book shops
                            </p>                            <div className="understand-threshold-image-mobile">
                                <img src={book} alt="Understand the Threshold" />
                            </div>
                        </div>
                    </div>
                    <div className="understand-threshold" id='understand-threshold'>
                        <div className="understand-threshold-content">
                            <h3 className="understand-threshold-title">UNDERSTANDING THE THRESHOLD</h3>
                            <h2 className="understand-threshold-subtitle">What are the four pathways to the Threshold?</h2>
                            <p className="understand-threshold-text">
                                - Cultivating stillness: Create spaces where productivity and silence meet<br />
                                - Embodying intelligence: Machines are not made of flesh, and this fact matters more than we think.  Leverage this insight daily<br />
                                - Thinking independently: Move beyond subservient, derivative or superficial thinking, and bring your finest humanity to how you and your teams think<br />
                                - Maturing consciousness: Leadership excellence will increasingly be fueled not only by skill and mindset, but also by stage of adult psychological development.  Master higher-order styles of leadership to navigate ambiguity and complexity well
                            </p>                            <div className="understand-threshold-image-mobile">
                                <img src={book} alt="Understand the Threshold" />
                            </div>
                        </div>
                        <div className="understand-threshold-image">
                            <img src={book2} alt="Understand the Threshold" />
                        </div>
                    </div>

                    <div className="best-coaching-program" id='best-coaching-program'>
                        <div className="best-coaching-program-content">
                            <h3 className="best-coaching-program-title"> SELECTING YOUR BEST COACHING PROGRAM</h3>
                            <h2 className="best-coaching-program-subtitle">Finding and working with the<br/> <span className="best-coaching-program-subtitle-span">Best Leadership Coaching Program</span></h2>
                            <p className="best-coaching-program-text">Choosing the best leadership coaching program is a pivotal decision that can redefine your growth, performance, and influence. The right program doesn't just provide guidance—it empowers you to unlock potential, overcome challenges, and achieve extraordinary results. Finding that ideal program requires thoughtful consideration. </p>
                        </div>
                        <div className="time-line">
                            <div className="timeline-container">
                                <div className="timeline-line"></div>
                                <div className="timeline-element left">
                                    <div className="timeline-content">
                                        <h4><span>1.</span> Define What You Need</h4>
                                        <p>Start by reflecting on your goals and key needs. Has your company recently scaled, giving you a group of recently promoted high-performing tech-or-IQ-focused Individual Contributors, newly thrust into management yet lacking EQ skills? Do you have teams mired in conflict, lack of trust or inattention to results? Do you want to support leaders navigating a complex professional challenge? Consider whether a mix of 1:1 coaching, group learning, and innovative tools fits your needs.  
                                        Think practically. Do you need flexibility, expertise in a specific area, or coaching that integrates cutting-edge AI technology with human wisdom? Understanding these priorities will set the foundation for choosing a program that delivers transformational results.</p>
                                    </div>
                                </div>
                                <div className="timeline-element right">
                                    <div className="timeline-content">
                                        <h4><span>2.</span> Do Your Research</h4>
                                        <p>electing a coaching program is like hiring a top-tier consultant—it requires diligence. Look for programs with proven results, diverse methodologies, and testimonials from leaders who've achieved breakthroughs in situations like yours.  
                                        Explore the program's structure. Does it offer personalized support, group dynamics for collaborative growth, and tools to track progress? Evaluate the balance of human and AI-driven coaching to ensure the program aligns with your style and goals</p>
                                    </div>
                                </div>
                                <div className="timeline-element left">
                                    <div className="timeline-content">
                                        <h4><span>3.</span> Assess the Fit</h4>
                                        <p>Compatibility matters. Meet with the program leader or coaching team to understand their approach, vision, and commitment to your success. Look for programs that challenge you constructively, inspire growth, and align with your leadership aspirations.</p>
                                    </div>
                                </div>
                                <div className="timeline-element right">
                                    <div className="timeline-content">
                                        <h4><span>4.</span> Why Threshold Coaching Stands Above the Rest</h4>
                                        <p>At Threshold Coaching, we combine personalized human insight with the power of AI to deliver a transformational group coaching experience: <br />
•⁠  Holistic Leadership Mastery:* Our unique program blends decades of leadership expertise with innovative methods to meet the demands of modern leadership – at the levels of lead self, lead others and lead organization.  <br />
•⁠  A Multi-Faceted Approach:* Enjoy 1:1 coaching, group coaching, AI-powered insights, and masterclasses designed to expand your thinking, refine your skills and enhance your mindsets.  
•⁠  Real, Measurable Results:* Whether your challenge is time, team, money, or mindset, we deliver coaching that creates lasting impact.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="responsible-ai" id='responsible-ai'>
                        <video src={bg4} autoPlay loop muted playsInline className="responsible-ai-video"></video>
                        <div className="responsible-ai-content">
                            <h3 className="responsible-ai-title">RESPONSIBLE AI</h3>
                            <p className="responsible-ai-text">
                                At Threshold Coaching, we believe in the transformative potential of AI to empower leaders while keeping humanity at the heart of every interaction. Our commitment to responsible AI ensures that our coaching solutions are not only innovative but also ethical, safe, and inclusive.
                                For example:
                            </p>
                            <div className="responsible-ai-cards">
                                <div className="responsible-ai-card">
                                    <p>We sign up to generally recognised principles of data privacy and responsible AI, including the Microsoft Responsible AI Standard (v2, June 2022), the International Standard ISO/IEC 42001 (2023) and ML Commons AI benchmarks for general-purpose AI chat models.</p>
                                </div>
                                <div className="responsible-ai-card">
                                    <p>We combine advanced AI technology with human judgment forged over decades of leadership development, creating a testing process that is transparent, secure, and profoundly effective.</p>
                                </div>
                                <div className="responsible-ai-card">
                                    <p>We pay close attention to potential biases in prompt, testing and deployment, enabling growth that is both meaningful and responsible.</p>
                                </div>
                                <div className="responsible-ai-card">
                                    <p>We regularly review our model selection, to ensure that underlying tools align with positive human values. Your growth deserves nothing less.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer">
                        <div className="footer-content">
                            <h1>Let's grow your impact!</h1>
                            <p>Threshold Development Ltd. | Company number 15862633</p>
                        </div>
                    </div>
                    <div className="footer-privacy-credits">
                        <p>Privacy Policy</p>
                        <p>|</p>
                        <p>Hidev</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default LandingPage;
