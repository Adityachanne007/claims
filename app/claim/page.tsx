"use client";

import { useState, useRef, useCallback } from "react";

/* ─── types ─── */
type IssueType = "" | "missing_parts" | "damaged_locker_module" | "faulty_component" | "other";
type MissingFrom = "" | "module" | "main_locker";

interface Part {
  id: number;
  partNumber: string;
  description: string;
  quantity: string;
}

interface UploadedFile {
  id: number;
  file: File;
  preview: string;
}

/* ─── CSS ─── */
const css = `
  :root {
    --bg: #f6f7fb;
    --card: #ffffff;
    --border: #e6e8ef;
    --muted: #6b7280;
    --text: #1f2937;
    --primary: #2563eb;
    --success: #34d399;
    --danger: #ef4444;
    --shadow: 0 2px 10px rgba(16,24,40,.04);
  }

  .claim-page {
    max-width: 1180px;
    margin: 20px auto 48px;
    padding: 0 18px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: var(--text);
  }

  .claim-header {
    text-align: center;
    margin: 8px 0 20px;
  }
  .claim-header h1 {
    font-size: 34px;
    line-height: 1.15;
    margin: 0;
    font-weight: 800;
  }
  .claim-header p {
    margin: 8px 0 0;
    color: var(--muted);
    font-size: 16px;
  }

  .step-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 18px 0 14px;
    gap: 12px;
  }
  .step-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #ecfdf5;
    color: #10b981;
    border: 2px solid #bbf7d0;
    border-radius: 999px;
    padding: 8px 14px;
    font-weight: 700;
    font-size: 14px;
  }
  .step-pill .dot {
    width: 18px; height: 18px; border-radius: 50%;
    display: inline-grid; place-items: center;
    background: #10b981; color: #fff; font-size: 12px;
  }
  .step-number {
    width: 30px; height: 30px; border-radius: 999px;
    background: #f3f4f6; color: #9ca3af;
    display: grid; place-items: center;
    font-weight: 800;
    font-size: 13px;
  }

  .accordion {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .claim-section {
    border-top: 1px solid var(--border);
    background: var(--card);
  }
  .claim-section:first-child { border-top: none; }

  .section-head {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    padding: 18px 20px;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    color: var(--text);
  }

  .chev {
    color: #9ca3af;
    font-size: 18px;
    transition: transform .2s ease;
  }
  .chev.rotated { transform: rotate(180deg); }

  .section-body {
    padding: 0 20px 22px;
  }

  .field { margin: 0 0 18px; }
  .label {
    display: block;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #6b7280;
  }
  .req { color: var(--danger); }

  .claim-input, .claim-select, .claim-textarea {
    width: 100%;
    max-width: 490px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0 12px;
    font-size: 14px;
    background: #fff;
    color: #374151;
    outline: none;
    font-family: inherit;
  }
  .claim-textarea {
    height: 54px;
    max-width: none;
    min-height: 54px;
    resize: vertical;
    padding: 10px 12px;
  }
  .wide-input { max-width: none !important; }

  .input-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
  }
  .input-row .grow { flex: 1 1 auto; }

  .upload-box {
    border: 2px dashed #93c5fd;
    border-radius: 12px;
    background: #f8fbff;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px;
    color: #4f46e5;
    font-weight: 700;
    position: relative;
    font-size: 14px;
    cursor: pointer;
  }
  .upload-box input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .muted-text {
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
  }

  .thumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 12px;
  }
  .thumb {
    width: 72px; height: 72px; border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff; display: grid; place-items: center;
    font-size: 11px; color: #6b7280;
    overflow: hidden; position: relative;
  }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .thumb-remove {
    position: absolute; top: 4px; right: 4px;
    border: none; background: #ef4444; color: #fff;
    width: 20px; height: 20px; border-radius: 999px;
    cursor: pointer; font-size: 12px;
    display: grid; place-items: center;
  }

  .icon-btn {
    width: 32px; height: 32px; border: none; border-radius: 999px;
    background: var(--primary); color: #fff; cursor: pointer; font-size: 13px;
    display: grid; place-items: center;
    box-shadow: 0 6px 16px rgba(37,99,235,.22);
    flex: 0 0 auto;
  }

  .parts-list {
    display: grid;
    gap: 10px;
    margin: 8px 0 12px;
  }
  .part-item {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    background: #fff;
  }
  .part-grid {
    display: grid;
    grid-template-columns: 1.2fr 2fr 100px auto;
    gap: 10px;
    align-items: end;
  }
  .small-label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 5px;
    font-weight: 700;
  }
  .part-item .claim-input {
    max-width: none;
    width: 100%;
    height: 38px;
    font-size: 13px;
  }
  .danger-link {
    border: none; background: none; color: #dc2626;
    font-weight: 700; cursor: pointer;
    padding: 0 8px 8px;
    font-size: 13px;
  }

  .btn {
    height: 38px; border: none; border-radius: 999px; padding: 0 16px;
    background: var(--primary); color: #fff; font-weight: 800;
    font-size: 14px; cursor: pointer; font-family: inherit;
  }
  .btn-secondary {
    background: #fff; color: #2563eb; border: 1px solid #bfdbfe;
  }
  .actions {
    display: flex; justify-content: flex-end; gap: 12px; padding: 16px 0 0;
  }

  .error-text {
    color: #ef4444; font-size: 12px; margin-top: 6px; font-weight: 600;
  }
  .error-border {
    border-color: #fca5a5 !important;
    box-shadow: 0 0 0 1px #fca5a5 inset;
  }

  /* ─ preview ─ */
  .preview-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow);
    padding: 28px 24px;
  }
  .preview-title {
    font-size: 20px;
    font-weight: 800;
    margin: 0 0 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .preview-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ecfdf5;
    color: #10b981;
    border: 1px solid #bbf7d0;
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 13px;
    font-weight: 700;
  }
  .preview-section {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f3f4f6;
  }
  .preview-section:last-of-type { border-bottom: none; }
  .preview-section-title {
    font-size: 12px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: .5px;
    margin-bottom: 10px;
  }
  .preview-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 6px 0;
  }
  .preview-label {
    font-size: 14px;
    color: var(--muted);
    font-weight: 600;
  }
  .preview-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    text-align: right;
    max-width: 60%;
    word-break: break-word;
  }
  .preview-thumbs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
  }
  .preview-thumb {
    width: 64px; height: 64px; border-radius: 8px;
    border: 1px solid var(--border);
    overflow: hidden;
    background: #f3f4f6;
    display: grid; place-items: center;
    font-size: 10px; color: #6b7280;
  }
  .preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .preview-parts-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .preview-parts-table th {
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    color: var(--muted);
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
  }
  .preview-parts-table td {
    font-size: 13px;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
  }
  .preview-actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 24px;
  }

  /* ─ email preview ─ */
  .email-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  .email-banner {
    background: #10b981;
    color: #fff;
    text-align: center;
    padding: 28px 24px;
  }
  .email-banner-icon {
    width: 48px; height: 48px;
    border-radius: 999px;
    background: rgba(255,255,255,.2);
    display: inline-grid;
    place-items: center;
    font-size: 24px;
    margin-bottom: 12px;
  }
  .email-banner h2 {
    font-size: 20px;
    font-weight: 800;
    margin: 0;
  }
  .email-banner p {
    font-size: 14px;
    opacity: .9;
    margin: 4px 0 0;
  }
  .email-body {
    padding: 28px 24px;
  }
  .email-greeting {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text);
    margin-bottom: 20px;
  }
  .email-details {
    background: #f8fafc;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 20px;
  }
  .email-detail-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
  }
  .email-detail-label {
    font-size: 13px;
    color: var(--muted);
    font-weight: 600;
  }
  .email-detail-value {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
  }
  .email-link-box {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 20px;
  }
  .email-link-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .email-link {
    font-size: 13px;
    color: var(--primary);
    word-break: break-all;
    font-weight: 600;
  }
  .email-text {
    font-size: 14px;
    line-height: 1.7;
    color: #4b5563;
    margin-bottom: 24px;
  }
  .email-signature {
    border-top: 1px solid var(--border);
    padding-top: 16px;
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
  }
  .email-signature strong {
    color: var(--text);
  }
  .email-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 0 24px 24px;
  }

  @media (max-width: 820px) {
    .claim-header h1 { font-size: 26px; }
    .section-head { font-size: 15px; padding: 16px; }
    .section-body { padding: 0 16px 18px; }
    .part-grid { grid-template-columns: 1fr; }
    .input-row { flex-wrap: wrap; }
    .icon-btn { width: 36px; height: 36px; }
  }
`;

