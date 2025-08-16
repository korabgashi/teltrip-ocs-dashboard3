import { NextResponse } from "next/server";

const API_URL = "https://ocs-api.esimvault.cloud/v1?token=HgljQn4Uhe6Ny07qTzYqPLjJ";

export async function POST(req) {
  try {
    const input = await req.json();
    const body = {
      reportByPackageWeekly: {
        accountId: Number(input.accountId),
        startDate: input.startDate || "2025-06-01"
      }
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 sec timeout

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeout);

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 504 });
  }
}
