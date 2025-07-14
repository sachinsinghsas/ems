import LoginForm from "./components/pages/LoginForm";
import Dashboard from "./components/pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/pages/Header";
import { useEffect, useState } from "react";
import Sidebar from "./components/pages/Sidebar";
import AddEmployee from "./components/pages/AddEmployee";
import EditEmployee from "./components/pages/EditEmployee";
import NotFound from "./components/pages/NotFound";

const App: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Effect to handle window resize for drawer behavior
  useEffect(() => {
    const handleResize = () => {
      // Close drawer on small screens if it's open and user resizes to large
      if (window.innerWidth >= 1024 && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDrawerOpen]); // Dependency array: run effect when isDrawerOpen changes

  const toggleDrawer = (): void => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = (): void => {
    setIsDrawerOpen(false);
  };
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
            <Routes>
              <Route path="/"  element={<LoginForm />} />
              <Route index path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/add/employee" element={<AddEmployee />} />
              <Route path="/admin/edit/employee/:id" element={<EditEmployee />} />
              <Route path="*" element={<NotFound />} /> 
              </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
