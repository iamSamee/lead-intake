"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

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

const LUSHA_INDUSTRY_OPTIONS: Option[] = [
  { value: "business-services", label: "Business Services" },
  { value: "community-nonprofit", label: "Community & Nonprofit" },
  { value: "construction", label: "Construction" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "farming-ranching-forestry", label: "Farming, Ranching & Forestry" },
  { value: "finance", label: "Finance" },
  { value: "government", label: "Government" },
  { value: "healthcare", label: "Healthcare" },
  { value: "hospitality", label: "Hospitality" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "oil-gas-mining", label: "Oil, Gas and Mining" },
  { value: "real-estate", label: "Real Estate" },
  { value: "utilities", label: "Utilities" },
  { value: "retail-wholesale-trade", label: "Retail and Wholesale Trade" },
  { value: "technology-information-media", label: "Technology, Information and Media" },
  { value: "transportation-logistics", label: "Transportation and Logistics" },
];

const LUSHA_EMPLOYEE_OPTIONS: Option[] = [
  { value: "1-10", label: "1-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "501-1000", label: "501-1,000" },
  { value: "1001-5000", label: "1,001-5,000" },
  { value: "5001-10000", label: "5,001-10,000" },
  { value: "10001-100000", label: "10,001-100,000" },
  { value: "100001+", label: "100,001+" },
];

const LUSHA_COMPANY_TYPE_OPTIONS: Option[] = [
  { value: "private-company", label: "Private Company" },
  { value: "public-company", label: "Public Company" },
  { value: "educational", label: "Educational" },
  { value: "government", label: "Government" },
  { value: "non-profit", label: "Non Profit" },
  { value: "self-employed", label: "Self Employed" },
];

const LUSHA_COMPANY_KEYWORDS_OPTIONS: Option[] = [
  { value: "advertising", label: "Advertising" },
  { value: "automotive", label: "Automotive" },
  { value: "business-development", label: "Business development" },
  { value: "digital-marketing", label: "Digital marketing" },
  { value: "education", label: "Education" },
  { value: "enterprise-resource-planning", label: "Enterprise resource planning" },
  { value: "finance", label: "Finance" },
  { value: "investment", label: "Investment" },
  { value: "management", label: "Management" },
  { value: "project-management", label: "Project management" },
  { value: "public-relations", label: "Public relations" },
  { value: "real-estate", label: "Real estate" },
  { value: "recruitment", label: "Recruitment" },
  { value: "research", label: "Research" },
  { value: "security", label: "Security" },
  { value: "social-media", label: "Social media" },
];

const LUSHA_COMPANY_LOCATION_OPTIONS: Option[] = [
  { value: "united-states", label: "United States" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "india", label: "India" },
  { value: "california-united-states", label: "California, United States" },
  { value: "new-york-united-states", label: "New York, United States" },
  { value: "new-york-city-new-york-united-states", label: "New York City, New York, United States" },
  { value: "mumbai-india", label: "Mumbai, India" },
  { value: "north-america", label: "North America" },
  { value: "london-united-kingdom", label: "London, United Kingdom" },
  { value: "emea", label: "EMEA" },
  { value: "australia", label: "Australia" },
  { value: "france", label: "France" },
  { value: "germany", label: "Germany" },
  { value: "dubai-united-arab-emirates", label: "Dubai, United Arab Emirates" },
  { value: "sydney-australia", label: "Sydney, Australia" },
  { value: "paris-france", label: "Paris, France" },
  { value: "toronto-canada", label: "Toronto, Canada" },
  { value: "texas-united-states", label: "Texas, United States" },
];

const OCEAN_COMPANY_SIZE_OPTIONS: Option[] = [
  { value: "0-1", label: "0-1" },
  { value: "2-10", label: "2-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "501-1000", label: "501-1,000" },
  { value: "1001-5000", label: "1,001-5,000" },
  { value: "5001-10000", label: "5,001-10,000" },
  { value: "10001-50000", label: "10,001-50,000" },
  { value: "50001-100000", label: "50,001-100,000" },
  { value: "100001-500000", label: "100,001-500,000" },
  { value: "500000+", label: "500,000+" },
];

const OCEAN_KEYWORDS_OPTIONS: Option[] = [
  { value: "construction", label: "Construction" },
  { value: "structural", label: "Structural" },
  { value: "engineering", label: "Engineering" },
  { value: "project", label: "Project" },
  { value: "building", label: "Building" },
  { value: "design", label: "Design" },
  { value: "planning", label: "Planning" },
  { value: "projects", label: "Projects" },
  { value: "structural-design", label: "Structural design" },
  { value: "civil-engineering", label: "Civil engineering" },
  { value: "civil", label: "Civil" },
  { value: "concrete", label: "Concrete" },
];

const OCEAN_INDUSTRY_OPTIONS: Option[] = [
  { value: "administrative-services", label: "Administrative Services" },
  { value: "advertising", label: "Advertising" },
  { value: "agriculture-and-farming", label: "Agriculture and Farming" },
  { value: "apps", label: "Apps" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
  { value: "biotechnology", label: "Biotechnology" },
  { value: "clothing-and-apparel", label: "Clothing and Apparel" },
  { value: "commerce-and-shopping", label: "Commerce and Shopping" },
  { value: "community-and-lifestyle", label: "Community and Lifestyle" },
  { value: "consumer-electronics", label: "Consumer Electronics" },
  { value: "consumer-goods", label: "Consumer Goods" },
  { value: "content-and-publishing", label: "Content and Publishing" },
  { value: "data-and-analytics", label: "Data and Analytics" },
  { value: "design", label: "Design" },
  { value: "education", label: "Education" },
  { value: "energy", label: "Energy" },
  { value: "events", label: "Events" },
  { value: "financial-services", label: "Financial Services" },
  { value: "food-and-beverage", label: "Food and Beverage" },
  { value: "gaming", label: "Gaming" },
  { value: "government-and-military", label: "Government and Military" },
  { value: "hardware", label: "Hardware" },
  { value: "health-care", label: "Health Care" },
  { value: "information-technology", label: "Information Technology" },
  { value: "internet-services", label: "Internet Services" },
  { value: "lending-and-investments", label: "Lending and Investments" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "media-and-entertainment", label: "Media and Entertainment" },
  { value: "messaging-and-telecommunications", label: "Messaging and Telecommunications" },
  { value: "mobile", label: "Mobile" },
  { value: "music-and-audio", label: "Music and Audio" },
  { value: "natural-resources", label: "Natural Resources" },
  { value: "navigation-and-mapping", label: "Navigation and Mapping" },
  { value: "payments", label: "Payments" },
  { value: "platforms", label: "Platforms" },
  { value: "privacy-and-security", label: "Privacy and Security" },
  { value: "professional-services", label: "Professional Services" },
  { value: "real-estate", label: "Real Estate" },
  { value: "sales-and-marketing", label: "Sales and Marketing" },
  { value: "science-and-engineering", label: "Science and Engineering" },
  { value: "software", label: "Software" },
  { value: "sports", label: "Sports" },
  { value: "sustainability", label: "Sustainability" },
  { value: "transportation", label: "Transportation" },
  { value: "travel-and-tourism", label: "Travel and Tourism" },
  { value: "video", label: "Video" },
];

const LEAD_COUNT_OPTIONS = ["5", "10", "20", "25"];

const DATA_SOURCE_OPTIONS: Option[] = [
  { value: "apollo", label: "Apollo" },
  { value: "lusha", label: "Lusha" },
  { value: "ocean-io", label: "Ocean.io" },
];

type MultiFieldKey =
  | "industry"
  | "employees"
  | "jobTitle"
  | "location"
  | "lushaCompanyName"
  | "lushaCompanyLocation"
  | "lushaCompanyKeywords"
  | "lushaIndustry"
  | "lushaEmployeeHeadcount"
  | "lushaCompanyType"
  | "oceanCompanySize"
  | "oceanIndustry"
  | "oceanOfficeLocation"
  | "oceanHeadquarterLocation"
  | "oceanKeywords";

type FieldConfig = {
  key: MultiFieldKey;
  label: string;
  options?: Option[];
  placeholder: string;
};

const APOLLO_FIELDS: FieldConfig[] = [
  { key: "industry", label: "Industry & keywords", options: INDUSTRY_OPTIONS, placeholder: "Add industries or keywords…" },
  { key: "employees", label: "# Employees", options: EMPLOYEE_OPTIONS, placeholder: "Add employee ranges…" },
  { key: "jobTitle", label: "Job title", options: JOB_TITLE_OPTIONS, placeholder: "Add job titles…" },
  { key: "location", label: "Location", placeholder: "e.g. San Francisco, CA" },
];

const LUSHA_FIELDS: FieldConfig[] = [
  { key: "lushaCompanyName", label: "Company name", placeholder: "Add company names…" },
  { key: "lushaCompanyLocation", label: "Company location", options: LUSHA_COMPANY_LOCATION_OPTIONS, placeholder: "Add company locations…" },
  { key: "lushaCompanyKeywords", label: "Company keywords", options: LUSHA_COMPANY_KEYWORDS_OPTIONS, placeholder: "Add keywords…" },
  { key: "lushaIndustry", label: "Industry", options: LUSHA_INDUSTRY_OPTIONS, placeholder: "Add industries…" },
  { key: "lushaEmployeeHeadcount", label: "Employee headcount", options: LUSHA_EMPLOYEE_OPTIONS, placeholder: "Add headcount ranges…" },
  { key: "lushaCompanyType", label: "Company type", options: LUSHA_COMPANY_TYPE_OPTIONS, placeholder: "Add company types…" },
];

const OCEAN_FIELDS: FieldConfig[] = [
  { key: "oceanCompanySize", label: "Company size", options: OCEAN_COMPANY_SIZE_OPTIONS, placeholder: "Add company size ranges…" },
  { key: "oceanIndustry", label: "Industry", options: OCEAN_INDUSTRY_OPTIONS, placeholder: "Add industries…" },
  { key: "oceanOfficeLocation", label: "Office location", placeholder: "e.g. Germany" },
  { key: "oceanHeadquarterLocation", label: "Headquarter location", placeholder: "e.g. Germany" },
  { key: "oceanKeywords", label: "Keywords", options: OCEAN_KEYWORDS_OPTIONS, placeholder: "Add keywords…" },
];

const DATA_SOURCE_FIELDS: Record<string, FieldConfig[]> = {
  apollo: APOLLO_FIELDS,
  lusha: LUSHA_FIELDS,
  "ocean-io": OCEAN_FIELDS,
};

type FieldName = "pin";

type LeadFormData = {
  dataSource: string;
  industry: string[];
  employees: string[];
  jobTitle: string[];
  location: string[];
  lushaCompanyName: string[];
  lushaCompanyLocation: string[];
  lushaCompanyKeywords: string[];
  lushaIndustry: string[];
  lushaEmployeeHeadcount: string[];
  lushaCompanyType: string[];
  oceanCompanySize: string[];
  oceanIndustry: string[];
  oceanOfficeLocation: string[];
  oceanHeadquarterLocation: string[];
  oceanKeywords: string[];
  leadCount: string;
  emailStatusVerified: boolean;
  pin: string;
};

const initialFormData: LeadFormData = {
  dataSource: "apollo",
  industry: [],
  employees: [],
  jobTitle: [],
  location: [],
  lushaCompanyName: [],
  lushaCompanyLocation: [],
  lushaCompanyKeywords: [],
  lushaIndustry: [],
  lushaEmployeeHeadcount: [],
  lushaCompanyType: [],
  oceanCompanySize: [],
  oceanIndustry: [],
  oceanOfficeLocation: ["Germany"],
  oceanHeadquarterLocation: ["Germany"],
  oceanKeywords: [],
  leadCount: "10",
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

  function updateMultiField(key: MultiFieldKey, values: string[]) {
    setFormData((prev) => ({ ...prev, [key]: values }));
  }

  const activeFields = DATA_SOURCE_FIELDS[formData.dataSource] ?? [];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    const sourceData: Record<string, string[]> = {};
    activeFields.forEach((field) => {
      sourceData[field.key] = formData[field.key];
    });

    const data = {
      dataSource: formData.dataSource,
      ...sourceData,
      leadCount: Number(formData.leadCount),
      emailStatus: formData.emailStatusVerified,
      pin: formData.pin.trim(),
    };

    if (!data.pin) {
      setInvalidFields(new Set(["pin"]));
      setStatus({ kind: "err", message: "Please fill in all required fields." });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: { error?: string } = await response.json().catch(() => ({}));

      if (response.ok) {
        setInvalidFields(new Set());
        setPinError(false);
        setStatus({ kind: "ok", message: "Lead submitted. It's on its way through the enrichment workflow." });
        setFormData(initialFormData);
      } else if (response.status === 401) {
        setInvalidFields(new Set(["pin"]));
        setPinError(true);
        setStatus({ kind: "err", message: result.error ?? "Submission blocked — PIN did not match." });
      } else {
        setInvalidFields(new Set());
        setPinError(false);
        setStatus({ kind: "err", message: result.error ?? "Something went wrong. Try again." });
      }
    } catch {
      setStatus({
        kind: "err",
        message: "Couldn't reach the server. Check your connection and try again.",
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
          <label htmlFor="dataSource">Data source</label>
          <select
            id="dataSource"
            name="dataSource"
            value={formData.dataSource}
            onChange={(e) => updateField("dataSource", e.target.value)}
          >
            {DATA_SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {activeFields.map((field) => (
          <div className="field" key={field.key}>
            <label htmlFor={field.key}>{field.label}</label>
            <MultiSelectField
              id={field.key}
              options={field.options}
              values={formData[field.key]}
              onChange={(values) => updateMultiField(field.key, values)}
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <div className="field">
          <label htmlFor="leadCount">Number of leads</label>
          <select
            id="leadCount"
            name="leadCount"
            value={formData.leadCount}
            onChange={(e) => updateField("leadCount", e.target.value)}
          >
            {LEAD_COUNT_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
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
    </div>
  );
}
