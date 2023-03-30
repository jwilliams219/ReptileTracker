
import { useContext, useState, useEffect, KeyboardEvent } from "react";
import { AuthContext } from "../contexts/auth";
import { Api } from './../lib/api'

export const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ token, setToken ] = useState("");
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [invalidUser, setInvalidUser] = useState(false);
  const api = new Api();

  async function signUp() {
    if (email === "" || password === "" || firstName === "" || lastName === "") {
        setInputError(true);
    } else {
        const body = {
            firstName,
            lastName,
            email,
            password
        }

      const resultBody = await api.post(`${import.meta.env.VITE_SERVER_URL}users`, token, body)
      
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
      SignUp();
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
  if (inputError && (firstName === "" || lastName === "" || email === "" || password === "")) {
      message = <p>Email and Password are required</p>
  } else {
      message = <p></p>
  }
  if (invalidUser) {
      message = <p>Invalid username or password</p>
  }
  let content = <p>Loading...</p>
  if (loggedIn) {
      content = <h1>Welcome {firstName}</h1>
      location.reload();
  } else {
      content = 
      <form className="signup-form">
      <label>
        First Name: <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" />
      </label><br></br>
      <label>
        Last Name: <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" />
      </label><br></br>
      <label>
        Email: <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
      </label><br></br>
      <label>
        Password: <input value={password} onChange={e => setPassword(e.target.value)} type="password" onKeyDown={e => handleKeyDown(e)}/>
      </label><br></br>
      <button type="button" onClick={signUp}>Sign up</button>
    </form>;
  }

  return (
    <div>
      { content }
      {message}
      </div>
  )
}