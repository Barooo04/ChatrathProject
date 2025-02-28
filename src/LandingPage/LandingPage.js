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
import logo from '../Images/logonick.png';

import nick1 from "../Images/FOTO1.jpg";
import nick1Responsive from "../Images/Foto1Responsive.jpg";

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
import book2 from "../Images/FOTO4.jpg";

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const nickSectionRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);
    
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

    const moveTo = (id, offset = 100) => {
        setTimeout(() => {
            const section = document.getElementById(id);
            if (section) {
                const scrollPromise = new Promise((resolve) => {
                    let scrollPosition;

                    if (id === 'responsible-ai') {
                        scrollPosition = document.body.scrollHeight - window.innerHeight;
                    } else {
                        const rect = section.getBoundingClientRect();
                        scrollPosition = window.scrollY + rect.top - offset;
                    }

                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });

                    // Funzione per controllare se lo scroll è completato
                    const checkIfScrollFinished = () => {
                        if (id === 'responsible-ai') {
                            // Controlla se siamo in fondo alla pagina
                            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 1) {
                                resolve();
                            } else {
                                requestAnimationFrame(checkIfScrollFinished);
                            }
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
            description: "Understand the process and set goals",
            text: "Each participant completes their intake and goal-setting process:<br />- Onboarding videos and reflections<br />- Intake forms<br />- 1:1 goal-setting and tracking meeting with Nick<br />- Participate in 1:1 goal-setting and tracking meeting with Nick",
        },
        {
            icon: "fas fa-rocket",
            title: "STEP 2: KICK-OFF (weeks 3-4)",
            description: "Build accountability, understand limiting mindsets and form habits",
            text: "Threshold coaching develops and releases two types of AI coaches: <br />- A custom AI coach private to each participant<br />- Dozens of generic AI coaches, including 'How do I improve mental focus?' 'How do I lead situationally?' and 'How do I master conflict?'<br /><br/>- Your group attends Masterclass I: Lead Self (live with Nick)<br />- Individually, you submit a Virtual Check in, with Nick providing custom<br />feedback the next day (via WhatsApp, email or Video depending on individual<br />preference)"
        },
        {
            icon: "fas fa-brain",
            title: "STEP 3: IMPLEMENT (months 2-5)",
            description: "Experiment, embed habits and address additional mindset and capabilities",
            text: "Your group attends Masterclass II: Lead others (live with Nick). Individually:<br />- Submit two Virtual Check-Ins per month to Nick, receiving custom feedback<br />the next day (via WhatsApp, email or Video depending on individual preference)<br /><br />- Complete Capability Builds 1, 2 and 3 (recorded workshops on Productivity<br />Through Stillness, Thinking Independently and Leading in Complexity; these Capability Builds integrate with the Virtual Check-Ins)<br />Threshold Coaching updates your custom AI coach based on your Virtual<br />Check-In feedback.",
        },
        {
            icon: "fas fa-cogs",
            title: "STEP 4: SUSTAIN SUCCESS (month 6)",
            description: "Set up for sustained success, independent of your coaches",
            text: "Wrap-up of six-month program, including feedback<br />Individually Complete Capability Build 4 (the 77 Minute Program, which sets<br />you up for sustained action planning aligned to your purpose)<br />As a group, attend Masterclass III: <br />- Lead others part 2, or Lead organization (topic depending on your context)<br />- Set goals for your next phase, leveraging the 77 Minute Program<br />- Submit feedback, including about impact made",
        }
    ];
    

    const testimonialsData = [
        {
            name: "Luna",
            role: "Executive Director",
            description: "Before working with Nick, I was highly logical and driven but I didn't show emotion much and struggled to connect with my team. I needed to be more flexible, and just be more human. After just two hours of coaching, my team became more open, engagement deepened, and our overall trajectory improved. I now lead with both logic and emotion—creating stronger bonds and better results. In just two months, our departmental ARR doubled, and I attribute $2–3M of this directly to Nick's leadership coaching input.",
            location: "Asia-Pacific",
            sector: "Financial services"
        },
        {
            name: "Charles",
            role: "Founder",
            description: "I came to Nick doing well but my communication wasn't cutting through.  Others have tried to coach me on this, but after ten minutes with Nick I was ready to practice something new.  Seriously impressive as I'm used to people saying 'three bags full' to me. Nick stood toe to toe with me and gave me constructive, insightful, actionable input",
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
            name: "Susanne",
            role: "Leadership Development Manager",
            description: "Through leading a series of group coaching and leadership development programs, Nick helped us improve leadership productivity by 15% among hundreds of teams",
            location: "Europe",
            sector: "Semiconductors"
        },
        {
            name: "Susan",
            role: "Business Unit Head of HR",
            description: "Our environment is extremely high-pressure and we are tough raters.  Nick designed and delivered our highest-rated leadership program, 'Advanced Coaching'. All 75 participants in the most recent five cohorts rated the program 7/7 on 'value for time spent'",
            location: "UK",
            sector: "Professional Services"
        },
        {
            name: "Sajid",
            role: "Former Chancellor of the Exchequer",
            description: '"Extremely insightful" - in relation to a keynote Nick delivered about AI and leadership, in the UK parliament',
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
        
        const x = useTransform(scrollYProgress, [0, 1], ["60%", "-30%"]);
        
        return (
            <section ref={targetRef} className="horizontal-scroll-section">
                    <div className="horizontal-scroll-overlay"></div>

                <video autoPlay loop muted preload='none'>
                    <source src={bg3} type="video/mp4" />
                    Il tuo browser non supporta i video.
                </video>
                <div className="how-ai-coaching-works" id='how-ai-coaching-works'>
                    <div className="how-ai-coaching-works-content">
                        <h3 className="how-ai-coaching-works-title">How AI Business Scaling works</h3>
                        <p className="how-ai-coaching-works-text" style={{width: '80%', marginLeft: '10%', fontSize: '1.2rem'}}>
                            Save 10% of time per week, fix underperforming teams, increase your leaders' or managers' contribution, and enhance their mindsets.<br />
                            We offer a six-month coaching program delivered by Nick and AI coaches.<br />
                            The program is for a group of up to five people.
                        </p>
                    </div>
                </div>
                <div className="horizontal-scroll-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
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


    const startColor = { h: 210, s: 100, l: 50 }; // Blu neon
    const endColor = { h: 60, s: 100, l: 50 }; 

    const getInterpolatedColor = (index, total) => {
        if (index === 0) return 'rgb(0, 123, 255)'; // Prima card: blu neon
        if (index === total - 1) return 'rgba(224, 255, 51, 1)'; // Ultima card: giallo neon
        
        // Calcola il colore intermedio
        const progress = index / (total - 1);
        const h = startColor.h + (endColor.h - startColor.h) * progress;
        return `hsl(${h}, 100%, 50%)`;
    };

    const Card = ({ card, index, totalCards }) => {
        // Colori neon di base (in formato HSL per facilitare l'interpolazione)
   // Giallo neon

        const cardColor = getInterpolatedColor(index, totalCards);

        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'left', gap: '2.5vh'}}>
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
                <div className="steps-container">
                    <h3 className="how-ai-coaching-works-title-2">{card.title}</h3>
                    <p className="how-ai-coaching-works-text" style={{color: 'rgb(173, 173, 173)'}}
                       dangerouslySetInnerHTML={{ __html: card.text }}
                    />    
                </div>
            </div>
        );
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openPopup = (step) => {
        setSelectedStep(step);
    };

    const closePopup = () => {
        setSelectedStep(null);
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`landing-container ${!isLoading ? 'landing-appear' : ''}`}>
                    <nav className="navbar">
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0px'}}>
                            <img src={logo} alt="Logo" className="logo" onClick={() => moveTo('home')}/>
                            <img src={logo} alt="Logo" className="logo-mobile" onClick={() => moveTo('home')}/>
                            <p style={{color: 'white', fontSize: '1rem', fontWeight: 'bold', fontFamily: 'Palatino Linotype'}}>Threshold</p>
                        </div>
                        <ul>
                            <li><a className="ai-assistant" href="/dashboard"><span>Client</span> Login</a></li>
                            <li><a className="contact-me" href="#contact-me" onClick={openModal}>Book a Call</a></li>
                            <Hamburger size={30} toggle={setIsMenuOpen} toggled={isMenuOpen} color='white'/>
                        </ul>
                    </nav>
                    <div className={`menu-appear ${!isMenuOpen ? '' : 'view'}`}>
                        
                                    <p className='menu-item' onClick={() => { moveTo('coaching'); setIsMenuOpen(false); }}>1. Why integrated AI-Human coaching</p>
                                    <p className='menu-item' onClick={() => { moveTo('nick'); setIsMenuOpen(false); }}>2. Why Nick</p> 
                                    <p className='menu-item' onClick={() => { moveTo('how-ai-coaching-works'); setIsMenuOpen(false); }}>3. How AI Business Scaling works</p>
                                    <p className='menu-item' onClick={() => { moveTo('testimonials'); setIsMenuOpen(false); }}>4. Testimonials</p>
                                    <p className='menu-item' onClick={() => { moveTo('understand-threshold'); setIsMenuOpen(false); }}>5. Understanding The Threshold</p>
                                    <p className='menu-item' onClick={() => { moveTo('best-coaching-program'); setIsMenuOpen(false); }}>6. Selecting the best coaching program</p>   
                                    <p className='menu-item' onClick={() => { moveTo('responsible-ai'); setIsMenuOpen(false); }}>7. Responsible AI</p>
                           
                        
                    </div>

                    {isModalOpen && (
                        <div className="overlay">
                            <div className="modal-card">
                                <span className="close" onClick={closeModal}>&times;</span>
                                <iframe
                                    src="https://form.typeform.com/to/asaYLGla"
                                    title="Book a call"
                                    width="100%"
                                    height="500px"
                                    frameBorder="0"
                                    allow="camera; microphone; autoplay; encrypted-media;"
                                ></iframe>
                            </div>
                        </div>
                    )}

                    <div className="hero-section" id='home'>
                        <div className="hero-overlay-top"></div>
                        <div className="hero-overlay-bottom"></div>
                        <img src={nick1} alt="Nick" className="hero-image" />
                        <img src={nick1Responsive} alt="Nick" className="hero-image-mobile" />
                        <div className="hero-overlay">
                            <h1 className='hero-title' id="title">Integrated AI-Human Business Scaling<br /></h1>
                            <p className='hero-subtitle'>Founders: Scale your business and along the way accomplish this:
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
                                <h3 className="coaching-title">WHY INTEGRATED AI-HUMAN BUSINESS SCALING?</h3>
                                <h2 className="coaching-subtitle">Supercharge your team's effectiveness in a world that is increasingly AI-fueled</h2>
                                <p className='coaching-text'>
                                    As AI accelerates, what need will there be for human leaders?<br />
                                    Doomers think that AI will wipe out our species.<br />
                                    Gloomers think the robots will take all our jobs.<br />
                                    Bloomers are more optimistic, seeing the disruption and taking the view that AI can unlock unprecedented human flourishing.
                                    <br /><br />
                                    I'm a cautious Bloomer: we humans can inspire responsible, sustainable growth, at least during the medium term.<br />
                                    From chess to fraud detection to dermatology and beyond, AI-Human integration has outperformed AI-only or human-only approaches. Similarly, your business can grow significantly by harnessing the combined power of AI and humanity, rather than just one of these in isolation.<br /><br />
                                    An AI-Human coaching program will help your leaders gain new leadership operating
                                    systems, crossing the threshold to a more effective way of working.<br />
                                    You will gain leadership capabilities and mindsets useful for scaling your business.
                                </p>
                            </div>
                            <div className="coaching-card">
                                <img src={card} alt="Descrizione dell'immagine" />
                            </div>
                        </div>
                    </div>

                    <div className='why-nick' id='nick' ref={nickSectionRef}>
                    <div className="why-nick-overlay-top"></div>

                        <video autoPlay loop muted style={{opacity: 0.3}}>
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
                                    <div className="img"><i className="fas fa-chart-line"></i></div>
                                    <div className="details"> 
                                        <span className="title">Contribution</span>
                                        <p>Add more value to your organization</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{'--delay': '4'}}>
                                <div className="content">
                                    <div className="img"><i className="fas fa-robot"></i></div>
                                    <div className="details"> 
                                        <span className="title">AI</span>
                                        <p>Leverage always-on AI coaches, including a custom AI coach only for you</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{'--delay': '4'}}>
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
                            <h2 className="why-nick-subtitle">Unlock your business's potential with personalized, techno-human coaching.</h2>
                            <p className="why-nick-text">
                                I'm Nick Chatrath.<br />
                                I'm delighted you're here, because you and I are very similar. <br />
                                We are both trying to perform as well as we can and have a positive impact on the world around us, while enjoying life.
                                <br /><br />
                                I'm a human Venn Diagram, operating at the intersection of business, technology and human transformation. <br/>
                                Find me here on <a href="https://www.linkedin.com/in/nickchatrath/" target="_blank" rel="noopener noreferrer" className="linkedin-link"> LinkedIn</a>. I also deploy over 50 AI operator bots to coach you too, to the extent you want.<br/><br/>
                                Who benefits most from working with me?  Founders, other leaders and managers and leaders who are looking for their next level of success.<br/>
                                I recently summarised all the feedback I have received as a coach in the past few years, and was surprised by the results: Clients view me as a practical, energetic, observant, forensically positive, caring, challenging coach who kick-starts profound and lasting change.<br/> 
                                They also appreciate the wide ranges of tools I bring to bear.
                            </p>
                            <p className="why-nick-text-mobile">
                                I'm Nick Chatrath.<br />
                                I'm delighted you're here, because you and <br/> I are very similar. <br />
                                We are both trying to perform as well as we can and have a positive impact on the world around us, <br/>while enjoying life.
                                <br /><br />
                                I'm a human Venn Diagram, operating at the intersection of business, technology and human transformation. <br/>
                                Find me here on <a href="https://www.linkedin.com/in/nickchatrath/" target="_blank" rel="noopener noreferrer" className="linkedin-link"> LinkedIn</a>. I also deploy over 50 AI operator bots to coach you too, to the extent you want.<br/><br/>
                                Who benefits most from working with me?  Founders, other leaders and managers and leaders who are looking for their next level of success.<br/>
                                I recently summarised all the feedback I have received as a coach in the past few years, and was surprised by the results: Clients view me as a practical, energetic, observant, forensically positive, caring, challenging coach who kick-starts profound and lasting change.<br/> 
                                They also appreciate the wide ranges of tools <br/> I bring to bear.
                            </p>
                        </div>
                        <div className="wrapper-mobile">
                            <Swiper
                                spaceBetween={30}
                                centeredSlides={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                navigation={true}
                                modules={[Autoplay, Pagination, Navigation]}
                                className='myCardSwiper'
                            >
                                <SwiperSlide>
                                    <div className="card">
                                        <div className="content">
                                            <div className="img"><i className="fas fa-star"></i></div>
                                            <div className="details"> 
                                                <span className="title-card-mobile">Time</span>
                                                <p className="text-card-mobile">Save time and create energy for what matters most</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="card">
                                        <div className="content">
                                            <div className="img"><i className="fas fa-rocket"></i></div>
                                            <div className="details"> 
                                                <span className="title-card-mobile">Team</span>
                                                <p className="text-card-mobile">Improve team performance</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="card">
                                        <div className="content">
                                            <div className="img"><i className="fas fa-brain"></i></div>
                                            <div className="details"> 
                                                <span className="title-card-mobile">Mindset</span>
                                                <p className="text-card-mobile">Address mindsets such as being too controlling, protective or people-pleasing</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="card">
                                        <div className="content">
                                            <div className="img"><i className="fas fa-cogs"></i></div>
                                            <div className="details"> 
                                                <span className="title-card-mobile">Purpose</span>
                                                <p className="text-card-mobile">Connect your work with your purpose</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="card">
                                        <div className="content">
                                            <div className="img"><i className="fas fa-chart-line"></i></div>
                                            <div className="details"> 
                                                <span className="title-card-mobile">Contribution</span>
                                                <p className="text-card-mobile">Add more value to your organization</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="card">
                                        <div className="content">
                                            <div className="img"><i className="fas fa-robot"></i></div>
                                            <div className="details"> 
                                                <span className="title-card-mobile">AI</span>
                                                <p className="text-card-mobile">Leverage always-on AI coaches, including a custom AI coach only for you</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="card">
                                        <div className="content">
                                            <div className="img"><i className="fas fa-check"></i></div>
                                            <div className="details"> 
                                                <span className="title-card-mobile">Integrated</span>
                                                <p className="text-card-mobile">Benefit from LLMs configured via human-in-the-loop coding and training</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                        <div className="why-nick-overlay-bottom"></div>

                    </div>

                    <HorizontalScrollCarousel />

                    <div className="how-ai-mobile">
                        <div className="how-ai-mobile-content">
                            <h3 className="how-ai-mobile-title">How AI Business Scaling works</h3>
                            <p className="how-ai-mobile-text">
                                Save 10% of time per week, fix underperforming teams, increase your leaders' or managers' contribution, and enhance their mindsets.
                                We offer a six-month coaching program delivered by Nick and AI coaches.
                                The program is for a group of up to five people.
                            </p>
                        </div>
                        <div className="grid-container">
                            {stepsData.map((step, index) => (
                                <div 
                                    key={index} 
                                    className="grid-item"
                                    style={{
                                        borderColor: getInterpolatedColor(index, stepsData.length),
                                        boxShadow: `0 0 10px ${getInterpolatedColor(index, stepsData.length)}80,
                                                    0 0 20px ${getInterpolatedColor(index, stepsData.length)}40,
                                                    0 0 30px ${getInterpolatedColor(index, stepsData.length)}20`,
                                    }}
                                >
                                    <div className="grid-item-content">
                                        <div className="card-icon">
                                            <i className={step.icon} ></i>
                                        </div>
                                        <h3 className="horizontal-card-title-mobile">{step.title}</h3>
                                        <p className="horizontal-card-description-mobile">{step.description}</p>
                                        <button className="view-more-button" onClick={() => openPopup(step)}>View More</button>
                                    </div>
                                </div>
                            ))}
                        </div>  
                    </div>

                    <div style={{display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
                        {stepsData.map((step, index) => (
                            <div className="steps-container" style={{maxWidth: '80%'}}>
                                <h3 className="how-ai-coaching-works-title-2">STEP {index + 1}: {step.title}</h3>
                                <p className="how-ai-coaching-works-text" style={{color: 'rgb(173, 173, 173)'}}
                                   dangerouslySetInnerHTML={{ __html: step.text }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="testimonials-section" id='testimonials'>
                        <div className="testimonials-content">
                            <h3 className="testimonials-title">TESTIMONIALS</h3>
                            <h2 className="testimonials-subtitle">What our clients say</h2>
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
                                        <p className="testimonial-description">{testimonial.description}</p>
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
                        <div className="understand-threshold-content" style={{textAlign: 'right'}}>
                            <h3 className="understand-threshold-title">UNDERSTANDING THE THRESHOLD</h3>
                            <h2 className="understand-threshold-subtitle">What is the threshold?</h2>
                            <p className="understand-threshold-text">
                            The Threshold (published by Diversion Books) is an inspiring and practical framework for how you can thrive as a leader in the Age of AI, by nurturing the qualities that make you uniquely human.<br />
                                Available at good book shops
                            </p>                           
                             <div className="understand-threshold-image-mobile">
                                <img src={book} alt="Understand the Threshold" />
                            </div>
                        </div>
                    </div>
                    <div className="understand-threshold" id='understand-threshold'>
                        <div className="understand-threshold-content" style={{textAlign: 'left'}}>
                            <h3 className="understand-threshold-title">UNDERSTANDING THE THRESHOLD</h3>
                            <h2 className="understand-threshold-subtitle">What are the four pathways to the threshold?</h2>
                            <p className="understand-threshold-text">
                                As AI accelerates, the most effective human leadership approaches will be the following four pathways:<br /><br />
                                - <span style={{fontWeight: 'bold', color: 'white'}}>Cultivating stillness:</span> Create spaces where productivity and silence meet<br />
                                - <span style={{fontWeight: 'bold', color: 'white'}}>Embodying intelligence:</span> The fact that machines are not made of flesh matters more than many of us think<br />
                                - <span style={{fontWeight: 'bold', color: 'white'}}>Thinking independently:</span> Move beyond subservient, derivative or superficial thinking, and bring your finest humanity to how you and your teams think<br />
                                - <span style={{fontWeight: 'bold', color: 'white'}}>Maturing consciousness:</span> Leadership excellence will increasingly be fueled not only by skill and mindset, but also by stage of adult psychological development.  Master higher-order styles of leadership to navigate ambiguity and complexity well
                            </p>                            
                            <div className="understand-threshold-image-mobile">
                                <img src={book2} alt="Understand the Threshold" />
                            </div>
                        </div>
                        <div className="understand-threshold-image">
                            <img src={book2} alt="Understand the Threshold" />
                        </div>
                    </div>

                    <div className="best-coaching-program" id='best-coaching-program'>
                        <div className="best-coaching-program-content">
                            <h3 className="best-coaching-program-title"> SELECTING THE BEST PARTNER TO SCALE YOUR BUSINESS</h3>
                            <h2 className="best-coaching-program-subtitle">Finding and working with the<br/> <span className="best-coaching-program-subtitle-span">Best Leadership Coaching Program</span></h2>
                            <p className="best-coaching-program-text">
                                Choosing the best scaling partner is a pivotal decision that can redefine the growth, performance and influence of your business. 
                                The right partner doesn't just provide guidance—they empower you to unlock potential, overcome challenges, and achieve extraordinary results.
                                Finding that ideal partner requires thoughtful consideration.
                            </p>
                        </div>
                        <div className="time-line">
                            <div className="timeline-container">
                                <div className="timeline-line"></div>
                                <div className="timeline-element left" style={{marginTop: '0'}}>
                                    <div className="timeline-content">
                                        <h4><span>1.</span> Define Your Goals</h4>
                                        <p>
                                            Start by identifying what you need.<br/><br/>
                                            - Are you supporting newly promoted high-performing contributors who lack EQ skills?<br/><br/>
                                            - Addressing team challenges such as conflict, distrust, or lack of focus?<br/><br/>
                                            - Or helping leaders navigate complex transitions?<br/><br/>
                                            Consider the ideal blend of 1:1 coaching, group learning, and innovative tools.<br/>
                                            Practical priorities like flexibility, expertise in specific areas, or integrating cutting-edge AI with
                                            human insights should guide your decision.<br/>
                                            Clearly defining your goals lays the foundation for transformational results.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline-element right">
                                    <div className="timeline-content">
                                        <h4><span>2.</span> Assess Your Starting Point</h4>
                                        <p>
                                            Evaluate your current leadership and team development landscape.<br/><br/>
                                            - What is happening right now regarding your goals?<br/><br/>
                                            - What have you tried already, and what were the outcomes?<br/><br/>
                                            - How do you feel about where your leaders and/or managers are right now?<br/><br/>
                                            - What patterns or recurring themes do you notice, in how you have tried to improve mindsets and behaviors in your organization?<br/><br/>
                                            Understanding where you are today helps clarify the gaps the coaching program must address.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline-element left">
                                    <div className="timeline-content">
                                        <h4><span>3.</span> Research Your Options</h4>
                                        <p>
                                            Investigate partners with proven results and diverse methodologies.<br/><br/>
                                            - Seek testimonials from leaders with similar challenges and review the program structure.<br/><br/>
                                            - Does it offer a balance of personalized coaching, group dynamics, and tools for tracking progress?<br/><br/>
                                            Ensure the program aligns with your values and leadership style, including the integration of human and AI-driven coaching approaches.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline-element right">
                                    <div className="timeline-content">
                                        <h4><span>4.</span> Move Forward</h4>
                                        <p>
                                            Once you've shortlisted partners, schedule meetings with potential providers.<br/><br/>
                                            Prepare questions, such as:<br/><br/>
                                            - How do you tailor coaching to individual and team dynamics?<br/><br/>
                                            - What tools or methods do you use to track and measure progress?<br/><br/>
                                            - Can you share success stories from leaders facing similar challenges?<br/><br/>

                                            These insights will help you find a program that not only fits but inspires growth and
                                            success.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline-element left">
                                    <div className="timeline-content">
                                        <h4><span>5.</span> Why the Threshold AI compounding flywheel stands above the rest</h4>
                                        <p>
                                            At Threshold, we combine personalized human insight with the power of AI to deliver a transformational group experience:<br/><br/>
                                            - <span style={{fontWeight: 'bold'}}>Holistic Leadership Mastery:</span> Our unique program blends decades of leadership
                                            expertise with innovative methods to meet the demands of modern leadership – at the
                                            levels of lead self, lead others and lead organization.<br/><br/>
                                            - <span style={{fontWeight: 'bold'}}>A Multi-Faceted Approach:</span> Enjoy 1:1 coaching, group coaching, AI-powered insights,
                                            and masterclasses designed to expand your thinking, refine your skills and enhance your
                                            mindsets.<br/><br/>
                                            - <span style={{fontWeight: 'bold'}}>Real, Measurable Results:</span> Whether your challenge is time, team, money, or mindset,
                                            we deliver coaching that creates lasting impact.<br/><br/>
                                            Experience an approach to business scaling that's bold, dynamic, and designed to propel you forward.<br/>
                                            If you're looking for reliable, inspiring, innovative partner that will help you deliver, you've found your match at Threshold.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="responsible-ai" id='responsible-ai'>
                        <div className='responsible-ai-overlay'></div>
                        <video src={bg4} autoPlay loop muted playsInline className="responsible-ai-video" style={{opacity: 0.7}}></video>
                        <div className="responsible-ai-content">
                            <h3 className="responsible-ai-title">RESPONSIBLE AI</h3>
                            <p className="responsible-ai-text">
                                At Threshold, we believe in the transformative potential of AI to empower leaders while keeping humanity at the heart of every interaction. Our commitment to responsible AI ensures that our coaching solutions are not only innovative but also ethical, safe, and inclusive.
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
                        <p><a className="footer-terms" href="https://www.freeprivacypolicy.com/live/4171053e-0f38-4ffe-afc6-44f328df66ef" target="_blank" rel="noopener noreferrer">Privacy Policy</a> & <a className="footer-terms" href="https://www.freeprivacypolicy.com/live/a33e9452-073e-4cac-a9de-8c67051dcb29" target="_blank" rel="noopener noreferrer">Terms and Conditions</a></p>
                        <p>|</p>
                        <p><a className="footer-terms" href="https://www.hi-dev.it" target="_blank" rel="noopener noreferrer"> Powered by HiDev</a></p>
                    </div>

                    {selectedStep && (
                        <div className="overlay">
                            <div className="popup">
                                <span className="close" onClick={closePopup}>&times;</span>
                                <h3>{selectedStep.title}</h3>
                                <p dangerouslySetInnerHTML={{ __html: selectedStep.text }}></p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default LandingPage;
