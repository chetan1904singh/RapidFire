import { Link } from "react-router-dom";

function Home() {

  return (
    <div style={{ padding: 30 }}>

      <h1>RapidFire</h1>

      <Link to="/signup">
        Signup
      </Link>

      <br /><br />

      <Link to="/login">
        Login
      </Link>

    </div>
  );
}

export default Home;