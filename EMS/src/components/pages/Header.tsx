
import { logoutEmployee } from '@/redux/action';
import { useAppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
   const dispatch = useAppDispatch();
  return (
      <header className="bg-gray-100 text-black py-4 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
       
        <span className="font-semibold text-xl">EMS</span>
      </div>

      {/* Profile Section */}
      <div className="flex items-center">
          <span onClick={()=>{
                dispatch(logoutEmployee());
                toast.success("You have been logged out")
                navigate('/');
                }}  className="font-semibold text-xl">Logout</span>
      </div>
    </header>
    );
};

export default Header;