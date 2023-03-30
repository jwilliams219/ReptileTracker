import { useEffect, useState } from "react"
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom"
import { Root } from "./pages/root"
import { Home } from './pages/home'
import { Dashboard } from "./pages/dashboard"
import { LogIn } from "./pages/logIn"
import { SignUp } from "./pages/signUp"
import { ApiContext } from './contexts/api'
import { Api } from './lib/api'
import { AuthContext } from './contexts/auth'
import { useAuth } from './hooks/useAuth'


function App() {
  const [page, setPage] = useState(window.location.hash.replace('#', ''));
  const [loggedIn, setLoggedIn ] = useState(false);
  const [token, setToken] = useState(window.localStorage.token);
  const [userId, setUserId] = useState(-1);
  const api = new Api();


  async function checkLogIn() {
      setToken(window.localStorage.token);
      if (token) {
          const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}users/me`, token)
          if (resultBody.userId) {
            setLoggedIn(true);
            setUserId(resultBody.userId);
            window.localStorage.userId = userId;
          } else {
            setLoggedIn(false);
          }
      }
  }

  function signOut() {
    setLoggedIn(false);
    setToken("");
    window.localStorage.token = "";
    window.localStorage.id = "";
    setUserId(-1);
    setPage("home");
  }

  function loadDashboard() {
    if (page === "dashboard") {
      location.reload()
    } else {
      setPage("dashboard")
    }
  }
  
  // this synchronizes the application state with the browser location state
  useEffect(() => {
    
    window.location.hash = page
  }, [page])

  // this synchronizes the browser location state with our application state
  useEffect(() => {
    checkLogIn();

    const hashChange = () => {
      setPage(window.location.hash.replace('#', ''));
    }
    window.addEventListener("hashchange", hashChange);
    
    return () => {
      window.removeEventListener("hashchange", hashChange);
    }
  }, [])

  // dynamically select which page to render based on application state
  let component = <Home />
  if (page === "home") component = <Home />
  else if (page === "dashboard") component = <Dashboard />
  else if (page === "logIn") component = <LogIn />
  else if (page === "signUp") component = <SignUp />

  if (loggedIn && (page === "" || page === "logIn" || page === "signUp" || page === "home")) {
    setPage("dashboard");
  }

  // Dynamically load log in buttons if not logged in.
  let logInButtons;
  if (!loggedIn) {
    logInButtons =
    <span>
      <button onClick={() => setPage("logIn")}>Log In</button>
      <button onClick={() => setPage("signUp")}>Sign Up</button>
    </span>;
  } else {
    logInButtons = null;
  }

  let nav = 
  <nav>
  <button onClick={() => setPage("home")}>Home</button>
  <button onClick={() => setPage("dashboard")}>Dashboard</button>
  { logInButtons }
  </nav>;
if (loggedIn) {
  nav = 
  <nav>
  <button onClick={() => loadDashboard()}>Dashboard</button>
  <button onClick={() => signOut()}>Log Out</button>
  </nav>;
}

  return (
    <div className="app">
      {nav}
      <div className="component">{component}</div>
    </div>
  );
}

export default App;