
import { Outlet } from 'react-router';

function AuthLayout() {

  return (

          <section className="">
            <Outlet />
          </section>
  );
}


export default AuthLayout