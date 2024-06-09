import React from "react";
import "@/assets/styles/global.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

const layout = ({ children }) => {
  return (
    <html>
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default layout;
