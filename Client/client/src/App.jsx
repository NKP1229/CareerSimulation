import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <nav>
        <ul>
          <li>
            <button>Home</button>
          </li>
          <li>
            <button>SignUp</button>
          </li>
          <li>
            <button>LogIn</button>
          </li>
        </ul>
      </nav>
      <main>
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
      </main>
    </>
  );
}

export default App;
