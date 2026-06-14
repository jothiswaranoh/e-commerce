import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { ROUTES } from '../config/routes.constants';
import { CONTACT, BRAND } from '../config/ui.config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top: Logo + Tagline centered */}
        <div className="flex flex-col items-center text-center mb-10">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-3">
            <img src="/logo.svg" alt={`${BRAND.name} Logo`} className="w-8 h-8 rounded-md" />
            <span className="text-2xl font-bold text-white">{BRAND.name}</span>
          </Link>
          <p className="text-sm text-neutral-400 max-w-md">
            Welcome to {BRAND.name}, where style meets comfort! At {BRAND.name.toLowerCase()}, we believe that every one deserves to best gift.
          </p>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Account */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to={ROUTES.PROFILE} className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to={ROUTES.REGISTER} className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to={ROUTES.HOME} className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to={ROUTES.PRODUCTS} className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to={ROUTES.ORDERS} className="hover:text-white transition-colors">Track Your Orders</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">FAQ's</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Exchange/Return Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>{CONTACT.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>{CONTACT.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
          <p>© {currentYear} {BRAND.name.toUpperCase()}. All Rights Reserved.</p>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            {['Razorpay', 'VISA', 'MC', 'UPI'].map((method) => (
              <span
                key={method}
                className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded border border-neutral-700"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
