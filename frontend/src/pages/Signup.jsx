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
    <div className="min-h-screen flex items-center justify-center bg-cover"
    style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="w-full max-w-md rounded-2xl bg-slate-800/40 backdrop-blur-xl p-8 shadow-2xl border border-slate-700">

        <h2 className="text-3xl font-bold text-white text-center">
          Create Account
        </h2>

        <p className="mt-2 text-center text-slate-400">
          Join RapidFire and start competing.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-indigo-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-indigo-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-indigo-500"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-indigo-500"
          />

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Create Account
          </button>

        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-slate-700"></div>
          <span className="mx-4 text-sm text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-700"></div>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 py-3 font-medium text-white transition hover:bg-slate-700"
        >
          Continue with Google
        </button>

        <p className="mt-8 text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;