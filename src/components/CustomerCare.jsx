import React, { useState } from "react";

export default function CustomerCare() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "25px", color: "#232f3e" }}>Customer Care</h2>
      {submitted ? (
        <p style={{ fontSize: "18px", color: "#007600" }}>
          Thank you for contacting us, {formData.name}! We'll get back to you shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#232f3e" }}>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                marginBottom: "20px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "16px",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#232f3e" }}>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                marginBottom: "20px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "16px",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#232f3e" }}>
            Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "16px",
                resize: "vertical",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              backgroundColor: "#febd69",
              border: "none",
              padding: "12px 25px",
              fontWeight: "700",
              fontSize: "16px",
              borderRadius: "5px",
              cursor: "pointer",
              color: "#232f3e",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f7c775")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#febd69")}
          >
            Submit
          </button>
        </form>
      )}
    </main>
  );
}
