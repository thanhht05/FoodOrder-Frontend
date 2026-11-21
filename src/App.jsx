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
import Footer from "./components/footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { callGetAccount } from "./services/api";
import { doGetAccountAction, doSetLoadingAction } from "./redux/slices/account/accountSlice";
import { useEffect } from "react";
import Loading from "./components/Loading/loading";
import NotFound from "./components/NotFound/notfound";
import ProtectedRoute from "./pages/protectedRoute/protectedRoute";
import AppHeader from "./components/header/AppHeader";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import ManageUserPage from "./pages/admin/user";
import ManageProductPage from "./pages/admin/product";
import Home from "./components/Home";
import ProductPage from "./pages/product";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCancel from "./pages/payment/PaymentCancel";
import ManageOrderPage from "./pages/admin/order";
import OrderHistory from "./pages/history/OrderHistoryPage";
import ChatWidget from "./components/ChatWidget";
import { getCartAPI } from "./redux/thunk/getCartThunk";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminChatPage from "./pages/admin/chat";
import DashboardPage from "./pages/admin/dashboard";
import ManageVoucherPage from "./pages/admin/voucher";
import useSessionGuard from "./hooks/useSessionGuard";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import enUS from "antd/locale/en_US";
import { useTranslation } from "./i18n";
import antdTheme from "./styles/antdTheme";

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
				path: "payment/success",
				element: (
					<ProtectedRoute>
						<PaymentSuccess />
					</ProtectedRoute>
				),
			},
			{
				path: "payment/cancel",
				element: (
					<ProtectedRoute>
						<PaymentCancel />
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
					<ProtectedRoute roles={ ["ADMIN"] }>
						<DashboardPage />
					</ProtectedRoute>
				),
			},

			{
				path: "user",
				element: (
					<ProtectedRoute roles={ ["ADMIN"] }>
						<ManageUserPage />
					</ProtectedRoute>
				),
			},
			{
				path: "product",
				element: (
					<ProtectedRoute roles={ ["ADMIN"] }>
						<ManageProductPage />
					</ProtectedRoute>
				),
			},
			{
				path: "voucher",
				element: (
					<ProtectedRoute roles={ ["ADMIN"] }>
						<ManageVoucherPage />
					</ProtectedRoute>
				),
			},
			{
				path: "order",
				element: (
					<ProtectedRoute roles={ ["ADMIN"] }>
						<ManageOrderPage />
					</ProtectedRoute>
				),
			},

			{
				path: "chat",
				element: (
					<ProtectedRoute roles={ ["ADMIN"] }>
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

function App() {
	const dispatch = useDispatch();
	const { language } = useTranslation();

	const isLoading = useSelector((state) => state.account.isLoading);

	// Single active session: auto logout when account logs in from another browser
	useSessionGuard();
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
			// Optional: dispatch reset action if getAccount fails
		} finally {
			// Always runs regardless of API success or error
			dispatch(doSetLoadingAction(false));
		}
	};

	useEffect(() => {
		getAccount();

	}, []);

	return (
		<ConfigProvider locale={ language === "en" ? enUS : viVN } theme={ antdTheme }>
			{ isLoading == false ||
				window.location.pathname === "/login" ||
				window.location.pathname === "/register" ||
				window.location.pathname === "/" ? (
				<RouterProvider router={ router } />
			) : (
				<Loading />
			) }
		</ConfigProvider>
	);
}

export default App;
