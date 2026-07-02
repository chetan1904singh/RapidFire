import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await signup(form.name, form.email, form.password);
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
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">
          Signup
        </button>
      </form>

      <br />

      <button onClick={handleGoogle}>
        Continue with Google
      </button>

      <br /><br />

      <Link to="/login">
        Already have an account?
      </Link>

      <p>{error}</p>
    </div>
  );
}

export default Signup;