import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const pin = typeof body.pin === "string" ? body.pin.trim() : "";
  if (!pin) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  if (pin !== process.env.SUBMISSION_PIN) {
    return NextResponse.json({ error: "Submission blocked — PIN did not match." }, { status: 401 });
  }

  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Webhook is not configured on the server." }, { status: 500 });
  }

  const dataSource = Array.isArray(body.dataSource) ? body.dataSource : [];

  const payload = {
    industry: body.industry,
    employees: body.employees,
    jobTitle: body.jobTitle,
    location: body.location,
    leadCount: body.leadCount,
    emailStatus: body.emailStatus,
    dataSource,
    dataSourceCount: dataSource.length,
  };

  let webhookResponse: Response;
  try {
    webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the workflow. Check your connection and try again." },
      { status: 502 }
    );
  }

  if (!webhookResponse.ok) {
    return NextResponse.json(
      {
        error: `Workflow responded with an error (status ${webhookResponse.status}). Nothing was lost — try again.`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
