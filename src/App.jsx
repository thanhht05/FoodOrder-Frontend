import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import Contact from "./pages/contact";
import BookPage from "./pages/product";
import Footer from "./components/Footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { callGetAccount } from "./services/api";
import { doGetAccountAction, doSetLoadingAction } from "./redux/slices/account/accountSlice";
import { useEffect } from "react";
import Loading from "./components/Loading/loading";
import NotFound from "./components/NotFound/notfound";
import ProtectedRoute from "./pages/protectedRoute/ProtectedRoute";
import AppHeader from "./components/Header/AppHeader";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import ManageUserPage from "./pages/admin/user";
import ManageProductPage from "./pages/admin/product";
import Home from "./components/Home";
import ProductPage from "./pages/product";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import PaymentPage from "./pages/payment/PaymentPage";
import ManageTablePage from "./pages/admin/table";
import ManageOrderPage from "./pages/admin/order";
import OrderCancelPage from "./pages/admin/order/OrderCancelPage";
import OrderConfirmPage from "./pages/admin/order/OrderConfirmPage";
import OrderHistory from "./pages/history/OrderHistoryPage";
import ChatWidget from "./components/ChatWidget";
import { getCartAPI } from "./redux/thunk/getCartThunk";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminChatPage from "./pages/admin/chat";
import DashboardPage from "./pages/admin/dashboard";

const Layout = () => {
  return (
    <div className="layout">
      <AppHeader />
      <Outlet />
      <Footer />
      <ChatWidget />
    </div>
  );
};

function App() {
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.account.isLoading);
  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      dispatch(doSetLoadingAction(false));
      return;
    }

    try {
      const res = await callGetAccount();
      if (res?.data) {
        dispatch(doGetAccountAction(res.data));
        dispatch(getCartAPI());
      }
    } catch (error) {
      console.error("Get account failed:", error);
      // Khi callGetAccount lỗi, có thể dispatch thêm action reset user nếu cần
    } finally {
      // Khối này LUÔN CHẠY bất kể API thành công hay gặp lỗi (400, 401, 500)
      dispatch(doSetLoadingAction(false));
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
          path: "product/:slug",
          element: <ProductPage />,
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "payment/:orderId",
          element: (
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "order-history",
          element: (
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
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
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },

        {
          path: "user",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <ManageUserPage />,
            </ProtectedRoute>
          ),
        },
        {
          path: "product",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <ManageProductPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "table",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <ManageTablePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "order",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <ManageOrderPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "order-cancel",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <OrderCancelPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "order-confirm",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <OrderConfirmPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "chat",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminChatPage />
            </ProtectedRoute>
          ),
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