/* ─── helpers ─── */
let nextId = 1;
function uid() {
  return nextId++;
}

/* ─── Section component ─── */
function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="claim-section">
      <button className="section-head" type="button" onClick={onToggle}>
        <span>{title}</span>
        <span className={`chev ${open ? "rotated" : ""}`}>⌃</span>
      </button>
      {open && <div className="section-body">{children}</div>}
    </section>
  );
}

/* ─── FileUploader component ─── */
function FileUploader({
  files,
  onChange,
  maxFiles = 5,
  label = "Photos / Videos",
  required = false,
  error,
}: {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  label?: string;
  required?: boolean;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const remaining = maxFiles - files.length;
    const toAdd = selected.slice(0, remaining).map((file) => ({
      id: uid(),
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));
    onChange([...files, ...toAdd].slice(0, maxFiles));
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (id: number) => {
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className="field">
      <label className="label">
        {label} {required && <span className="req">*</span>}
      </label>
      <div className={`upload-box ${error ? "error-border" : ""}`}>
        <span>📷 Add Photos</span>
        <span className="muted-text">
          {files.length}/{maxFiles}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFiles}
        />
      </div>
      {files.length > 0 && (
        <div className="thumbs">
          {files.map((f) => (
            <div key={f.id} className="thumb">
              {f.preview ? (
                <img src={f.preview} alt="" />
              ) : (
                <span>
                  {f.file.name.length > 16
                    ? f.file.name.slice(0, 14) + "…"
                    : f.file.name}
                </span>
              )}
              <button
                type="button"
                className="thumb-remove"
                onClick={() => remove(f.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

/* ─── PartsManager component ─── */
function PartsManager({
  parts,
  onChange,
  error,
}: {
  parts: Part[];
  onChange: (parts: Part[]) => void;
  error?: string;
}) {
  const addPart = () => {
    onChange([
      ...parts,
      { id: uid(), partNumber: "", description: "", quantity: "" },
    ]);
  };

  const removePart = (id: number) => {
    onChange(parts.filter((p) => p.id !== id));
  };

  const updatePart = (id: number, field: keyof Part, value: string) => {
    onChange(
      parts.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="field">
      <label className="label">
        Select the parts that need to be requested{" "}
        <span className="req">*</span>
      </label>
      <div className="muted-text" style={{ marginBottom: 8 }}>
        Claims
      </div>
      <div className="parts-list">
        {parts.map((part) => (
          <div key={part.id} className="part-item">
            <div className="part-grid">
              <div>
                <label className="small-label">Part number</label>
                <input
                  className="claim-input"
                  type="text"
                  placeholder="e.g. P-1001"
                  value={part.partNumber}
                  onChange={(e) =>
                    updatePart(part.id, "partNumber", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="small-label">Description</label>
                <input
                  className="claim-input"
                  type="text"
                  placeholder="Describe the spare part"
                  value={part.description}
                  onChange={(e) =>
                    updatePart(part.id, "description", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="small-label">Quantity</label>
                <input
                  className="claim-input"
                  type="text"
                  placeholder="1"
                  value={part.quantity}
                  onChange={(e) =>
                    updatePart(part.id, "quantity", e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                className="danger-link"
                onClick={() => removePart(part.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn" type="button" onClick={addPart}>
        ＋ Add Part
      </button>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

/* ─── Main page ─── */
export default function ClaimPage() {
  /* form state */
  const [country, setCountry] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [issueFaced, setIssueFaced] = useState<IssueType>("");
  const [partsMissingFrom, setPartsMissingFrom] = useState<MissingFrom>("");

  const [damagedSerial, setDamagedSerial] = useState("");
  const [missingSerial, setMissingSerial] = useState("");
  const [otherDescription, setOtherDescription] = useState("");

  const [issueMedia, setIssueMedia] = useState<UploadedFile[]>([]);
  const [missingPhotos, setMissingPhotos] = useState<UploadedFile[]>([]);

  const [spareParts, setSpareParts] = useState<Part[]>([]);
  const [faultyParts, setFaultyParts] = useState<Part[]>([]);

  /* accordion open state */
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    country: true,
    details: true,
    issue: true,
    missingFrom: true,
    damagedSerial: true,
    faultyParts: true,
    otherDesc: true,
    issueMedia: true,
    missingPhotos: true,
    missingSerial: true,
    spareParts: true,
  });

  /* errors & submitted & confirmed */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [claimNumber] = useState(() => Math.floor(Math.random() * 900) + 100);

  const toggle = useCallback((key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  /* derived visibility */
  const isMissing = issueFaced === "missing_parts";
  const isDamaged = issueFaced === "damaged_locker_module";
  const isFaulty = issueFaced === "faulty_component";
  const isOther = issueFaced === "other";
  const showMissingFollowups =
    isMissing && (partsMissingFrom === "module" || partsMissingFrom === "main_locker");

  const showIssueMedia = isDamaged || isFaulty || isOther;

  /* dynamic titles for missing parts flow */
  const missingPhotosTitle =
    partsMissingFrom === "main_locker"
      ? "4. Picture(s), if needed, of the missing parts' locker placement"
      : "4. Picture(s), if needed, of the missing parts' module placement";
  const missingSerialTitle =
    partsMissingFrom === "main_locker"
      ? "5. Serial number of the main locker missing the part(s)"
      : "5. Serial number of the module missing the part(s)";

  /* issue media section number */
  const issueMediaNumber = isDamaged ? 5 : isFaulty || isOther ? 5 : 5;

  /* handle issue change */
  const handleIssueChange = (val: IssueType) => {
    setIssueFaced(val);
    if (val !== "missing_parts") {
      setPartsMissingFrom("");
    }
    setErrors({});
  };

  /* validate & submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (isDamaged && !damagedSerial.trim()) {
      errs.damagedSerial = "Serial number is required";
    }

    if (showMissingFollowups && !missingSerial.trim()) {
      errs.missingSerial = "Serial number is required";
    }

    if (showMissingFollowups && spareParts.length === 0) {
      errs.spareParts = "Add at least one part";
    }

    if (isFaulty && faultyParts.length === 0) {
      errs.faultyParts = "Add at least one part";
    }

    if (isOther && !otherDescription.trim()) {
      errs.otherDescription = "Description is required";
    }

    if (showIssueMedia && issueMedia.length === 0) {
      errs.issueMedia = "At least one photo/video is required";
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* reset */
  const handleReset = () => {
    setCountry("");
    setWarehouse("");
    setIssueFaced("");
    setPartsMissingFrom("");
    setDamagedSerial("");
    setMissingSerial("");
    setOtherDescription("");
    setIssueMedia([]);
    setMissingPhotos([]);
    setSpareParts([]);
    setFaultyParts([]);
    setErrors({});
    setSubmitted(false);
    setConfirmed(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="claim-page">
        {/* Header */}
        <div className="claim-header">
          <h1>Submit Claim for Evri</h1>
          <p>Please fill out the form below to submit a claim</p>
        </div>

        {/* Step indicator */}
        {!confirmed && (
          <div className="step-row">
            <div className="step-pill">
              <span className="dot">✓</span> Claim Details
            </div>
            <div className="step-number">2</div>
          </div>
        )}

        {/* Email confirmation */}
        {confirmed && (() => {
          const today = new Date();
          const dateStr = today.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
          const issueLabel =
            issueFaced === "missing_parts" ? "Missing Parts" :
            issueFaced === "damaged_locker_module" ? "Damaged Locker/Module" :
            issueFaced === "faulty_component" ? "Faulty Component" :
            issueFaced === "other" ? "Other" : "";
          const randomHash = Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
          return (
            <div className="email-card">
              <div className="email-banner">
                <div className="email-banner-icon">✓</div>
                <h2>Claim Submitted Successfully</h2>
                <p>Your claim has been registered and is being reviewed</p>
              </div>
              <div className="email-body">
                <div className="email-greeting">Dear Client,</div>
                <div className="email-text">
                  We acknowledge receipt of your claim and confirm that it has been successfully registered in our system with the following details:
                </div>

                <div className="email-details">
                  <div className="email-detail-row">
                    <span className="email-detail-label">Claim Number</span>
                    <span className="email-detail-value">{claimNumber}</span>
                  </div>
                  <div className="email-detail-row">
                    <span className="email-detail-label">Client Name</span>
                    <span className="email-detail-value">Evri</span>
                  </div>
                  <div className="email-detail-row">
                    <span className="email-detail-label">Country of Claim</span>
                    <span className="email-detail-value">{country}</span>
                  </div>
                  <div className="email-detail-row">
                    <span className="email-detail-label">3PL Warehouse</span>
                    <span className="email-detail-value">{warehouse}</span>
                  </div>
                  <div className="email-detail-row">
                    <span className="email-detail-label">Issue Type</span>
                    <span className="email-detail-value">{issueLabel}</span>
                  </div>
                  {(isDamaged && damagedSerial) && (
                    <div className="email-detail-row">
                      <span className="email-detail-label">Serial Number</span>
                      <span className="email-detail-value">{damagedSerial}</span>
                    </div>
                  )}
                  {(showMissingFollowups && missingSerial) && (
                    <div className="email-detail-row">
                      <span className="email-detail-label">Serial Number</span>
                      <span className="email-detail-value">{missingSerial}</span>
                    </div>
                  )}
                  <div className="email-detail-row">
                    <span className="email-detail-label">Submission Date</span>
                    <span className="email-detail-value">{dateStr}</span>
                  </div>
                  <div className="email-detail-row">
                    <span className="email-detail-label">Attachments</span>
                    <span className="email-detail-value">{issueMedia.length + missingPhotos.length} file(s)</span>
                  </div>
                  {(spareParts.length > 0 || faultyParts.length > 0) && (
                    <div className="email-detail-row">
                      <span className="email-detail-label">Parts Requested</span>
                      <span className="email-detail-value">{spareParts.length + faultyParts.length} part(s)</span>
                    </div>
                  )}
                </div>

                <div className="email-link-box">
                  <div className="email-link-label">Claim Document</div>
                  <div className="email-link">
                    https://reports.dev.bloqit.io/deployment/claims/review/{randomHash}
                  </div>
                </div>

                <div className="email-text">
                  Thank you for bringing this matter to our attention. Our team is currently reviewing the information provided regarding the reported missing, damaged, or non-functional parts. We will keep you informed of any updates and next steps as soon as possible. Should you have any additional information or documentation that may assist in our assessment, please do not hesitate to share it with us. We appreciate your cooperation and patience.
                </div>

                <div className="email-signature">
                  Kind regards,<br />
                  <strong>Quality Department</strong><br />
                  BLOQ.IT
                </div>
              </div>
              <div className="email-actions">
                <button className="btn btn-secondary" type="button" onClick={handleReset}>
                  Submit New Claim
                </button>
              </div>
            </div>
          );
        })()}

        {/* Preview */}
        {submitted && !confirmed && (
          <div className="preview-card">
            <div className="preview-title">
              Claim Summary
              <span className="preview-badge">✓ Ready to submit</span>
            </div>

            {/* Location */}
            <div className="preview-section">
              <div className="preview-section-title">Location</div>
              <div className="preview-row">
                <span className="preview-label">Country</span>
                <span className="preview-value">{country}</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">3PL Reception Warehouse</span>
                <span className="preview-value">{warehouse}</span>
              </div>
            </div>

            {/* Issue */}
            <div className="preview-section">
              <div className="preview-section-title">Issue Details</div>
              <div className="preview-row">
                <span className="preview-label">Issue Faced</span>
                <span className="preview-value">
                  {issueFaced === "missing_parts" && "Missing Parts"}
                  {issueFaced === "damaged_locker_module" && "Damaged Locker/Module"}
                  {issueFaced === "faulty_component" && "Faulty Component"}
                  {issueFaced === "other" && "Other"}
                </span>
              </div>

              {isMissing && partsMissingFrom && (
                <div className="preview-row">
                  <span className="preview-label">Parts missing from</span>
                  <span className="preview-value">
                    {partsMissingFrom === "module" ? "A module" : "The main locker"}
                  </span>
                </div>
              )}

              {isDamaged && damagedSerial && (
                <div className="preview-row">
                  <span className="preview-label">Serial number</span>
                  <span className="preview-value">{damagedSerial}</span>
                </div>
              )}

              {showMissingFollowups && missingSerial && (
                <div className="preview-row">
                  <span className="preview-label">Serial number</span>
                  <span className="preview-value">{missingSerial}</span>
                </div>
              )}

              {isOther && otherDescription && (
                <div className="preview-row">
                  <span className="preview-label">Description</span>
                  <span className="preview-value">{otherDescription}</span>
                </div>
              )}
            </div>

            {/* Photos */}
            {(issueMedia.length > 0 || missingPhotos.length > 0) && (
              <div className="preview-section">
                <div className="preview-section-title">Attachments</div>
                {issueMedia.length > 0 && (
                  <>
                    <div className="preview-label" style={{ marginBottom: 6 }}>
                      Issue photos/videos ({issueMedia.length})
                    </div>
                    <div className="preview-thumbs">
                      {issueMedia.map((f) => (
                        <div key={f.id} className="preview-thumb">
                          {f.preview ? <img src={f.preview} alt="" /> : f.file.name.slice(0, 10)}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {missingPhotos.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div className="preview-label" style={{ marginBottom: 6 }}>
                      Placement photos ({missingPhotos.length})
                    </div>
                    <div className="preview-thumbs">
                      {missingPhotos.map((f) => (
                        <div key={f.id} className="preview-thumb">
                          {f.preview ? <img src={f.preview} alt="" /> : f.file.name.slice(0, 10)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Spare parts */}
            {(spareParts.length > 0 || faultyParts.length > 0) && (
              <div className="preview-section">
                <div className="preview-section-title">Spare Parts Requested</div>
                <table className="preview-parts-table">
                  <thead>
                    <tr>
                      <th>Part number</th>
                      <th>Description</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...spareParts, ...faultyParts].map((p) => (
                      <tr key={p.id}>
                        <td>{p.partNumber || "—"}</td>
                        <td>{p.description || "—"}</td>
                        <td>{p.quantity || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Actions */}
            <div className="preview-actions">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setSubmitted(false)}
              >
                ← Edit Claim
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setConfirmed(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="accordion" onSubmit={handleSubmit} style={{ display: (submitted || confirmed) ? "none" : undefined }}>
          {/* 1. Country */}
          <Section
            title="1. Country of Claim"
            open={openSections.country}
            onToggle={() => toggle("country")}
          >
            <div className="field">
              <label className="label">
                Country <span className="req">*</span>
              </label>
              <select
                className="claim-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Select country</option>
                <option>United Kingdom</option>
              </select>
            </div>
          </Section>

          {/* 2. Claim Details */}
          <Section
            title="2. Claim Details"
            open={openSections.details}
            onToggle={() => toggle("details")}
          >
            <div className="field">
              <label className="label">
                3PL Reception Warehouse <span className="req">*</span>
              </label>
              <select
                className="claim-select"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                required
              >
                <option value="">Select warehouse</option>
                <option>PRINCIPLE</option>
              </select>
            </div>
          </Section>

          {/* 3. Issue Faced */}
          <Section
            title="3. Issue Faced"
            open={openSections.issue}
            onToggle={() => toggle("issue")}
          >
            <div className="field">
              <label className="label">
                Issue Faced <span className="req">*</span>
              </label>
              <select
                className="claim-select"
                value={issueFaced}
                onChange={(e) => handleIssueChange(e.target.value as IssueType)}
                required
              >
                <option value="">Select issue</option>
                <option value="missing_parts">Missing Parts</option>
                <option value="damaged_locker_module">
                  Damaged Locker/Module
                </option>
                <option value="faulty_component">
                  Faulty Component (Components present but not functioning during
                  installation)
                </option>
                <option value="other">Other</option>
              </select>
            </div>
          </Section>

          {/* 4. Missing Parts → Where from */}
          {isMissing && (
            <Section
              title="4. Parts are missing from"
              open={openSections.missingFrom}
              onToggle={() => toggle("missingFrom")}
            >
              <div className="field">
                <label className="label">
                  Parts are missing from <span className="req">*</span>
                </label>
                <select
                  className="claim-select"
                  value={partsMissingFrom}
                  onChange={(e) =>
                    setPartsMissingFrom(e.target.value as MissingFrom)
                  }
                >
                  <option value="">Select where parts are missing from</option>
                  <option value="module">A module</option>
                  <option value="main_locker">The main locker</option>
                </select>
              </div>
            </Section>
          )}

          {/* 4. Damaged → Serial number */}
          {isDamaged && (
            <Section
              title="4. Serial number of the damaged locker/module"
              open={openSections.damagedSerial}
              onToggle={() => toggle("damagedSerial")}
            >
              <div className="field">
                <label className="label">
                  Serial number <span className="req">*</span>
                </label>
                <div className="input-row">
                  <input
                    className={`claim-input wide-input grow ${errors.damagedSerial ? "error-border" : ""}`}
                    type="text"
                    placeholder="EVRxxxx"
                    value={damagedSerial}
                    onChange={(e) => setDamagedSerial(e.target.value)}
                  />
                  <button className="icon-btn" type="button" title="Scan">
                    ⌘
                  </button>
                </div>
                {errors.damagedSerial && (
                  <div className="error-text">{errors.damagedSerial}</div>
                )}
              </div>
            </Section>
          )}

          {/* 4. Faulty → Parts to request */}
          {isFaulty && (
            <Section
              title="4. Spare parts to request"
              open={openSections.faultyParts}
              onToggle={() => toggle("faultyParts")}
            >
              <PartsManager
                parts={faultyParts}
                onChange={setFaultyParts}
                error={errors.faultyParts}
              />
            </Section>
          )}

          {/* 4. Other → Description */}
          {isOther && (
            <Section
              title="4. Describe the issue"
              open={openSections.otherDesc}
              onToggle={() => toggle("otherDesc")}
            >
              <div className="field">
                <label className="label">
                  Description <span className="req">*</span>
                </label>
                <textarea
                  className={`claim-textarea ${errors.otherDescription ? "error-border" : ""}`}
                  placeholder="Please describe the issue in detail"
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                />
                {errors.otherDescription && (
                  <div className="error-text">{errors.otherDescription}</div>
                )}
              </div>
            </Section>
          )}

          {/* 5. Issue Media (for damaged, faulty, other) */}
          {showIssueMedia && (
            <Section
              title={`${issueMediaNumber}. Picture/Video of the issue`}
              open={openSections.issueMedia}
              onToggle={() => toggle("issueMedia")}
            >
              <FileUploader
                files={issueMedia}
                onChange={setIssueMedia}
                required
                error={errors.issueMedia}
              />
            </Section>
          )}

          {/* Missing parts follow-ups */}
          {showMissingFollowups && (
            <>
              {/* 4. Photos of placement */}
              <Section
                title={missingPhotosTitle}
                open={openSections.missingPhotos}
                onToggle={() => toggle("missingPhotos")}
              >
                <FileUploader
                  files={missingPhotos}
                  onChange={setMissingPhotos}
                  label="Photos"
                />
              </Section>

              {/* 5. Serial number */}
              <Section
                title={missingSerialTitle}
                open={openSections.missingSerial}
                onToggle={() => toggle("missingSerial")}
              >
                <div className="field">
                  <label className="label">
                    Serial number <span className="req">*</span>
                  </label>
                  <div className="input-row">
                    <input
                      className={`claim-input wide-input grow ${errors.missingSerial ? "error-border" : ""}`}
                      type="text"
                      placeholder="EVRxxxx"
                      value={missingSerial}
                      onChange={(e) => setMissingSerial(e.target.value)}
                    />
                    <button className="icon-btn" type="button" title="Scan">
                      ⌘
                    </button>
                  </div>
                  {errors.missingSerial && (
                    <div className="error-text">{errors.missingSerial}</div>
                  )}
                </div>
              </Section>

              {/* 6. Spare parts */}
              <Section
                title="6. Spare parts to request"
                open={openSections.spareParts}
                onToggle={() => toggle("spareParts")}
              >
                <PartsManager
                  parts={spareParts}
                  onChange={setSpareParts}
                  error={errors.spareParts}
                />
              </Section>
            </>
          )}

          {/* Actions */}
          <div style={{ padding: "0 20px 20px" }}>
            <div className="actions">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={handleReset}
              >
                Reset
              </button>
              <button className="btn" type="submit">
                Submit Claim
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
