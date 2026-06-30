import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { PageHeader, BtnPrimary, Spinner } from "../../components/UI";
import api from "../../utils/api";
import { recommendations } from "../../data/recommendations";

export default function ColorPalette() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const generateRecommendation = () => {

    if (!selected) {
      alert("Please select a product first.");
      return;
    }

    const recommendation = recommendations[selected.color];

    if (!recommendation) {
      alert("No recommendation found.");
      return;
    }

    setResult(recommendation);
};

  return (
    <DashboardLayout>
      <PageHeader
        title="Color Palette & Style Recommender"
        subtitle="Generate fashion recommendations"
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spinner />
        </div>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {/* Product Selection */}
          <div
            style={{
              background: "rgba(255,249,243,0.95)",
              border: "1px solid rgba(214,197,171,0.7)",
              borderRadius: 14,
              padding: 20,
            }}
          >
            <h3>Select Product</h3>

            <select
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: "1px solid rgba(214,197,171,0.7)",
              }}
              onChange={(e) => {
                const product = products.find(
                  (p) => p._id === e.target.value
                );
                setSelected(product);
              }}
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productName}
                </option>
              ))}
            </select>

            {selected && (
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                }}
              >
                <img
                  src={selected.imageUrl}
                  alt={selected.productName}
                  style={{
                    width: 180,
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />

                <div>
                  <h2>{selected.productName}</h2>

                  <p>
                    <strong>Category:</strong> {selected.category}
                  </p>

                  <p>
                    <strong>Material:</strong> {selected.material}
                  </p>

                  <p>
                    <strong>Color:</strong> {selected.color}
                  </p>

                  <p>
                    <strong>Season:</strong> {selected.season}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <BtnPrimary onClick={generateRecommendation}>
            Generate Recommendation
          </BtnPrimary>

          {/* Recommendation Section */}
<div
  style={{
    background: "rgba(255,249,243,0.95)",
    border: "1px solid rgba(214,197,171,0.7)",
    borderRadius: 14,
    padding: 20,
  }}
>
  <h3>Recommendation</h3>

  {!result ? (
    <p>
      Select a product and click <strong>Generate Recommendation</strong>.
    </p>
  ) : (
    <>
      <h4
  style={{
    color: "#1f1a16",
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 15,
  }}
>
  🎨 Recommended Color Palette
</h4>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          marginTop: 10,
        }}
      >
        {result.palette.map((color) => (
          <div
            key={color}
            title={color}
            style={{
              width: 45,
              height: 45,
              borderRadius: 8,
              background: color,
              border: "2px solid #ddd",
            }}
          ></div>
        ))}
      </div>

      <h4
  style={{
    color: "#1f1a16",
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 15,
  }}
>
  👠 Recommended Accessories
</h4>

      <div
  style={{
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 25,
  }}
>
  {result.accessories.map((item) => (
    <div
      key={item}
      style={{
        padding: "10px 18px",
        background: "#fff",
        border: "1px solid rgba(214,197,171,0.7)",
        borderRadius: 12,
        fontWeight: 500,
      }}
    >
      👠 {item}
    </div>
  ))}
</div>

      <h4
  style={{
    color: "#1f1a16",
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 15,
  }}
>
  🧵 Recommended Fabrics
</h4>

      <div
  style={{
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 25,
  }}
>
  {result.fabrics.map((item) => (
    <div
      key={item}
      style={{
        padding: "10px 18px",
        background: "#fff",
        border: "1px solid rgba(214,197,171,0.7)",
        borderRadius: 12,
        fontWeight: 500,
      }}
    >
      🧵 {item}
    </div>
  ))}
</div>

      <h4
  style={{
    color: "#1f1a16",
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 15,
  }}
>
  🍂 Best Season
</h4>

      <div
  style={{
    display: "inline-block",
    padding: "10px 18px",
    background: "#C9A84C",
    color: "white",
    borderRadius: 30,
    fontWeight: 600,
    marginBottom: 25,
  }}
>
  🍂 {result.season}
</div>

      <h4
  style={{
    color: "#1f1a16",
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 15,
  }}
>
  📊 Style Scores
</h4>

      {Object.entries(result.scores).map(([name, value]) => (
        <div key={name} style={{ marginBottom: 15 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <span style={{ textTransform: "capitalize" }}>{name}</span>
            <span>{value}%</span>
          </div>

          <div
            style={{
              width: "100%",
              height: 10,
              background: "#ddd",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: `${value}%`,
                height: "100%",
                background: "#C9A84C",
                borderRadius: 10,
              }}
            ></div>
          </div>
        </div>
      ))}
    </>
  )}
</div>
        </div>
      )}
    </DashboardLayout>
  );
}