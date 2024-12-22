import { Outlet } from "react-router";

const PublicLayout = () => {
  return (
    <>
      {/* <div className="position-sticky top-0 left-0 right-0 app-nav-bar">
       
      </div> */}
      <Outlet />
      {/* Footer component comes here */}
    </>
  );
};

export default PublicLayout;
