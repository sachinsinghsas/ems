    // Layout.js
    import React from 'react';
    import { Outlet } from 'react-router-dom';

    function Layout() {
      return (
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
            {/* <Routes> */}

              <Route index path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/add/employee" element={<AddEmployee />} />
              <Route path="/admin/edit/employee/:id" element={<EditEmployee />} />
              <Route path="*" element={<NotFound />} /> 

            {/* </Routes> */}
          </main>
        </div>
      );
    }

    export default Layout;