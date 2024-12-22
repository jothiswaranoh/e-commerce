
import { RouterProvider } from "react-router";
import "./global.css";
import React from 'react'
import router from "./routes/router";

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App