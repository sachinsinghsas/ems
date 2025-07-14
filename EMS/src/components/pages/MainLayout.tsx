import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from '../../redux/reducer';

const MainLayout: React.FC = () => {

  let { employeesInfo } = useSelector(selectAuth);

  if (!employeesInfo) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
        <Outlet />
    </>
  );
};

export default MainLayout;
