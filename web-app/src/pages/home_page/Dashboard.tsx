
import Banner from '../../components/components/banner';
import BestSeller from '../../components/components/best-seller';
import { Categories } from '../../components/components/categories';
import Footer from '../../components/components/footer';
import MainBody from '../../components/components/main-body';
import Navbar from '../../components/components/navbar';
import Testimonials from '../../components/components/testmonial';
import TopProducts from '../../components/components/topProducts';

const Dashboard = () => {
  return (
    <>
    <Navbar />
    <MainBody />
    <Categories />
    <BestSeller />
    <Banner />
    <Testimonials/>
    <Footer />
    </>
  )
}

export default Dashboard;
