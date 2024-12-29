
import { RouterProvider } from "react-router";
import "./global.css";
import "./assets/scss/auth.scss"
import Slider from "react-slick";
import router from "./routes/router";

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
