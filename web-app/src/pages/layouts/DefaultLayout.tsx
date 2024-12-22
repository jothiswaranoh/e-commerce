import { Outlet } from "react-router";

const DefaultLayout = () => {
  return (
    <>
      <div className="app-container">
        <Outlet />
      </div>
    </>
  );
};

export default DefaultLayout;
