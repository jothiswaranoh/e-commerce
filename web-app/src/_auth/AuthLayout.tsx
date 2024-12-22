
import { Outlet } from 'react-router';

function AuthLayout() {

  return (

    <section className="comman-backgroud">
      <Outlet />
    </section>
  );
}


export default AuthLayout