import React from "react";
import { DotChartOutlined } from "@ant-design/icons";
import "./Logo.scss";

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <DotChartOutlined />
      </div>
      <div className="logo-text">
        <span className="brand-main">FOOD</span>
        <span className="brand-sub">HUB</span>
      </div>
    </div>
  );
};

export default Logo;
