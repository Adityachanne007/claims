"use client";

import { useState, useMemo } from "react";

/* ─── types ─── */
interface PartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
}

interface CartItem {
  part: PartItem;
  qty: number;
}

/* ─── sample data ─── */
const CATEGORIES = ["All", "Base", "Cables", "Fasteners", "Keys and Locks", "Metal Parts", "Metal Accessories", "Other"];

const WAREHOUSES: Record<string, string[]> = {
  Portugal: ["Oporto Office", "Lisbon Warehouse"],
  France: ["FRDISROU", "FRDISHIL", "FRDISPAR"],
  Spain: ["Madrid Warehouse", "Barcelona Warehouse"],
  Italy: ["Milan Warehouse", "Rome Warehouse"],
  Poland: ["Warsaw Warehouse", "Krakow Warehouse"],
};

const PARTS: PartItem[] = [
  { id: "1", name: "Acc Anchor MTP A4 M12x110", sku: "acc-anchor_MTP_A4_m12x110", price: 83.01, category: "Metal Accessories" },
  { id: "2", name: "Acc Foot Rubber M8x80 Inox Varisom", sku: "acc-foot-rubber-m8x80_inox-varisom", price: 29.15, category: "Metal Accessories" },
  { id: "3", name: "Acc Gasket Trelleborg T GD36", sku: "acc-gasket-trelleborg-T-GD36", price: 92.64, category: "Metal Accessories" },
  { id: "4", name: "Acc Top Lock Flat Key Cod.3 KeyOnly", sku: "acc-top-lock-flat_key_cod.3-KeyOnly", price: 55.26, category: "Keys and Locks" },
  { id: "5", name: "Acc Washer M4 ECU Earth", sku: "acc-washer-M4-ECU_earth", price: 143.44, category: "Fasteners" },
  { id: "6", name: "Cable Power 3m EU", sku: "cable-power-3m-EU", price: 12.50, category: "Cables" },
  { id: "7", name: "Cable Data USB-C 1.5m", sku: "cable-data-usbc-1.5m", price: 8.75, category: "Cables" },
  { id: "8", name: "Base Plate Steel 400x300", sku: "base-plate-steel-400x300", price: 67.30, category: "Base" },
  { id: "9", name: "Base Frame Aluminium L-Type", sku: "base-frame-alu-l-type", price: 124.90, category: "Base" },
  { id: "10", name: "Fastener Bolt M6x20 SS", sku: "fastener-bolt-m6x20-ss", price: 1.85, category: "Fasteners" },
  { id: "11", name: "Fastener Nut M6 SS", sku: "fastener-nut-m6-ss", price: 0.95, category: "Fasteners" },
  { id: "12", name: "Metal Part Bracket Z-Type", sku: "metal-bracket-z-type", price: 34.20, category: "Metal Parts" },
  { id: "13", name: "Metal Part Hinge Heavy Duty", sku: "metal-hinge-heavy-duty", price: 18.60, category: "Metal Parts" },
  { id: "14", name: "Key Cylinder Euro Profile", sku: "key-cylinder-euro", price: 42.00, category: "Keys and Locks" },
  { id: "15", name: "Lock Padlock 40mm Brass", sku: "lock-padlock-40mm-brass", price: 15.90, category: "Keys and Locks" },
  { id: "16", name: "Other Silicone Sealant 300ml", sku: "other-silicone-sealant-300ml", price: 7.45, category: "Other" },
  { id: "17", name: "Other Label Thermal 100x50", sku: "other-label-thermal-100x50", price: 22.00, category: "Other" },
  { id: "18", name: "Cable Network Cat6 5m", sku: "cable-network-cat6-5m", price: 11.20, category: "Cables" },
];

