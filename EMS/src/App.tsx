import LoginForm from "./components/pages/LoginForm";
import Dashboard from "./components/pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AddEmployee from "./components/pages/AddEmployee";
import EditEmployee from "./components/pages/EditEmployee";
import NotFound from "./components/pages/NotFound";
import MainLayout from "./components/pages/MainLayout";


const App: React.FC = () => {


  return (
    <>
      <BrowserRouter>
        <ToastContainer />
            <Routes>
              <Route path="/"  element={<LoginForm />} />
              <Route element={<MainLayout />}>
              <Route index path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/add/employee" element={<AddEmployee />} />
              <Route path="/admin/edit/employee/:id" element={<EditEmployee />} />
              </Route>
              <Route path="*" element={<NotFound />} /> 
              </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
