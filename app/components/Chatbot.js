// components/Chatbot.js

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FaPaperPlane, FaMoon, FaSun, FaArrowDown } from "react-icons/fa";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I am your Codebase-RAG assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);

  // Persist theme preference using localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Scroll to the latest message
  useEffect(() => {
    if (!showScrollButton) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showScrollButton]);

  // Handle scroll to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
        if (scrollTop + clientHeight < scrollHeight - 100) {
          setShowScrollButton(true);
        } else {
          setShowScrollButton(false);
        }
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/perform_rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        text: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: messages.length + 2,
        sender: "bot",
        text: "Sorry, something went wrong. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const Message = useCallback(({ msg }) => {
    return (
      <div
        className={`flex ${
          msg.sender === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div className="relative">
          <div
            className={`max-w-2xl px-5 py-3 rounded-lg shadow-md transition-colors duration-300 ${
              msg.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-900"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={duotoneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        fontSize: "0.9rem",
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className={`bg-gray-200 text-red-500 px-1 py-0.5 rounded ${
                        className || ""
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.text}
            </ReactMarkdown>
            <div className="mt-2 flex justify-end">
              <span className="text-xs text-gray-600">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }, []);

  return (
    <div
      className={`flex flex-col h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      } transition-colors duration-500`}
    >
      {/* Header */}
      <header
        className={`shadow-md ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } transition-colors duration-500 rounded-b-3xl`}
      >
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Codebase-RAG Chatbot</h1>
          <button
            onClick={toggleTheme}
            className="text-gray-600 hover:text-gray-800 focus:outline-none text-2xl transition-colors duration-300"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="space-y-6">
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-2xl px-5 py-3 bg-gray-300 text-gray-900 rounded-lg shadow-md animate-pulse">
                  <p>Bot is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {showScrollButton && (
          <button
            onClick={handleScrollToBottom}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
            aria-label="Scroll to bottom"
          >
            <FaArrowDown />
          </button>
        )}
      </main>

      {/* Input Area */}
      <footer
        className={`shadow-inner ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } transition-colors duration-500 rounded-t-3xl`}
      >
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center space-x-4">
            <textarea
              className={`flex-1 border ${
                theme === "dark"
                  ? "border-gray-700 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              } rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-300`}
              placeholder="Type your message and press Enter..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
              aria-label="Message Input"
            />
            <button
              className={`bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none transition-colors duration-300 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handleSend}
              disabled={isLoading}
              aria-label="Send Message"
            >
              {isLoading ? (
                <div className="loader ease-linear rounded-full border-2 border-t-2 border-white h-5 w-5"></div>
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        .loader {
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "#2d3748" : "#f1f1f1"};
        }

        ::-webkit-scrollbar-thumb {
          background-color: ${theme === "dark" ? "#4a5568" : "#c1c1c1"};
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
