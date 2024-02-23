import Cookies from "js-cookie";

import Navbar from "./components/Navbar";
import Sidebar from "~components/Sidebar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Roles from "~pages/Roles";
import { ServiceProvider, useServices } from "./contexts/ServiceContext";
import { useEffect, useState } from "react";
import { Alert } from "flowbite-react";
import { RiInformationFill } from "react-icons/ri";
import Users from "~pages/Users";
import { RoleProvider, useRoles } from "./contexts/RoleContext";
import { UserProvider } from "./contexts/UserContext";
import Error from "~pages/Error";

function App() {
  const isAuthenticated = Cookies.get("user");
  const roleCookie = Cookies.get("role");
  const isAuthorized = JSON.parse(roleCookie).permissions.admin.access;
  const loginPage = "http://localhost:5173/";

  if (!isAuthenticated) {
    window.location.href = loginPage;
    return null;
  }

  if (!isAuthorized) {
    window.location.href = loginPage;
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <RoleProvider>
        <UserProvider>
          <ServiceProvider>
            <Router>
              <AlertContainer />
              <Navbar />
              <main className="flex flex-row gap-4 p-4">
                <Sidebar />
                <AppRoutes />
              </main>
            </Router>
          </ServiceProvider>
        </UserProvider>
      </RoleProvider>
    </div>
  );
}

function AppRoutes() {
  const { CheckPermission } = useServices();
  return (
    <Routes>
      <Route exact path="/" element={<>Dashboard</>} />
      {["sites", "analytics", "roles", "users"].map((route) => {
        let Component;
        switch (route) {
          case "sites":
            Component = null;
            break;
          case "analytics":
            Component = null;
            break;
          case "roles":
            Component = Roles;
            break;
          case "users":
            Component = Users;
            break;
        }

        const element = Component ? <Component /> : <>Work in progress</>;

        return CheckPermission({
          path: route,
          children: <Route path={`/${route}/*`} element={element} />,
        });
      })}
      {/* <Route path="*" element={<Error />} /> */}
    </Routes>
  );
}

function AlertContainer() {
  const { alert, setAlert } = useServices();

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (alert.isOn) {
      setTimeout(() => {
        setAlert({
          isOn: false,
          type: "info",
          message: "",
        });
      }, 3000);
    }
  }, [alert, setAlert]);

  return (
    alert.isOn && (
      <Alert
        icon={RiInformationFill}
        color={alert.type}
        onDismiss={() =>
          setAlert({
            isOn: false,
            type: "info",
            message: "",
          })
        }
        className="absolute top-[10%] left-[50%] translate-x-[-50%] animate-fade-fr-t z-10"
      >
        <span>
          <p className="w-[300px] text-center">{alert.message}</p>
        </span>
      </Alert>
    )
  );
}
export default App;
