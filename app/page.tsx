"use client";

import { FormEvent, useState } from "react";

// ---------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------
const WEBHOOK_URL = "https://n8n.vamonos.digital/webhook/lead-intake";
const CORRECT_PIN = "5215";
// ---------------------------------------------------------------

type FieldName = "pin";

type LeadFormData = {
  industry: string;
  education: string;
  employees: string;
  location: string;
  jobTitle: string;
  pin: string;
};

const initialFormData: LeadFormData = {
  industry: "",
  education: "",
  employees: "",
  location: "",
  jobTitle: "",
  pin: "",
};

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
      industry: formData.industry.trim(),
      education: formData.education.trim(),
      employees: formData.employees.trim(),
      location: formData.location.trim(),
      jobTitle: formData.jobTitle.trim(),
      pin: formData.pin.trim(),
    };

    if (!data.pin) {
      setInvalidFields(new Set(["pin"]));
      setStatus({ kind: "err", message: "Please fill in all required fields." });
      return;
    }

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
    setInvalidFields(new Set());
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
          <label htmlFor="industry">Industry &amp; keywords</label>
          <input
            id="industry"
            name="industry"
            type="text"
            placeholder="automotive, construction, real estate…"
            value={formData.industry}
            onChange={(e) => updateField("industry", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="education">Education</label>
          <input
            id="education"
            name="education"
            type="text"
            placeholder="e.g. Bachelor's degree"
            value={formData.education}
            onChange={(e) => updateField("education", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="employees"># Employees</label>
          <input
            id="employees"
            name="employees"
            type="text"
            placeholder="e.g. 1-10"
            value={formData.employees}
            onChange={(e) => updateField("employees", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. San Francisco, CA"
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="jobTitle">Job title</label>
          <input
            id="jobTitle"
            name="jobTitle"
            type="text"
            placeholder="e.g. Project Manager"
            value={formData.jobTitle}
            onChange={(e) => updateField("jobTitle", e.target.value)}
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
