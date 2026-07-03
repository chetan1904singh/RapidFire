import { Link } from "react-router-dom";

function Home() {
  return (
    <div
  className="min-h-screen flex items-center justify-center bg-cover "
  style={{ backgroundImage: "url('/background.jpg')" }}
>
      <div className="w-80 rounded-3xl bg-slate-800/40 backdrop-blur-xl border border-white/20 p-10 shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-white">
          RapidFire
        </h1>

        <p className="mt-3 text-gray-500">
          Fast-paced 1v1 quiz battles.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <Link
            to="/signup"
            className="rounded-xl bg-black py-3 text-white font-semibold shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gray-900 hover:shadow-xl active:scale-95"
          >
            Sign Up
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-gray-300 bg-white py-3 text-gray-900 font-semibold shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-lg active:scale-95"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;