import Cookies from "js-cookie";
import { useEffect } from "react";
import { Alert } from "flowbite-react";
import { RiInformationFill } from "react-icons/ri";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

//custom components
import Roles from "~pages/Roles";
import Users from "~pages/Users";
import Navbar from "~components/Navbar";
import Sidebar from "~components/Sidebar";
import { alertTemplate } from "./misc/templates";
import { RoleProvider } from "~contexts/RoleContext";
import { UserProvider } from "~contexts/UserContext";
import { ServiceProvider, useServices } from "~contexts/ServiceContext";
import Sites from "~pages/Sites";
import { SiteProvider } from "./contexts/SiteContext";
import Loading from "~components/Loading";

//Main App Component
function App() {
  //check if the system has user and role stored in cookies
  const isAuthenticated = Cookies.get("user");
  const roleCookie = Cookies.get("role");
  let isAuthorized = false;
  //check if the user has admin permissions
  if (roleCookie) {
    if (roleCookie !== "undefined") {
      isAuthorized = JSON.parse(roleCookie).permissions.admin.access;
    }
  }
  const loginPage =
    window.location.hostname === "localhost"
      ? "localhost:5173/login"
      : "https://ooh.scmiph.com/";

  //return to login page if user is neither authenticated nor authorized
  if (!isAuthenticated || !isAuthorized) {
    window.location.href = loginPage;
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <RoleProvider>
        <UserProvider>
          <SiteProvider>
            <ServiceProvider>
              <Router>
                <LoadingContainer />
                <AlertContainer />
                <Navbar />
                <main className="flex flex-row gap-4 p-4">
                  <Sidebar />
                  <AppRoutes />
                </main>
              </Router>
            </ServiceProvider>
          </SiteProvider>
        </UserProvider>
      </RoleProvider>
    </div>
  );
}

function LoadingContainer() {
  const { loading } = useServices();

  return loading && <Loading />;
}
//component for rendering the routes of the system
function AppRoutes() {
  //service function initialization
  const { CheckPermission } = useServices();
  return (
    <Routes>
      <Route exact path="/" element={<>Dashboard</>} />

      {/* mapping of pages for dynamic routing based on the user's permissions */}
      {["sites", "analytics", "roles", "users"].map((route) => {
        let Component;
        switch (route) {
          case "sites":
            Component = Sites;
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
    </Routes>
  );
}

//component for system alerts
function AlertContainer() {
  const { alert, setAlert } = useServices();

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (alert.isOn) {
      setTimeout(() => {
        setAlert(alertTemplate);
      }, 3000);
    }
  }, [alert, setAlert]);

  return (
    alert.isOn && (
      <Alert
        icon={RiInformationFill}
        color={alert.type}
        onDismiss={() => setAlert(alertTemplate)}
        className="fixed top-[10%] left-[50%] translate-x-[-50%] animate-fade-fr-t z-10"
      >
        <span>
          <p className="w-[300px] text-center">{alert.message}</p>
        </span>
      </Alert>
    )
  );
}
export default App;
