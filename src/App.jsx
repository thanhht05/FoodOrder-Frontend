import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import Contact from "./pages/contact";
import BookPage from "./pages/book";
import Header from "./components/header/AppHeader";
import Footer from "./components/footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { callGetAccount } from "./services/api";
import { doGetAccountAction } from "./redux/slices/account/accountSlice";
import { useEffect } from "react";
import Loading from "./components/Loading/loading";
import NotFound from "./components/NotFound/notfound";
import AdminPage from "./pages/admin/adminPage";
import ProtectedRoute from "./pages/protectedRoute/ProtectedRoute";
import AppHeader from "./components/header/AppHeader";
const Layout = () => {
  return (
    <div className="layout">
      <AppHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

const LayoutAdmin = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.account.user);
  const userRole = user.role.name;
  return (
    <div className="layout">
      {isAdminRoute && userRole === "ADMIN" && <Header />}

      <Outlet />
      {isAdminRoute && userRole === "ADMIN" && <Footer />}
    </div>
  );
};
function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const isLoading = useSelector((state) => state.account.isLoading);
  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;

    const res = await callGetAccount();
    if (res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };
  useEffect(() => {
    getAccount();
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "book",
          element: <BookPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <ProtectedRoute />,
        },
        {
          path: "user",
          element: <Contact />,
        },
        {
          path: "book",
          element: <BookPage />,
        },
      ],
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);
  return (
    <>
      {isLoading == false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
