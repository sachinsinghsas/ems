import { logout } from '@/redux/reducer';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle}: HeaderProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <header  onClick={onMenuToggle} className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
            <div className="flex items-center">
                <button onClick={onMenuToggle} className="text-gray-500 focus:outline-none focus:text-gray-900 lg:hidden mr-4">
                 <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <h2  className="text-3xl font-bold text-gray-800">Overview</h2>
            </div>
            <div onClick={()=>{
                dispatch(logout());
                toast.success("You have been logged out")
                navigate('/');
                }} className="flex items-center space-x-4">
                Logout
            </div>
        </header>
    );
};

export default Header;