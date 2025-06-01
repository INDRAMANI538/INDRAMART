import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "books", name: "Books" },
  { id: "toys", name: "Toys" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#232f3e",
        padding: "10px 20px",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#febd69",
          marginRight: "30px",
          letterSpacing: "2px",
        }}
      >
        MyAmazon
      </Link>

      {/* Categories Dropdown */}
      <div
        style={{ position: "relative" }}
        ref={dropdownRef}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "4px",
            fontWeight: 600,
            userSelect: "none",
          }}
          aria-haspopup="true"
          aria-expanded={open}
        >
          Categories ▼
        </button>
        {open && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              left: 0,
              backgroundColor: "#37475a",
              borderRadius: "6px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              minWidth: "200px",
              maxHeight: "300px",
              overflowY: "auto",
              zIndex: 200,
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 20px",
                  color: "white",
                  fontWeight: "500",
                  borderBottom: "1px solid #4a5a73",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#febd69")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flexGrow: 1 }} />

      {/* Links */}
      <NavLink
        to="/customer-care"
        style={({ isActive }) => ({
          color: isActive ? "#febd69" : "white",
          fontWeight: 600,
          marginLeft: "20px",
        })}
      >
        Customer Care
      </NavLink>
    </nav>
  );
}
