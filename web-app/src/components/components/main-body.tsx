import { mainPage } from "../../assets";
import { Button } from "./ui/button";

const MainBody = () => {
  return (
    <div className="bg-green-50 p-8">
      <div className="flex flex-col md:flex-row items-center relative">
        {/* Left Section */}
        <div className="md:w-1/2 mb-8 md:mb-0 z-10 flex flex-col">
          <p className="text-3xl font-bold mb-4">Class Exclusive</p>
          <h1 className="text-lg p-5">
           Women's Collection
          </h1>
          <span className="p-5">UPTO %40 OFF</span>
          <Button className="p-5 w-40">Shop name</Button>
        </div>
        {/* Right Section */}
        <div className="md:w-1/2 relative flex justify-center items-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="text-white text-center">
              <div className="p-4 border-4 border-white w-32 h-32">
              </div>
            </div>
          </div>
          <img
            src={mainPage.main}
            alt="Class Exclusive"
            className="w-full h-auto max-h-screen object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default MainBody;
