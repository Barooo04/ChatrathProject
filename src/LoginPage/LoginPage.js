import "./LoginPage.css";
import { useState } from "react";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setMessage(data.message);
                // Puoi aggiungere la logica per salvare i dati dell'utente, ad esempio usando il localStorage
                console.log("Utente loggato:", data.user);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Errore durante il login:", error);
            setMessage("Errore nella connessione al server");
        }
    };

    return (
        <div className="background">
            <div className="shape"></div>
            <div className="shape"></div>
            <form onSubmit={handleLogin}>
                <h3>Login Here</h3>

                <label htmlFor="username">Email</label>
                <input
                    type="text"
                    placeholder="Email"
                    id="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Log In</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default LoginPage;