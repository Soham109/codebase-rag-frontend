



# Codebase RAG
![Uploading App screenshot.png…]()

A web application (RAG based) leveraging vectorized data storage and text embeddings for efficient data handling and retrieval.

## Overview

This project is a web application that utilizes Pinecone for vectorized data storage and Hugging Face's embedding models for text embeddings. The backend is deployed on Render, while the frontend is built with Next.js and deployed on Vercel. To address request timeout issues (HTTP 504 errors), webhooks have been implemented for asynchronous processing.

> **Note:** The web application may stop working after December due to the expiration of the free tier on Render.

## Features

- **Vectorized Data Storage:** Efficiently store and retrieve vector data using Pinecone.
- **Text Embeddings:** Utilize Hugging Face's models for advanced text embedding.
- **Modern Frontend:** Built with Next.js for a seamless user experience.
- **Scalable Backend:** Deployed on Render for robust performance.
- **Webhook Integration:** Prevents 504 errors by handling long-running requests asynchronously.

## Technologies Used

- **Pinecone:** Vector database for high-performance vector operations.
- **Hugging Face:** State-of-the-art models for text embedding.
- **Next.js:** React framework for server-side rendering and static site generation.
- **Render:** Cloud platform for deploying web applications.
- **Vercel:** Hosting platform optimized for Next.js applications.
- **Webhooks:** Implemented to manage asynchronous tasks and reduce request timeouts.

`
## Acknowledgements

- [Pinecone](https://www.pinecone.io/)
- [Hugging Face](https://huggingface.co/)
- [Next.js](https://nextjs.org/)
- [Render](https://render.com/)
- [Vercel](https://vercel.com/)
