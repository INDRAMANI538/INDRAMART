import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#232f3e",
        color: "white",
        textAlign: "center",
        padding: "20px 15px",
        marginTop: "40px",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px" }}>
        &copy; {new Date().getFullYear()} MyAmazon. All rights reserved.
      </p>
    </footer>
  );
}
