import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [account, setAccount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAccount, setIsAccount] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const json = await response.json();
        setItems(json.response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  function home() {
    setIsLogIn(false);
    setIsRegister(false);
    setIsAccount(false);
  }
  function register() {
    setIsRegister(true);
    setIsLogIn(false);
  }
  function logIn() {
    setIsLogIn(true);
    setIsRegister(false);
  }
  const signup = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }), // Properly stringify the data
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", json.token);
      setIsRegister(false);
      setIsSignedIn(true);
    } else {
      console.log(json);
    }
  };
  const login = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", json.token);
      setIsLogIn(false);
      setIsSignedIn(true);
    } else {
      console.log(json);
    }
  };
  const logOut = () => {
    setIsSignedIn(false);
    setIsAccount(false);
    window.localStorage.removeItem("token");
  };
  const Account = async () => {
    setIsAccount(true);
    const token = window.localStorage.getItem("token");
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      setAccount(json.response);
    } else {
      console.log(json);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (isSignedIn) {
    return (
      <>
        <nav>
          <ul>
            <li>
              <button onClick={() => home()}>Home</button>
            </li>
            <li>
              <button onClick={() => Account()}>Account</button>
            </li>
            <li>
              <button onClick={() => logOut(false)}>Log Out</button>
            </li>
          </ul>
        </nav>
        <main>
          {isAccount && (
            <>
              <h1>Account Details</h1>
              <h3>{account.id}</h3>
              <h3>{account.username}</h3>
              <h3>{account.password}</h3>
            </>
          )}
          {!isAccount && <h1>Home</h1>}
        </main>
      </>
    );
  }
  return (
    <>
      <nav>
        <ul>
          <li>
            <button onClick={() => home()}>Home</button>
          </li>
          <li>
            <button onClick={() => register()}>SignUp</button>
          </li>
          <li>
            <button onClick={() => logIn()}>LogIn</button>
          </li>
        </ul>
      </nav>
      <main>
        {isRegister && (
          <form onSubmit={signup}>
            <h1>Register:</h1>
            <div>
              <label>Username:</label>
              <input
                value={username}
                placeholder="username"
                onChange={(ev) => setUsername(ev.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                value={password}
                placeholder="password"
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
            <button disabled={!username || !password} type="submit">
              Register
            </button>
          </form>
        )}
        {isLogIn && (
          <form onSubmit={login}>
            <h1>LogIn:</h1>
            <div>
              <label>Username:</label>
              <input
                value={username}
                placeholder="username"
                onChange={(ev) => setUsername(ev.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                value={password}
                placeholder="password"
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
            <button disabled={!username || !password} type="submit">
              LogIn
            </button>
          </form>
        )}
        {!isRegister && !isLogIn && (
          <>
            <h1>Sandwich menu:</h1>
            <section>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <button>{item.name}</button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default App;
