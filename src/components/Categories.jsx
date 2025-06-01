import React from "react";
import { useParams, Link } from "react-router-dom";

const products = {
  electronics: [
    { id: 1, name: "Smartphone", price: 699, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Laptop", price: 1299, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80" },
  ],
  clothing: [
    { id: 3, name: "T-shirt", price: 19, image: "https://images.unsplash.com/photo-1520975694581-0a3caa23b5c3?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Jeans", price: 49, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" },
  ],
  books: [
    { id: 5, name: "The Great Gatsby", price: 15, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80" },
    { id: 6, name: "1984", price: 12, image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80" },
  ],
  toys: [
    { id: 7, name: "Lego Set", price: 59, image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=400&q=80" },
    { id: 8, name: "Action Figure", price: 29, image: "https://images.unsplash.com/photo-1523906630133-f6934a56a57c?auto=format&fit=crop&w=400&q=80" },
  ],
};

export default function Categories() {
  const { categoryId } = useParams();
  const categoryProducts = products[categoryId] || [];

  return (
    <main style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 15px" }}>
      <h2 style={{ marginBottom: "30px", textTransform: "capitalize" }}>
        {categoryId} Products
      </h2>
      {categoryProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "25px",
          }}
        >
          {categoryProducts.map((prod) => (
            <div
              key={prod.id}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow:
                  "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
                src={prod.image}
                alt={prod.name}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
              <div style={{ padding: "15px" }}>
                <h3 style={{ margin: "0 0 10px", fontWeight: 600 }}>
                  {prod.name}
                </h3>
                <p style={{ fontWeight: "700", color: "#B12704" }}>
                  ${prod.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link to="/" style={{ display: "inline-block", marginTop: "30px", color: "#007185" }}>
        ← Back to Home
      </Link>
    </main>
  );
}
