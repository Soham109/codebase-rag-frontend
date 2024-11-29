// app/api/rag_callback/route.js

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const callbackData = await request.json();
    console.log("Received RAG callback:", callbackData);

    // Extract necessary data from callbackData
    const { task_id, response } = callbackData; // Adjust based on your backend's callback structure

    // You need to handle this data appropriately.
    // This could involve storing the response in a database, sending a real-time update via WebSockets, etc.

    // For simplicity, let's assume you store the response in a database or a state management store.

    return new Response(JSON.stringify({ status: "Callback received" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error handling RAG callback:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
