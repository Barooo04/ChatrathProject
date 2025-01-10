import "./LoginPage.css";

function LoginPage() {

    return (
        <div className="background">
            <div className="shape"></div>
            <div className="shape"></div>
            <form>
                <h3>Login Here</h3>

                <label htmlFor="username">Email</label>
                <input
                    type="text"
                    placeholder="Email"
                    id="username"
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    placeholder="Password"

                />

                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default LoginPage;