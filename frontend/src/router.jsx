import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Matchmaking from "./pages/Matchmaking";
import QuizRoom from "./pages/QuizRoom";
import Result from "./pages/Result";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/matchmaking",
    element: (
      <ProtectedRoute>
        <Matchmaking />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quiz/:roomId",
    element: (
      <ProtectedRoute>
        <QuizRoom />
      </ProtectedRoute>
    ),
  },
  {
    path: "/result",
    element: (
      <ProtectedRoute>
        <Result />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;