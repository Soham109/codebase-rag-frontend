export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { query, callback_url } = await request.json();

    if (!query || !callback_url) {
      return new Response(
        JSON.stringify({
          error: "Both 'query' and 'callback_url' are required.",
        }),
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://codebase-rag-backend.onrender.com/perform_rag",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, callback_url }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: `Server error: ${response.status}, ${errorText}`,
        }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in /api/perform_rag:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
