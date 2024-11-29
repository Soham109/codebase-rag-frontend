export const runtime = "nodejs";

export async function POST(request) {
  try {
    const callbackData = await request.json();
    console.log("Received RAG callback:", callbackData);

    const { task_id, response } = callbackData;

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
