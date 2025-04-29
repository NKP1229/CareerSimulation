import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [account, setAccount] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [getItemReview, setGetItemReview] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAccount, setIsAccount] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
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
  }, [refresh]);

  async function getItemReviews(itemId) {
    try {
      setLoading(true);
      const response = await fetch(`api/items/${itemId}/reviews`);
      if (!response.ok) {
        throw new Error("Failed to fetch item reviews");
      }
      const json = await response.json();
      setReviews(json.response);
      setAvgRating(json.avg);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  function home() {
    setIsLogIn(false);
    setIsRegister(false);
    setIsAccount(false);
    setSelectedItem(null);
    setGetItemReview(false);
  }
  function register() {
    setIsRegister(true);
    setIsLogIn(false);
    setSelectedItem(null);
  }
  function logIn() {
    setIsLogIn(true);
    setIsRegister(false);
    setSelectedItem(null);
  }
  function setSelect(item) {
    setSelectedItem(item);
    setGetItemReview(true);
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
      const Response = await fetch("/api/reviews/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const array = await Response.json();
      if (Response.ok) {
        setItems(array);
      } else {
        console.log(array);
      }
    } else {
      console.log(json);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (selectedItem) {
    if (getItemReview) {
      getItemReviews(selectedItem.id);
      setGetItemReview(false);
    }
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
              <h2>Account Details</h2>
              <div>
                <h5>id: {account.id}</h5>
                <h5>username: {account.username}</h5>
                <h5>password: {account.password}</h5>
              </div>
              <h2>Reviews</h2>
              <ul>
                {reviews.map((review) => (
                  <li key={review.id}>
                    <button>
                      <h5>item: {review.itemId}</h5>
                      <h5>rating: {review.rating}</h5>
                    </button>
                  </li>
                ))}
              </ul>
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
            <div className="formDiv">
              <label>Username:</label>
              <input
                value={username}
                placeholder="username"
                onChange={(ev) => setUsername(ev.target.value)}
              />
            </div>
            <div className="formDiv">
              <label>Password:</label>
              <input
                value={password}
                placeholder="password"
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
            <div className="formDiv">
              <button disabled={!username || !password} type="submit">
                Register
              </button>
            </div>
          </form>
        )}
        {isLogIn && (
          <form onSubmit={login}>
            <h1>LogIn:</h1>
            <div className="formDiv">
              <label>Username: </label>
              <input
                value={username}
                placeholder="username"
                onChange={(ev) => setUsername(ev.target.value)}
              />
            </div>
            <div className="formDiv">
              <label>Password: </label>
              <input
                value={password}
                placeholder="password"
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
            <div className="formDiv">
              <button disabled={!username || !password} type="submit">
                LogIn
              </button>
            </div>
          </form>
        )}
        {selectedItem && (
          <>
            <h2>Selected Item:</h2>
            <section>
              <h3>{selectedItem.name}</h3>
              <h3>rating: {avgRating}</h3>
            </section>
          </>
        )}
        {!isRegister && !isLogIn && !selectedItem && (
          <>
            <h1>Sandwich menu:</h1>
            <section>
              <ul>
                {Array.isArray(items) && items.length > 0 ? (
                  items.map((item) => (
                    <li key={item.id}>
                      <button onClick={() => setSelect(item)}>
                        {item.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <button onClick={() => setRefresh(!refresh)}>refresh</button>
                )}
              </ul>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default App;
