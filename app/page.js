// pages/index.js
"use client";
import Head from "next/head";
import Chatbot from "./components/Chatbot";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Head>
        <title>Codebase-RAG Chatbot</title>
        <meta
          name="description"
          content="A chatbot interface for querying your codebase using RAG."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Chatbot />
    </div>
  );
}
