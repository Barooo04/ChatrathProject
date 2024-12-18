import "./LandingPage.css"
import logo from '../Images/chatrathLogo.png';
import chiSonoImage from '../Images/prof.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

function LandingPage() {

    const handleSmoothScroll = (event) => {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({ behavior: "smooth" });
    };

    return ( 
        <div className="landing-container">
            <nav className="navbar">
                <img src={logo} alt="Logo ChatrathAssistants" className="logo" />
                <ul>
                    <li><a href="#chi-sono" onClick={handleSmoothScroll}>Chi Sono</a></li>
                    <li><a href="#assistant" onClick={handleSmoothScroll}>Assistant</a></li>
                    <li><a href="#faq" onClick={handleSmoothScroll}>FAQ</a></li>
                    <li><button className="login-button">Login / Signup</button></li>
                </ul>
            </nav>
            <div className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-text">
                        <h1>Chatrath Assistants</h1>
                        <h2>Il tuo assistente scolastico personale,<br /> sempre a disposizione!</h2>
                    </div>
                    <div className="info-box">
                        <p>Scopri come i nostri assistenti possono aiutarti a migliorare il tuo apprendimento.</p>
                        <button className="discover-button">Scopri Ora</button>
                    </div>
                </div>
            </div>
            
            <div className="chi-sono-section" id="chi-sono">
                <h2 className="chi-sono-title">Chi Sono</h2>
                <div className="chi-sono-content">
                    <div className="chi-sono-image">
                        <img src={chiSonoImage} alt="Chi Sono" />
                    </div>
                    <div className="chi-sono-description">
                        <p>
                            Sono un professore appassionato di tecnologia e educazione. 
                            Ho creato ChatrathAssistants per fornire supporto personalizzato agli studenti, 
                            aiutandoli a raggiungere i loro obiettivi di apprendimento.
                        </p>
                        <div className="social-icons">
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default LandingPage;