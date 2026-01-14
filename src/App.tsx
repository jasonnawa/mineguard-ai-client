import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DocumentView from "./pages/DocumentView";
const App: React.FC = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
          <Route path="/documents/:id" element={<DocumentView />} />
      </Routes>
    </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
