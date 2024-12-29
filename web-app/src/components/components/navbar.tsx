import { Button } from './ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './ui/menubar';

const Navbar = () => {
  return (
    <Menubar className='m-2 border-0'>
      <div className="flex items-center justify-between w-full px-4 py-2">
        {/* Left Side - App Logo */}
        <div className="flex items-center space-x-4">
        <div className="text-lg font-bold">App Logo</div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Navigation Menus */}
          <MenubarMenu>
            <MenubarTrigger className="hover:text-blue-500">Home</MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="hover:text-blue-500">Shop</MenubarTrigger>
            <MenubarContent className="bg-white border border-gray-200 rounded shadow-lg">
              <MenubarItem className="px-4 py-2 hover:bg-gray-100">
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="px-4 py-2 hover:bg-gray-100">New Window</MenubarItem>
              <MenubarSeparator className="border-t border-gray-200" />
              <MenubarItem className="px-4 py-2 hover:bg-gray-100">Share</MenubarItem>
              <MenubarSeparator className="border-t border-gray-200" />
              <MenubarItem className="px-4 py-2 hover:bg-gray-100">Print</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="hover:text-blue-500">Our Story</MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="hover:text-blue-500">Contact Us</MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="hover:text-blue-500">Cart</MenubarTrigger>
            <MenubarContent className="bg-white border border-gray-200 rounded shadow-lg">
              <MenubarItem className="px-4 py-2 hover:bg-gray-100">View Cart</MenubarItem>
              <MenubarItem className="px-4 py-2 hover:bg-gray-100">Checkout</MenubarItem>
              <MenubarSeparator className="border-t border-gray-200" />
              <MenubarItem className="px-4 py-2 hover:bg-gray-100">Order History</MenubarItem>
              <MenubarSeparator className="border-t border-gray-200" />
              <MenubarItem className="px-4 py-2 hover:bg-gray-100">Clear Cart</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4 p-5 m-5">
          <div className="text-xl">🔍</div> {/* Search Icon */}
          <div className="text-xl">❤️</div> {/* Like Icon */}
          <div className="text-xl">🛒</div> {/* Cart Icon */}
          <Button type="submit" className="w-full">
                Login
              </Button>
        </div>
      </div>
    </Menubar>
  );
};

export default Navbar;
