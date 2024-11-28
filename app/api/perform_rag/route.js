// app/api/perform_rag/route.js
export const runtime = "nodejs";
export async function POST(request) {
  try {
    const { query } = await request.json();

    const response = await fetch(
      "https://codebase-rag-backend.onrender.com/perform_rag",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Server error: ${response.status}` }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify({ response: data.response }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
