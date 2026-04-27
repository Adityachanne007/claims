import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      maxWidth: 600,
      margin: "80px auto",
      padding: "0 24px",
      fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
        Bloq.it — InPost
      </h1>
      <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 36px" }}>
        Select a tool to get started
      </p>

      <div style={{ display: "grid", gap: 14 }}>
        <Link href="/claim" style={{
          display: "block",
          padding: "20px 24px",
          background: "#fff",
          border: "1px solid #e6e8ef",
          borderRadius: 16,
          textDecoration: "none",
          color: "#1f2937",
          textAlign: "left",
          boxShadow: "0 2px 10px rgba(16,24,40,.04)",
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            Submit Claim
          </div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Report missing parts, damaged lockers, faulty components, or other issues
          </div>
        </Link>

        <Link href="/spares" style={{
          display: "block",
          padding: "20px 24px",
          background: "#fff",
          border: "1px solid #e6e8ef",
          borderRadius: 16,
          textDecoration: "none",
          color: "#1f2937",
          textAlign: "left",
          boxShadow: "0 2px 10px rgba(16,24,40,.04)",
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            Order Parts
          </div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Browse the parts catalog, select quantities, and submit a spare parts order
          </div>
        </Link>
      </div>
    </div>
  );
}
