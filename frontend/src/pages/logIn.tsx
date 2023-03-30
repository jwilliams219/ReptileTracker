import { useEffect, useState, KeyboardEvent } from "react"
import { Api } from './../lib/api'


export const LogIn = () => {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ token, setToken ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [inputError, setInputError] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);
    const api = new Api();

    async function logIn() {
        if (email === "" || password === "") {
            setInputError(true);
        } else {
            const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}users/login?email=${email}&password=${password}`, token)
            
            if (resultBody.token) {
            setToken(resultBody.token);
            window.localStorage.token = resultBody.token;
            setLoggedIn(true);
            setInputError(false);
            setInvalidUser(false);
            } else {
                setInvalidUser(true);
            }
        }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
          logIn();
        }
    }

    useEffect(() => {
        if (!window.localStorage.token || window.localStorage.token !== "") {
        setLoggedIn(false);
        } else {
        setToken(window.localStorage.token);
        }
    }, [])

    let message = <p></p>
    if (inputError && (email === "" || password === "")) {
        message = <p>Email and Password are required</p>
    } else {
        message = <p></p>
    }
    if (invalidUser) {
        message = <p>Invalid username or password</p>
    }
    let content = <p>Loading...</p>
    if (loggedIn) {
        content = <h1>Loading...</h1>
        location.reload();
    } else {
        content = 
        <form className="signup-form">
            <label>
            Email: <input value={email} onChange={e => setEmail(e.target.value)} type="email"/>
            </label><br></br>
            <label>
            Password: <input value={password} onChange={e => setPassword(e.target.value)} type="password" onKeyDown={e => handleKeyDown(e)}/>
            </label><br></br>
            <button type="button" onClick={logIn}>Log In</button>
        </form>;
    }

    return (
        <div>
            { content }
            { message }
        </div>
        
    );
}