"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------
const WEBHOOK_URL = "https://n8n.vamonos.digital/webhook/lead-intake";
const CORRECT_PIN = "5215";
// ---------------------------------------------------------------

type Option = { value: string; label: string };

const INDUSTRY_OPTIONS: Option[] = [
  { value: "information-technology", label: "Information Technology & Services" },
  { value: "construction", label: "Construction" },
  { value: "marketing-advertising", label: "Marketing & Advertising" },
  { value: "real-estate", label: "Real Estate" },
  { value: "health-wellness-fitness", label: "Health, Wellness & Fitness" },
  { value: "automotive", label: "Automotive" },
  { value: "financial-services", label: "Financial Services" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "hospitality", label: "Hospitality" },
  { value: "other", label: "Other" },
];

const EMPLOYEE_OPTIONS: Option[] = [
  { value: "1-10", label: "1-10" },
  { value: "11-20", label: "11-20" },
  { value: "21-50", label: "21-50" },
  { value: "51-100", label: "51-100" },
  { value: "101-200", label: "101-200" },
  { value: "201-500", label: "201-500" },
  { value: "501-1000", label: "501-1,000" },
  { value: "1001-2000", label: "1,001-2,000" },
  { value: "2001-5000", label: "2,001-5,000" },
  { value: "5001-10000", label: "5,001-10,000" },
  { value: "10001+", label: "10,001+" },
];

const JOB_TITLE_OPTIONS: Option[] = [
  { value: "ceo", label: "CEO" },
  { value: "cto", label: "CTO" },
  { value: "cfo", label: "CFO" },
  { value: "vp-sales", label: "VP of Sales" },
  { value: "vp-marketing", label: "VP of Marketing" },
  { value: "director-operations", label: "Director of Operations" },
  { value: "project-manager", label: "Project Manager" },
  { value: "product-manager", label: "Product Manager" },
  { value: "marketing-manager", label: "Marketing Manager" },
  { value: "sales-manager", label: "Sales Manager" },
  { value: "software-engineer", label: "Software Engineer" },
  { value: "business-development-manager", label: "Business Development Manager" },
  { value: "account-executive", label: "Account Executive" },
  { value: "hr-manager", label: "HR Manager" },
  { value: "operations-manager", label: "Operations Manager" },
];

type FieldName = "pin";

type LeadFormData = {
  industry: string[];
  employees: string;
  jobTitle: string[];
  location: string[];
  emailStatusVerified: boolean;
  pin: string;
};

const initialFormData: LeadFormData = {
  industry: [],
  employees: "",
  jobTitle: [],
  location: [],
  emailStatusVerified: true,
  pin: "",
};

function MultiSelectField({
  id,
  options,
  values,
  onChange,
  placeholder,
}: {
  id: string;
  options?: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function labelFor(value: string) {
    return options?.find((opt) => opt.value === value)?.label ?? value;
  }

  function addValue(value: string) {
    const trimmed = value.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setQuery("");
    setOpen(false);
  }

  function removeValue(value: string) {
    onChange(values.filter((v) => v !== value));
  }

  const trimmedQuery = query.trim();
  const filteredOptions = (options ?? []).filter(
    (opt) => !values.includes(opt.value) && opt.label.toLowerCase().includes(trimmedQuery.toLowerCase())
  );
  const exactOptionMatch = options?.some(
    (opt) =>
      opt.value.toLowerCase() === trimmedQuery.toLowerCase() || opt.label.toLowerCase() === trimmedQuery.toLowerCase()
  );
  const showCustomAdd = trimmedQuery.length > 0 && !exactOptionMatch && !values.includes(trimmedQuery);
  const dropdownVisible = open && (showCustomAdd || filteredOptions.length > 0);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        addValue(filteredOptions[0].value);
      } else if (trimmedQuery) {
        addValue(trimmedQuery);
      }
    } else if (e.key === "Backspace" && !query && values.length) {
      removeValue(values[values.length - 1]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="multiselect" ref={containerRef}>
      <div className="multiselect-control" onClick={() => setOpen(true)}>
        {values.map((v) => (
          <span className="tag" key={v}>
            {labelFor(v)}
            <button
              type="button"
              className="tag-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeValue(v);
              }}
              aria-label={`Remove ${labelFor(v)}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          className="multiselect-input"
          value={query}
          placeholder={values.length ? "" : placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
      {dropdownVisible && (
        <div className="multiselect-dropdown">
          {showCustomAdd && (
            <button
              type="button"
              className="multiselect-option multiselect-option-custom"
              onClick={() => addValue(trimmedQuery)}
            >
              Add “{trimmedQuery}”
            </button>
          )}
          {filteredOptions.map((opt) => (
            <button type="button" key={opt.value} className="multiselect-option" onClick={() => addValue(opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [invalidFields, setInvalidFields] = useState<Set<FieldName>>(new Set());
  const [status, setStatus] = useState<{ kind: "ok" | "err"; message: string } | null>(null);
  const [pinError, setPinError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    const data = {
      industry: formData.industry,
      employees: formData.employees,
      jobTitle: formData.jobTitle,
      location: formData.location,
      emailStatus: formData.emailStatusVerified,
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
          <MultiSelectField
            id="industry"
            options={INDUSTRY_OPTIONS}
            values={formData.industry}
            onChange={(values) => updateField("industry", values)}
            placeholder="Add industries or keywords…"
          />
        </div>

        <div className="field">
          <label htmlFor="employees"># Employees</label>
          <select
            id="employees"
            name="employees"
            value={formData.employees}
            onChange={(e) => updateField("employees", e.target.value)}
          >
            <option value="">Select employee range</option>
            {EMPLOYEE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="jobTitle">Job title</label>
          <MultiSelectField
            id="jobTitle"
            options={JOB_TITLE_OPTIONS}
            values={formData.jobTitle}
            onChange={(values) => updateField("jobTitle", values)}
            placeholder="Add job titles…"
          />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <MultiSelectField
            id="location"
            values={formData.location}
            onChange={(values) => updateField("location", values)}
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        <div className="field checkbox-field">
          <input
            id="emailStatus"
            name="emailStatus"
            type="checkbox"
            checked={formData.emailStatusVerified}
            onChange={(e) => updateField("emailStatusVerified", e.target.checked)}
          />
          <label htmlFor="emailStatus" className="checkbox-label">
            Verified emails only
          </label>
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
