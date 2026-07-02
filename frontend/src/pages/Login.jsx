import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button>
          Login
        </button>
      </form>

      <br />

      <button onClick={handleGoogle}>
        Continue with Google
      </button>

      <br /><br />

      <Link to="/signup">
        Create Account
      </Link>

      <p>{error}</p>
    </div>
  );
}

export default Login;