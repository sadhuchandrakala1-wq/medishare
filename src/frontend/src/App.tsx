import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppProvider } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProfile from "./pages/customer/CustomerProfile";
import SenderDashboard from "./pages/sender/SenderDashboard";

function RootLayout() {
  return (
    <AppProvider>
      <Outlet />
      <Toaster position="top-center" richColors />
    </AppProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register/$role",
  component: RegisterPage,
});

const customerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customer",
  component: CustomerDashboard,
});

const customerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customer/profile",
  component: CustomerProfile,
});

const senderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sender",
  component: SenderDashboard,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  customerRoute,
  customerProfileRoute,
  senderRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