/* ─── CSS ─── */
const css = `
  :root {
    --bg: #f6f7fb;
    --card: #ffffff;
    --border: #e6e8ef;
    --muted: #6b7280;
    --text: #1f2937;
    --primary: #111827;
    --accent: #10b981;
    --danger: #ef4444;
    --shadow: 0 2px 10px rgba(16,24,40,.04);
  }

  .spares-page {
    max-width: 900px;
    margin: 20px auto 48px;
    padding: 0 18px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: var(--text);
  }

  .spares-header {
    text-align: center;
    margin: 8px 0 20px;
  }
  .spares-header h1 {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
  }
  .spares-header p {
    margin: 6px 0 0;
    color: var(--muted);
    font-size: 15px;
  }

  /* ─ stepper ─ */
  .stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin: 0 0 24px;
  }
  .step-dot {
    width: 28px; height: 28px; border-radius: 999px;
    display: grid; place-items: center;
    font-size: 13px; font-weight: 800;
    background: #f3f4f6; color: #9ca3af;
    flex-shrink: 0;
    transition: all .2s;
  }
  .step-dot.done {
    background: #10b981; color: #fff;
  }
  .step-dot.active-dot {
    background: #ecfdf5; color: #10b981;
    border: 2px solid #bbf7d0;
    width: auto; padding: 0 14px;
    font-size: 13px; font-weight: 700;
    gap: 6px; display: inline-flex; align-items: center;
  }
  .step-line {
    width: 80px; height: 2px;
    background: #e5e7eb;
    flex-shrink: 0;
    margin: 0 8px;
  }
  .step-line.done-line { background: #10b981; }

  /* ─ card ─ */
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: var(--shadow);
    padding: 24px;
    margin-bottom: 16px;
  }
  .card-title {
    font-size: 17px;
    font-weight: 800;
    margin: 0 0 20px;
  }

  /* ─ fields ─ */
  .sp-field { margin: 0 0 18px; }
  .sp-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--muted);
  }
  .sp-select, .sp-input, .sp-date {
    width: 100%;
    height: 42px;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0 12px;
    font-size: 14px;
    background: #fff;
    color: var(--text);
    outline: none;
    font-family: inherit;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .sp-date {
    background-image: none;
    cursor: pointer;
  }

  /* ─ nav buttons ─ */
  .nav-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
  }
  .nav-btn {
    height: 40px; border-radius: 999px; padding: 0 24px;
    font-weight: 700; font-size: 14px; cursor: pointer;
    font-family: inherit; border: 1px solid var(--border);
    transition: all .15s;
  }
  .nav-btn-back {
    background: #fff; color: var(--text);
  }
  .nav-btn-next {
    background: var(--primary); color: #fff; border-color: var(--primary);
  }
  .nav-btn-submit {
    background: var(--primary); color: #fff; border-color: var(--primary);
  }
  .nav-btn:disabled {
    opacity: .4; cursor: default;
  }

  /* ─ search ─ */
  .search-box {
    position: relative;
    margin-bottom: 14px;
  }
  .search-box input {
    width: 100%;
    height: 42px;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0 12px 0 38px;
    font-size: 14px;
    background: #fff;
    color: var(--text);
    outline: none;
    font-family: inherit;
  }
  .search-icon {
    position: absolute;
    left: 12px; top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    font-size: 15px;
    pointer-events: none;
  }

  /* ─ category pills ─ */
  .cat-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }
  .cat-pill {
    height: 32px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: #fff;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all .15s;
  }
  .cat-pill.active {
    background: var(--primary);
    color: #fff;
    border-color: var(--primary);
  }

  /* ─ parts grid ─ */
  .parts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }
  .part-card {
    border: 2px solid var(--border);
    border-radius: 14px;
    padding: 0;
    cursor: pointer;
    transition: all .15s;
    position: relative;
    overflow: hidden;
    background: #fff;
  }
  .part-card.selected {
    border-color: #10b981;
    background: #f0fdf4;
  }
  .part-thumb {
    width: 100%;
    aspect-ratio: 1;
    background: #f3f4f6;
    display: grid;
    place-items: center;
    font-size: 36px;
    color: #9ca3af;
  }
  .part-info {
    padding: 10px 12px 12px;
  }
  .part-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.3;
  }
  .part-sku {
    font-size: 11px;
    color: var(--muted);
    margin-top: 2px;
    word-break: break-all;
  }
  .part-price {
    font-size: 14px;
    font-weight: 800;
    margin-top: 4px;
    color: var(--text);
  }
  .part-badge {
    position: absolute;
    top: 8px; right: 8px;
    width: 24px; height: 24px;
    border-radius: 999px;
    background: #10b981;
    color: #fff;
    font-size: 12px;
    font-weight: 800;
    display: grid;
    place-items: center;
  }
  .no-results {
    text-align: center;
    color: var(--muted);
    padding: 40px 0;
    font-size: 14px;
    grid-column: 1 / -1;
  }

  /* ─ cart ─ */
  .cart-section {
    border-top: 1px solid var(--border);
    padding-top: 16px;
  }
  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .cart-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
  }
  .cart-total {
    font-size: 16px;
    font-weight: 800;
  }
  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f3f4f6;
    gap: 12px;
  }
  .cart-item:last-child { border-bottom: none; }
  .cart-item-info {
    flex: 1;
    min-width: 0;
  }
  .cart-item-name {
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cart-item-price {
    font-size: 12px;
    color: var(--muted);
  }
  .cart-controls {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .qty-btn {
    width: 28px; height: 28px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: #fff;
    color: var(--text);
    cursor: pointer;
    font-size: 16px;
    display: grid;
    place-items: center;
    font-family: inherit;
  }
  .qty-val {
    width: 24px;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
  }
  .remove-btn {
    border: none;
    background: none;
    color: var(--danger);
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
    font-weight: 700;
  }
  .cart-item-subtotal {
    font-weight: 700;
    font-size: 14px;
    min-width: 70px;
    text-align: right;
    flex-shrink: 0;
  }
  .cart-empty {
    color: var(--muted);
    font-size: 13px;
    text-align: center;
    padding: 20px 0;
  }

  /* ─ confirm ─ */
  .confirm-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  .confirm-icon {
    width: 20px;
    flex-shrink: 0;
    color: var(--muted);
    font-size: 16px;
    margin-top: 2px;
  }
  .confirm-label {
    font-size: 13px;
    color: var(--muted);
  }
  .confirm-value {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
  }
  .confirm-edit {
    margin-left: auto;
    border: none;
    background: none;
    color: var(--muted);
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
  }

  .items-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 24px 0 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .items-title {
    font-size: 14px;
    font-weight: 700;
  }

  .order-table {
    width: 100%;
    border-collapse: collapse;
  }
  .order-table th {
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    color: var(--muted);
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  .order-table th:nth-child(2),
  .order-table th:nth-child(3),
  .order-table th:nth-child(4) { text-align: right; }
  .order-table td {
    padding: 12px 0;
    font-size: 14px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: top;
  }
  .order-table td:nth-child(2),
  .order-table td:nth-child(3),
  .order-table td:nth-child(4) { text-align: right; }
  .order-table .item-name {
    font-weight: 700;
    font-size: 14px;
  }
  .order-table .item-sku {
    font-size: 11px;
    color: var(--muted);
  }
  .order-table .subtotal { color: #10b981; font-weight: 700; }

  .order-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0 0;
    border-top: 2px solid var(--border);
    margin-top: 4px;
  }
  .order-total-label {
    font-size: 16px;
    font-weight: 800;
  }
  .order-total-value {
    font-size: 24px;
    font-weight: 800;
  }

  @media (max-width: 700px) {
    .parts-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .cart-item { flex-wrap: wrap; }
    .step-line { width: 40px; }
  }
  @media (max-width: 480px) {
    .parts-grid { grid-template-columns: 1fr; }
  }
`;

