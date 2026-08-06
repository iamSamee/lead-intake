"use client";

import { FormEvent, useState } from "react";

// ---------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------
const WEBHOOK_URL = "https://n8n.vamonos.digital/webhook/lead-intake";
const CORRECT_PIN = "5215";
// ---------------------------------------------------------------

type FieldName = "name" | "email" | "company" | "website" | "pin";

type LeadFormData = {
  name: string;
  email: string;
  id: string;
  company: string;
  website: string;
  phone: string;
  pin: string;
};

const initialFormData: LeadFormData = {
  name: "",
  email: "",
  id: "",
  company: "",
  website: "",
  phone: "",
  pin: "",
};

function isValidUrl(value: string): boolean {
  if (!value) return true; // optional field
  try {
    new URL(value.startsWith("http") ? value : `https://${value}`);
    return true;
  } catch {
    return false;
  }
}

export default function Home() {
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [invalidFields, setInvalidFields] = useState<Set<FieldName>>(new Set());
  const [status, setStatus] = useState<{ kind: "ok" | "err"; message: string } | null>(null);
  const [pinError, setPinError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof LeadFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    const data = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      id: formData.id.trim(),
      company: formData.company.trim(),
      website: formData.website.trim(),
      phone: formData.phone.trim(),
      pin: formData.pin.trim(),
    };

    const missing = new Set<FieldName>();
    if (!data.name) missing.add("name");
    if (!data.email) missing.add("email");
    if (!data.company) missing.add("company");
    if (!data.pin) missing.add("pin");

    if (missing.size) {
      setInvalidFields(missing);
      setStatus({ kind: "err", message: "Please fill in all required fields." });
      return;
    }

    if (!isValidUrl(data.website)) {
      setInvalidFields(new Set(["website"]));
      setStatus({ kind: "err", message: "That website URL doesn't look right." });
      return;
    }

    setInvalidFields(new Set());

    // PIN gate — client-side only. Anyone who can view this page's source
    // can see CORRECT_PIN, so treat this as a soft gate, not real security.
    // For real protection, validate the PIN inside the n8n workflow itself
    // (e.g. an IF node right after Webhook).
    if (data.pin !== CORRECT_PIN) {
      setInvalidFields(new Set(["pin"]));
      setPinError(true);
      setStatus({ kind: "err", message: "Submission blocked — PIN did not match." });
      return;
    }
    setPinError(false);

    const { pin, ...payload } = data;
    void pin;

    setSubmitting(true);
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus({ kind: "ok", message: "Lead submitted. It's on its way through the enrichment workflow." });
        setFormData(initialFormData);
      } else {
        setStatus({
          kind: "err",
          message: `Workflow responded with an error (status ${response.status}). Nothing was lost — try again.`,
        });
      }
    } catch {
      setStatus({
        kind: "err",
        message: "Couldn't reach the workflow. Check the webhook URL and your connection, then try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function inputClass(field: FieldName) {
    return invalidFields.has(field) ? "invalid" : "";
  }

  return (
    <div className="wrap">
      <div className="eyebrow">Apollo Lead Intake</div>
      <h1>Add a lead to the pipeline</h1>
      <p className="sub">
        Fill in the details below. A valid PIN is required to submit — the entry is sent straight to the enrichment
        workflow.
      </p>

      <form noValidate onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">
            Full name <span className="req">required</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Doe"
            required
            className={inputClass("name")}
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="email">
            Email <span className="req">required</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@company.com"
            required
            className={inputClass("email")}
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="leadId">ID</label>
          <input
            id="leadId"
            name="id"
            type="text"
            placeholder="Lead / record ID (optional)"
            value={formData.id}
            onChange={(e) => updateField("id", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="company">
            Company name <span className="req">required</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Acme Inc."
            required
            className={inputClass("company")}
            value={formData.company}
            onChange={(e) => updateField("company", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="website">Website URL</label>
          <input
            id="website"
            name="website"
            type="text"
            placeholder="acme.com"
            className={inputClass("website")}
            value={formData.website}
            onChange={(e) => updateField("website", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 555 123 4567"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>

        <div className="pin-block">
          <label htmlFor="pin">
            Submission PIN <span className="req">required</span>
          </label>
          <input
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            maxLength={8}
            placeholder="••••"
            required
            className={inputClass("pin")}
            value={formData.pin}
            onChange={(e) => updateField("pin", e.target.value)}
          />
          <div className={`hint${pinError ? " error" : ""}`}>
            {pinError ? "Incorrect PIN. Check with your team lead and try again." : "Ask your team lead for the current PIN."}
          </div>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit lead"}
        </button>

        {status && <div className={`status show ${status.kind}`}>{status.message}</div>}
      </form>

      <div className="config-note">webhook target — n8n.vamonos.digital/webhook/lead-intake</div>
    </div>
  );
}
