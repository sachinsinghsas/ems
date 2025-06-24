import LoginForm from "./components/pages/LoginForm";
import Dashboard from "./components/pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/pages/Header";
import { useEffect, useState } from "react";
import Sidebar from "./components/pages/Sidebar";
import AddEmployee from "./components/pages/AddEmployee";
import EditEmployee from "./components/pages/EditEmployee";

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
          <Route index path="/"  element={<LoginForm />} />
        </Routes>
        <div className="flex min-h-screen bg-gray-100 font-sans leading-normal tracking-normal">
          {/* Overlay for small screens when drawer is open */}
          {isDrawerOpen && window.innerWidth < 1024 && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-30"
              onClick={closeDrawer}
            ></div>
          )}

          <Sidebar isOpen={isDrawerOpen} onClose={closeDrawer} />

          <main
            className={`flex-1 transition-all duration-300 ease-in-out p-6 lg:p-8
                    ${isDrawerOpen && window.innerWidth < 1024 ? "ml-0" : ""}
                    ${window.innerWidth >= 1024 ? "lg:ml-2" : ""}
                `}
          >
            <Header onMenuToggle={toggleDrawer} />
            <Routes>

              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/add/employee" element={<AddEmployee />} />
              <Route path="/admin/edit/employee/:id" element={<EditEmployee />} />

            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
