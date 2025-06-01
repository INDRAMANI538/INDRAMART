import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1510552776732-03e61cf4b144?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "clothing",
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "books",
    name: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "toys",
    name: "Toys",
    image:
      "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Home() {
  return (
    <main style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 15px" }}>
      {/* Banner */}
      <section
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "10px",
          height: "320px",
          marginBottom: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: "40px",
          color: "white",
          boxShadow: "inset 0 0 0 1000px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: "700", marginBottom: "10px" }}>
          Discover Amazing Deals
        </h1>
        <p style={{ fontSize: "20px", maxWidth: "600px" }}>
          Shop millions of products across electronics, fashion, books, and toys with fast shipping.
        </p>
      </section>

      {/* Categories Grid */}
      <section>
        <h2 style={{ marginBottom: "20px" }}>Shop by Category</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {categories.map((cat) => (
            <Link
              to={`/categories/${cat.id}`}
              key={cat.id}
              style={{
                display: "block",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow:
                  "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
                backgroundColor: "white",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                color: "#111",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)";
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{ width: "100%", height: "140px", objectFit: "cover" }}
              />
              <h3 style={{ padding: "15px 0", fontWeight: "600" }}>
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
