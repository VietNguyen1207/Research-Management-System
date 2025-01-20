import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import { useMemo } from "react";

export const StandardLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div className="main-wrapper">
        <Header />
        <div className="lg:mb-28 md:mb-72 mb-96 pb-32 min-h-screen">
          <Outlet />
        </div>
        <Footer />
      </div>
    </Layout>
  );
};
