"use client";

import { useState, useMemo } from "react";
import { Search, Package, ShoppingCart, Building2, MapPin, Calendar, Settings, Pencil, Clock, Box, Mail, CheckCircle, ExternalLink, RotateCcw } from "lucide-react";

/* ─── types ─── */
interface PartItem {
  id: string;
  name: string;
  sku: string;
  price: number | null;
  leadTime: number | null;
  moq: number | null;
  category: string;
}

interface CartItem {
  part: PartItem;
  qty: number;
}

/* ─── catalog data ─── */
const CATEGORIES = ["All", "Metal Parts", "Fasteners", "Cables", "Accessories", "Anchoring", "Cameras"];

const WAREHOUSES: Record<string, string[]> = {
  "United Kingdom": ["PRINCIPLE"],
};

const PARTS: PartItem[] = [
  /* ── Metal Parts ── */
  { id: "1", name: "Front Footpanel NEXT-v2.0.1", sku: "112105008018", price: null, leadTime: 7, moq: 10, category: "Metal Parts" },
  { id: "2", name: "Back Footpanel NEXT-v2.0.1", sku: "112105009016", price: null, leadTime: 7, moq: 10, category: "Metal Parts" },
  { id: "14", name: "Front Skirt NEXT STD Concrete Base v2.1.2", sku: "112000005001", price: 34.15, leadTime: 7, moq: 10, category: "Metal Parts" },
  { id: "15", name: "Rear Skirt NEXT STD Concrete Base v2.1.2", sku: "112000008001", price: null, leadTime: 7, moq: 10, category: "Metal Parts" },
  { id: "16", name: "Side Skirt NEXT Standard Concrete Base v2.1.2", sku: "112000004001", price: 26.80, leadTime: 7, moq: 10, category: "Metal Parts" },
  { id: "17", name: "Anchor Plate NEXT STD Concrete Base v2.1.3", sku: "112000010000", price: 21.95, leadTime: 7, moq: 10, category: "Metal Parts" },
  { id: "18", name: "Anchor Plate Cover NEXT STD Concrete Base v2.1.2", sku: "112000009001", price: 7.80, leadTime: 7, moq: 10, category: "Metal Parts" },
  { id: "27", name: "Halo Kit NEXT STD v2.1.0", sku: "253000022001", price: 230.00, leadTime: 7, moq: 10, category: "Metal Parts" },
  { id: "56", name: "Anchoring Support Assembly with Cover", sku: "253000219000", price: null, leadTime: 7, moq: 10, category: "Metal Parts" },
  { id: "57", name: "Anchoring Support Assembly without Cover", sku: "253000220000", price: null, leadTime: 7, moq: 10, category: "Metal Parts" },

  /* ── Fasteners ── */
  { id: "3", name: "Screw Column Bottom Fix M5x110", sku: "113099011000", price: 1.25, leadTime: 5, moq: 600, category: "Fasteners" },
  { id: "4", name: "Screw Column Top Fix M5x25", sku: "113099010000", price: 8.40, leadTime: 5, moq: 600, category: "Fasteners" },
  { id: "5", name: "Screw Hex Socket Cap M5x60 Zinc", sku: "113000032000", price: 5.90, leadTime: 5, moq: 600, category: "Fasteners" },
  { id: "6", name: "Screw Hex Socket M5x16 Zinc", sku: "113000033000", price: 0.02, leadTime: 5, moq: 600, category: "Fasteners" },
  { id: "7", name: "Nut M5 Nyloc Zinc", sku: "113009044000", price: 2.50, leadTime: 5, moq: 750, category: "Fasteners" },
  { id: "8", name: "Washer Plain Steel M5", sku: "113000012000", price: 0.04, leadTime: 5, moq: 1500, category: "Fasteners" },
  { id: "9", name: "Screw Cross Cheese M4x10", sku: "113000014000", price: 0.04, leadTime: 5, moq: 1200, category: "Fasteners" },
  { id: "10", name: "Washer M4 ECU Earth", sku: "113009020000", price: 0.10, leadTime: 5, moq: 600, category: "Fasteners" },
  { id: "21", name: "Screw Hex Flange M10X35 Stainless", sku: "113000002000", price: 0.30, leadTime: 5, moq: 300, category: "Fasteners" },
  { id: "22", name: "Screw Cross Cheese M4x08", sku: "113000003000", price: 0.10, leadTime: 5, moq: 600, category: "Fasteners" },
  { id: "23", name: "Washer Plain Stainless M12", sku: "113000008000", price: 0.70, leadTime: 5, moq: 500, category: "Fasteners" },
  { id: "24", name: "Screw Socket M8x25 Stainless", sku: "113000011000", price: 0.20, leadTime: 5, moq: 600, category: "Fasteners" },
  { id: "25", name: "Washer Plain Stainless M8", sku: "113000006000", price: 0.02, leadTime: 5, moq: 500, category: "Fasteners" },
  { id: "29", name: "Screw Countersunk Philips M5x12", sku: "113000021000", price: 0.10, leadTime: 5, moq: 600, category: "Fasteners" },
  { id: "30", name: "Screw Cheese Phillips M5x10 Zinc", sku: "113099034000", price: 0.05, leadTime: 5, moq: 600, category: "Fasteners" },

  /* ── Cables ── */
  { id: "28", name: "LED Strip Cable VTAC 4.2W 3000K", sku: "245005002000", price: 6.00, leadTime: 5, moq: 20, category: "Cables" },
  { id: "43", name: "Cable RJ45 FTP 5m (KR-CU to KR-CU)", sku: "127000105000", price: null, leadTime: 5, moq: 20, category: "Cables" },
  { id: "44", name: "Cable RJ45 FTP 2m (ECU to Kerong)", sku: "127028008000", price: null, leadTime: 5, moq: 20, category: "Cables" },
  { id: "45", name: "Cable RJ45 FTP 3m (KR-CU to KR-CU)", sku: "127028002000", price: 2.56, leadTime: 5, moq: 20, category: "Cables" },
  { id: "47", name: "Intrusion Sensor Cable 2m", sku: "245000106000", price: null, leadTime: null, moq: null, category: "Cables" },
  { id: "48", name: "Ground Cable 2m", sku: "245000108000", price: null, leadTime: null, moq: null, category: "Cables" },
  { id: "49", name: "RJ45 Cable 2m", sku: "127000169000", price: null, leadTime: null, moq: null, category: "Cables" },
  { id: "50", name: "Intrusion Sensor Cable 5m", sku: "245000109000", price: null, leadTime: null, moq: null, category: "Cables" },
  { id: "51", name: "Ground Cable 5m", sku: "245000110000", price: null, leadTime: null, moq: null, category: "Cables" },
  { id: "52", name: "RJ45 Cable 5m", sku: "127000170000", price: null, leadTime: null, moq: null, category: "Cables" },
  { id: "53", name: "Intrusion Sensor Cable 10m", sku: "245000112000", price: null, leadTime: null, moq: null, category: "Cables" },
  { id: "54", name: "Ground Cable 10m", sku: "245000113000", price: null, leadTime: null, moq: null, category: "Cables" },
  { id: "55", name: "RJ45 Cable 10m", sku: "127000171000", price: null, leadTime: null, moq: null, category: "Cables" },

  /* ── Accessories ── */
  { id: "11", name: "Top Lock Cover Plastic Flat Key", sku: "114099012000", price: 5.45, leadTime: 5, moq: 100, category: "Accessories" },
  { id: "12", name: "Grommet Conical M25", sku: "114000004000", price: 1.55, leadTime: 5, moq: 30, category: "Accessories" },
  { id: "13", name: "Gasket Trelleborg T-GD36", sku: "114099009000", price: 4.40, leadTime: 5, moq: 30, category: "Accessories" },
  { id: "19", name: "Leveling Feet M20X100", sku: "114000003000", price: 40.00, leadTime: 7, moq: 50, category: "Accessories" },
  { id: "26", name: "Foot Rubber M8x80 Inox Varisom", sku: "114002008000", price: 4.40, leadTime: 5, moq: 50, category: "Accessories" },
  { id: "46", name: "Locker Key (Flat Key Cod.4)", sku: "114079007000", price: null, leadTime: 5, moq: 20, category: "Accessories" },

  /* ── Anchoring ── */
  { id: "20", name: "MTP Anchor M12x110", sku: "114000002000", price: 7.60, leadTime: 7, moq: 25, category: "Anchoring" },
  { id: "31", name: "Chemical Injection Mortar 360ML", sku: "115000006000", price: 15.05, leadTime: 5, moq: 10, category: "Anchoring" },
  { id: "32", name: "Chemical Anchor Sleeve Ø20x135", sku: "115000003000", price: 1.95, leadTime: 5, moq: 10, category: "Anchoring" },
  { id: "33", name: "Threaded Rod + Nut + Washer M12x140", sku: "113000037000", price: 3.70, leadTime: 5, moq: 450, category: "Anchoring" },
  { id: "34", name: "Threaded Rod + Nut + Washer M12x200", sku: "113000133000", price: 6.10, leadTime: 5, moq: 450, category: "Anchoring" },
  { id: "35", name: "Chemical Anchor Sleeve Ø18x130-200mm", sku: "115000011000", price: 2.70, leadTime: 5, moq: 450, category: "Anchoring" },
  { id: "36", name: "Epoxy Chemical Injection WIT-PE-1000", sku: "115000005000", price: 44.00, leadTime: 5, moq: 30, category: "Anchoring" },
  { id: "37", name: "Asphalt Tie Bolt Ø16x155mm M16", sku: "113000062000", price: 11.60, leadTime: 6, moq: 100, category: "Anchoring" },
  { id: "38", name: "Thread Reducer M16-M12", sku: "113000063000", price: 3.75, leadTime: 6, moq: 100, category: "Anchoring" },
  { id: "39", name: "Hex Bolt M12x30 Stainless", sku: "113000064000", price: 0.30, leadTime: 5, moq: 300, category: "Anchoring" },
  { id: "40", name: "Large Washer M12 Stainless", sku: "113000041000", price: 0.15, leadTime: 5, moq: 600, category: "Anchoring" },

  /* ── Cameras ── */
  { id: "41", name: "Camera Left", sku: "246000100000", price: null, leadTime: 14, moq: 1, category: "Cameras" },
  { id: "42", name: "Camera Right", sku: "246000098000", price: null, leadTime: 14, moq: 1, category: "Cameras" },
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
  .part-price.no-price {
    color: var(--muted);
    font-weight: 600;
    font-size: 12px;
  }
  .part-meta {
    display: flex;
    gap: 8px;
    margin-top: 4px;
    font-size: 11px;
    color: var(--muted);
  }
  .part-meta span {
    display: inline-flex;
    align-items: center;
    gap: 2px;
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

  /* ─ email confirmation ─ */
  .email-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: var(--shadow);
    overflow: hidden;
    margin-bottom: 16px;
  }
  .email-banner {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    padding: 32px 24px;
    text-align: center;
  }
  .email-banner-icon {
    width: 56px; height: 56px;
    border-radius: 999px;
    background: #10b981;
    color: #fff;
    display: inline-grid;
    place-items: center;
    margin-bottom: 12px;
  }
  .email-banner h2 {
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 4px;
    color: #065f46;
  }
  .email-banner p {
    font-size: 14px;
    color: #047857;
    margin: 0;
  }
  .email-body {
    padding: 28px 24px;
  }
  .email-subject {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 4px;
  }
  .email-subject-value {
    font-size: 13px;
    color: var(--muted);
    margin: 0 0 20px;
    line-height: 1.5;
  }
  .email-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 20px 0;
  }
  .email-text {
    font-size: 14px;
    color: #374151;
    line-height: 1.7;
    margin: 0 0 16px;
  }
  .email-summary-table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 13px;
  }
  .email-summary-table th {
    text-align: left;
    font-weight: 700;
    color: var(--muted);
    padding: 8px 12px;
    background: #f9fafb;
    border-bottom: 1px solid var(--border);
    font-size: 12px;
  }
  .email-summary-table th:nth-child(2) { text-align: center; }
  .email-summary-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #f3f4f6;
    color: var(--text);
  }
  .email-summary-table td:nth-child(2) { text-align: center; }
  .email-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
  }
  .email-disclaimer {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 13px;
    color: #92400e;
    line-height: 1.6;
    margin: 20px 0 0;
  }
  .email-signature {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }
  .email-sig-thanks {
    font-size: 14px;
    color: #374151;
    margin: 0 0 4px;
  }
  .email-sig-dept {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 2px;
  }
  .email-sig-company {
    font-size: 16px;
    font-weight: 800;
    color: #C4553A;
    letter-spacing: 1px;
    margin: 0;
  }
  .new-order-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 44px;
    border-radius: 999px;
    background: var(--primary);
    color: #fff;
    border: none;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
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
function formatEuro(val: number | null) {
  if (val === null) return "—";
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
      setCart([...cart, { part, qty: part.moq ?? 1 }]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(
      cart
        .map((c) => {
          if (c.part.id !== id) return c;
          const minQty = c.part.moq ?? 1;
          const newQty = c.qty + delta;
          if (newQty < minQty) return c;
          return { ...c, qty: newQty };
        })
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((c) => c.part.id !== id));
  };

  const total = cart.reduce((sum, c) => sum + (c.part.price ?? 0) * c.qty, 0);
  const hasUnpriced = cart.some((c) => c.part.price === null);

  return (
    <>
      <div className="card">
        <h2 className="card-title">Select Parts</h2>

        <div className="search-box">
          <span className="search-icon"><Search size={16} /></span>
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
                <div className="part-thumb"><Package size={36} strokeWidth={1.5} /></div>
                <div className="part-info">
                  <div className="part-name">{part.name}</div>
                  <div className="part-sku">{part.sku}</div>
                  {part.price !== null ? (
                    <div className="part-price">{formatEuro(part.price)}</div>
                  ) : (
                    <div className="part-price no-price">Price on request</div>
                  )}
                  <div className="part-meta">
                    {part.leadTime !== null && <span><Clock size={11} /> {part.leadTime}wk</span>}
                    {part.moq !== null && <span>MOQ {part.moq}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart */}
        <div className="cart-section">
          <div className="cart-header">
            <span className="cart-title"><ShoppingCart size={16} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />Selected Items ({cart.reduce((s, c) => s + c.qty, 0)})</span>
            <span className="cart-total">{formatEuro(total)}{hasUnpriced ? "*" : ""}</span>
          </div>
          {hasUnpriced && (
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>* Some items require price confirmation</div>
          )}
          {cart.length === 0 ? (
            <div className="cart-empty">No items selected</div>
          ) : (
            cart.map((item) => (
              <div key={item.part.id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.part.name}</div>
                  <div className="cart-item-price">{item.part.price !== null ? `${formatEuro(item.part.price)} each` : "Price on request"}</div>
                </div>
                <div className="cart-controls">
                  <button className="qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(item.part.id, -1); }}>−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button className="qty-btn" onClick={(e) => { e.stopPropagation(); updateQty(item.part.id, 1); }}>+</button>
                  <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeItem(item.part.id); }}>✕</button>
                </div>
                <div className="cart-item-subtotal">{item.part.price !== null ? formatEuro(item.part.price * item.qty) : "—"}</div>
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
  onBack, onEditLocation, onEditParts, onSubmit,
}: {
  country: string;
  warehouse: string;
  deliveryDate: string;
  cart: CartItem[];
  onBack: () => void;
  onEditLocation: () => void;
  onEditParts: () => void;
  onSubmit: () => void;
}) {
  const total = cart.reduce((sum, c) => sum + (c.part.price ?? 0) * c.qty, 0);
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);
  const hasUnpriced = cart.some((c) => c.part.price === null);

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
        subtotal: c.part.price !== null ? c.part.price * c.qty : null,
      })),
      total,
      hasUnpricedItems: hasUnpriced,
    };
    console.log("Order payload:", payload);
    onSubmit();
  };

  return (
    <>
      <div className="card">
        <h2 className="card-title">Confirm Order</h2>

        <div className="confirm-row">
          <span className="confirm-icon"><Building2 size={18} /></span>
          <div>
            <div className="confirm-label">Partner</div>
            <div className="confirm-value">Evri</div>
          </div>
        </div>

        <div className="confirm-row">
          <span className="confirm-icon"><MapPin size={18} /></span>
          <div>
            <div className="confirm-label">Country</div>
            <div className="confirm-value">{country}</div>
            <div className="confirm-label" style={{ marginTop: 4 }}>Warehouse</div>
            <div className="confirm-value">{warehouse}</div>
          </div>
          <button className="confirm-edit" onClick={onEditLocation} title="Edit"><Pencil size={14} /></button>
        </div>

        <div className="confirm-row">
          <span className="confirm-icon"><Calendar size={18} /></span>
          <div>
            <div className="confirm-label">Desired Delivery Date</div>
            <div className="confirm-value">{formatDate(deliveryDate)}</div>
          </div>
        </div>

        {/* Items */}
        <div className="items-header">
          <span className="items-title"><Settings size={16} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />Items ({totalQty})</span>
          <button className="confirm-edit" onClick={onEditParts} title="Edit"><Pencil size={14} /></button>
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
                <td>{item.part.price !== null ? formatEuro(item.part.price) : <span style={{ color: "#9ca3af", fontSize: 12 }}>On request</span>}</td>
                <td className="subtotal">{item.part.price !== null ? formatEuro(item.part.price * item.qty) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="order-total-row">
          <span className="order-total-label">Total</span>
          <span className="order-total-value">{formatEuro(total)}{hasUnpriced ? "*" : ""}</span>
        </div>
        {hasUnpriced && (
          <div style={{ fontSize: 12, color: "#9ca3af", textAlign: "right", marginTop: 4 }}>* Some items require price confirmation</div>
        )}
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

/* ─── Step 4: Email Confirmation ─── */
function StepEmailConfirmation({
  country, warehouse, deliveryDate, cart, requestNumber,
  onNewOrder,
}: {
  country: string;
  warehouse: string;
  deliveryDate: string;
  cart: CartItem[];
  requestNumber: string;
  onNewOrder: () => void;
}) {
  const submittedDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const total = cart.reduce((sum, c) => sum + (c.part.price ?? 0) * c.qty, 0);
  const hasUnpriced = cart.some((c) => c.part.price === null);

  return (
    <>
      <div className="email-card">
        <div className="email-banner">
          <div className="email-banner-icon"><CheckCircle size={28} /></div>
          <h2>Order Submitted</h2>
          <p>Request #{requestNumber} has been sent for processing</p>
        </div>

        <div className="email-body">
          <div className="email-subject">Subject:</div>
          <div className="email-subject-value">
            Acknowledgement of Request #{requestNumber} — Warehouse {warehouse}, {country}
          </div>

          <hr className="email-divider" />

          <p className="email-text">Dear Evri,</p>

          <p className="email-text">
            We have successfully received your request <strong>#{requestNumber}</strong>, submitted on{" "}
            <strong>{submittedDate}</strong>, for Warehouse <strong>{warehouse}</strong> in <strong>{country}</strong>.
          </p>

          <p className="email-text">Please find a summary of your order details below:</p>

          <table className="email-summary-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th style={{ textAlign: "right" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.part.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.part.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.part.sku}</div>
                  </td>
                  <td>{item.qty}</td>
                  <td style={{ textAlign: "right" }}>{item.part.price !== null ? formatEuro(item.part.price) : <span style={{ color: "#9ca3af", fontSize: 12 }}>On request</span>}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "#10b981" }}>{item.part.price !== null ? formatEuro(item.part.price * item.qty) : "—"}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ fontWeight: 800, fontSize: 15, borderBottom: "none", paddingTop: 14 }}>Total</td>
                <td style={{ textAlign: "right", fontWeight: 800, fontSize: 15, borderBottom: "none", paddingTop: 14 }}>{formatEuro(total)}{hasUnpriced ? "*" : ""}</td>
              </tr>
            </tbody>
          </table>
          {hasUnpriced && (
            <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "right" }}>* Some items require price confirmation</div>
          )}

          <p className="email-text" style={{ marginTop: 20 }}>
            <strong>Request Link:</strong>{" "}
            <a href="#" className="email-link">
              View Request #{requestNumber} <ExternalLink size={14} />
            </a>
          </p>

          <div className="email-disclaimer">
            <strong>Disclaimer:</strong> We acknowledge receipt of your request. Items that are not currently in stock
            will be processed, and we will revert with the expected delivery date within 5 working days.
          </div>

          <div className="email-signature">
            <p className="email-sig-thanks">Thanks,</p>
            <p className="email-sig-dept">Supply Chain Department</p>
            <p className="email-sig-company">BLOQ.IT</p>
          </div>
        </div>
      </div>

      <button className="new-order-btn" onClick={onNewOrder}>
        <RotateCcw size={16} /> Submit New Order
      </button>
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
  const [requestNumber, setRequestNumber] = useState("");

  const handleSubmit = () => {
    const num = "REQ-" + Date.now().toString().slice(-6);
    setRequestNumber(num);
    setStep(4);
  };

  const handleNewOrder = () => {
    setStep(1);
    setCountry("");
    setWarehouse("");
    setDeliveryDate("");
    setCart([]);
    setRequestNumber("");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="spares-page">
        <div className="spares-header">
          <h1>Order Parts - Evri</h1>
          <p>Select the parts you need and submit your order</p>
        </div>

        {step <= 3 && <Stepper step={step} />}

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
            onSubmit={handleSubmit}
          />
        )}

        {step === 4 && (
          <StepEmailConfirmation
            country={country} warehouse={warehouse}
            deliveryDate={deliveryDate} cart={cart}
            requestNumber={requestNumber}
            onNewOrder={handleNewOrder}
          />
        )}
      </div>
    </>
  );
}
