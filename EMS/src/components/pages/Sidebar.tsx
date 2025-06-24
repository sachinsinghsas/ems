import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {

    const navigate = useNavigate();

    return (
        <aside
            className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
                lg:relative lg:translate-x-0
                ${!isOpen && window.innerWidth < 1024 ? '-translate-x-full' : ''}`
            }
            // Close drawer when clicking outside on small screens.
            // This is a simple workaround. For more robust handling, consider a dedicated click-away hook.
            onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                if (window.innerWidth < 1024 && e.target.closest('a') === null) {
                    // Only close if click is not on a link inside sidebar itself
                    onClose();
                }
            }}
        >
            <div className="p-6 flex items-center justify-center border-b border-gray-200">
                <h1 onClick={()=>{navigate("/admin/dashboard",{ replace: true })}} className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            </div>

            <nav className="mt-8">
                <a onClick={()=>{navigate("/admin/dashboard",{ replace: true })}} className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-150">
                    <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7M19 10v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    Dashboard
                </a>
               
            </nav>
        </aside>
    );
};

export default Sidebar;