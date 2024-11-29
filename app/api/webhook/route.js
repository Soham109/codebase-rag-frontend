// app/api/webhook/route.js

import { NextResponse } from "next/server";

// In-memory store for task results (suitable for development; use persistent storage in production)
const taskResults = new Map();

/**
 * Handles POST requests from the backend webhook callback.
 * Expected payload: { task_id: string, response: string } or { task_id: string, error: string }
 */
  try {
    const { task_id, response, error } = await request.json();

    if (!task_id) {
      return NextResponse.json(
        { error: "'task_id' is required." },
        { status: 400 }
      );
    }

    if (error) {
      taskResults.set(task_id, { status: "error", error });
    } else {
      taskResults.set(task_id, { status: "completed", response });
    }

    console.log(`Received callback for task_id: ${task_id}`);
    return NextResponse.json({ status: "received" }, { status: 200 });
  } catch (err) {
    console.error("Error in webhook POST handler:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Handles GET requests from the frontend to poll for task results.
 * Query Parameter: task_id
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get("task_id");

    if (!task_id) {
      return NextResponse.json(
        { error: "'task_id' query parameter is required." },
        { status: 400 }
      );
    }

    const result = taskResults.get(task_id);

    if (!result) {
      // Task is still pending
      return NextResponse.json({ status: "pending" }, { status: 200 });
    }

    // Once the result is retrieved, remove it from the store
    taskResults.delete(task_id);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error in webhook GET handler:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
