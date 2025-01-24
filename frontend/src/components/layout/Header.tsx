// Header.tsx
import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <h1>My App</h1>
      </div>
      <nav>
        <ul style={navStyle}>
          <li style={navItemStyle}>
            <Link href="/">Home</Link>
          </li>
          <li style={navItemStyle}>
            <Link href="/about">About</Link>
          </li>
          <li style={navItemStyle}>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#333",
  color: "white",
};

const logoStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
};

const navStyle: React.CSSProperties = {
  listStyle: "none",
  display: "flex",
  gap: "20px",
};

const navItemStyle: React.CSSProperties = {
  fontSize: "18px",
};

export default Header;