/* ─── helpers ─── */
function formatEuro(val: number) {
  return "€" + val.toFixed(2);
}

function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .replace(/(\d+)/, (_, n) => {
      const num = parseInt(n);
      const s = ["th", "st", "nd", "rd"];
      const v = num % 100;
      return num + (s[(v - 20) % 10] || s[v] || s[0]);
    });
}

/* ─── Stepper ─── */
function Stepper({ step }: { step: number }) {
  const labels = ["Select Location", "Select Parts", "Confirm Order"];
  return (
    <div className="stepper">
      {labels.map((label, i) => {
        const num = i + 1;
        const isDone = step > num;
        const isActive = step === num;
        return (
          <span key={num} style={{ display: "contents" }}>
            {i > 0 && <div className={`step-line ${step > num ? "done-line" : step === num ? "done-line" : ""}`} />}
            {isDone ? (
              <span className="step-dot done">✓</span>
            ) : isActive ? (
              <span className="step-dot active-dot">
                <span style={{ fontWeight: 800 }}>{num === 3 ? num : "✓"}</span>{" "}
                {label}
              </span>
            ) : (
              <span className="step-dot">{num}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ─── Step 1: Select Location ─── */
function StepLocation({
  country, setCountry,
  warehouse, setWarehouse,
  deliveryDate, setDeliveryDate,
  onNext,
}: {
  country: string;
  setCountry: (v: string) => void;
  warehouse: string;
  setWarehouse: (v: string) => void;
  deliveryDate: string;
  setDeliveryDate: (v: string) => void;
  onNext: () => void;
}) {
  const warehouses = country ? WAREHOUSES[country] || [] : [];
  const canNext = country && warehouse && deliveryDate;

  return (
    <>
      <div className="card">
        <h2 className="card-title">Select Location</h2>

        <div className="sp-field">
          <label className="sp-label">Country</label>
          <select
            className="sp-select"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setWarehouse(""); }}
          >
            <option value="">Select country</option>
            {Object.keys(WAREHOUSES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sp-field">
          <label className="sp-label">Warehouse</label>
          <select
            className="sp-select"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            disabled={!country}
          >
            <option value="">Select warehouse</option>
            {warehouses.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>

        <div className="sp-field">
          <label className="sp-label">Desired Delivery Date</label>
          <input
            className="sp-date"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-row">
        <div />
        <button className="nav-btn nav-btn-next" disabled={!canNext} onClick={onNext}>
          Next
        </button>
      </div>
    </>
  );
}

/* ─── Step 2: Select Parts ─── */
function StepParts({
  cart, setCart,
  onBack, onNext,
}: {
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return PARTS.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const cartMap = useMemo(() => {
    const m = new Map<string, number>();
    cart.forEach((c) => m.set(c.part.id, c.qty));
    return m;
  }, [cart]);

  const togglePart = (part: PartItem) => {
    const existing = cart.find((c) => c.part.id === part.id);
    if (existing) {
      setCart(cart.filter((c) => c.part.id !== part.id));
    } else {
      setCart([...cart, { part, qty: 1 }]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(
      cart
        .map((c) => (c.part.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((c) => c.part.id !== id));
  };

  const total = cart.reduce((sum, c) => sum + c.part.price * c.qty, 0);

  return (
    <>
      <div className="card">
        <h2 className="card-title">Select Parts</h2>

        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search parts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cat-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="parts-grid">
          {filtered.length === 0 && <div className="no-results">No parts found</div>}
          {filtered.map((part) => {
            const qty = cartMap.get(part.id);
            return (
              <div
                key={part.id}
                className={`part-card ${qty ? "selected" : ""}`}
                onClick={() => togglePart(part)}
              >
                {qty && <div className="part-badge">{qty}</div>}
                <div className="part-thumb">📦</div>
                <div className="part-info">
                  <div className="part-name">{part.name}</div>
                  <div className="part-sku">{part.sku}</div>
                  <div className="part-price">{formatEuro(part.price)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart */}
        <div className="cart-section">
          <div className="cart-header">
            <span className="cart-title">🛒 Selected Items ({cart.reduce((s, c) => s + c.qty, 0)})</span>
            <span className="cart-total">{formatEuro(total)}</span>
          </div>
          {cart.length === 0 ? (
            <div className="cart-empty">No items selected</div>
          ) : (
            cart.map((item) => (
              <div key={item.part.id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.part.name}</div>
                  <div className="cart-item-price">{formatEuro(item.part.price)} each</div>
                </div>
                <div className="cart-controls">
                  <button className="qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(item.part.id, -1); }}>−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button className="qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(item.part.id, 1); }}>+</button>
                  <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeItem(item.part.id); }}>✕</button>
                </div>
                <div className="cart-item-subtotal">{formatEuro(item.part.price * item.qty)}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="nav-row">
        <button className="nav-btn nav-btn-back" onClick={onBack}>Back</button>
        <button className="nav-btn nav-btn-next" disabled={cart.length === 0} onClick={onNext}>
          Next
        </button>
      </div>
    </>
  );
}

/* ─── Step 3: Confirm Order ─── */
function StepConfirm({
  country, warehouse, deliveryDate, cart,
  onBack, onEditLocation, onEditParts,
}: {
  country: string;
  warehouse: string;
  deliveryDate: string;
  cart: CartItem[];
  onBack: () => void;
  onEditLocation: () => void;
  onEditParts: () => void;
}) {
  const total = cart.reduce((sum, c) => sum + c.part.price * c.qty, 0);
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);

  const handleSubmit = () => {
    const payload = {
      partner: "Evri",
      country,
      warehouse,
      deliveryDate,
      items: cart.map((c) => ({
        name: c.part.name,
        sku: c.part.sku,
        qty: c.qty,
        price: c.part.price,
        subtotal: c.part.price * c.qty,
      })),
      total,
    };
    alert("Order submitted! Check the browser console for the payload.");
    console.log("Order payload:", payload);
  };

  return (
    <>
      <div className="card">
        <h2 className="card-title">Confirm Order</h2>

        <div className="confirm-row">
          <span className="confirm-icon">🏢</span>
          <div>
            <div className="confirm-label">Partner</div>
            <div className="confirm-value">Evri</div>
          </div>
        </div>

        <div className="confirm-row">
          <span className="confirm-icon">📍</span>
          <div>
            <div className="confirm-label">Country</div>
            <div className="confirm-value">{country}</div>
            <div className="confirm-label" style={{ marginTop: 4 }}>Warehouse</div>
            <div className="confirm-value">{warehouse}</div>
          </div>
          <button className="confirm-edit" onClick={onEditLocation} title="Edit">✏️</button>
        </div>

        <div className="confirm-row">
          <span className="confirm-icon">📅</span>
          <div>
            <div className="confirm-label">Desired Delivery Date</div>
            <div className="confirm-value">{formatDate(deliveryDate)}</div>
          </div>
        </div>

        {/* Items */}
        <div className="items-header">
          <span className="items-title">⚙️ Items ({totalQty})</span>
          <button className="confirm-edit" onClick={onEditParts} title="Edit">✏️</button>
        </div>

        <table className="order-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.part.id}>
                <td>
                  <div className="item-name">{item.part.name}</div>
                  <div className="item-sku">{item.part.sku}</div>
                </td>
                <td>{item.qty}</td>
                <td>{formatEuro(item.part.price)}</td>
                <td className="subtotal">{formatEuro(item.part.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="order-total-row">
          <span className="order-total-label">Total</span>
          <span className="order-total-value">{formatEuro(total)}</span>
        </div>
      </div>

      <div className="nav-row">
        <button className="nav-btn nav-btn-back" onClick={onBack}>Back</button>
        <button className="nav-btn nav-btn-submit" onClick={handleSubmit}>
          Submit Order
        </button>
      </div>
    </>
  );
}

/* ─── Main page ─── */
export default function SparesPage() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="spares-page">
        <div className="spares-header">
          <h1>Order Parts - Evri</h1>
          <p>Select the parts you need and submit your order</p>
        </div>

        <Stepper step={step} />

        {step === 1 && (
          <StepLocation
            country={country} setCountry={setCountry}
            warehouse={warehouse} setWarehouse={setWarehouse}
            deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepParts
            cart={cart} setCart={setCart}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepConfirm
            country={country} warehouse={warehouse}
            deliveryDate={deliveryDate} cart={cart}
            onBack={() => setStep(2)}
            onEditLocation={() => setStep(1)}
            onEditParts={() => setStep(2)}
          />
        )}
      </div>
    </>
  );
}
