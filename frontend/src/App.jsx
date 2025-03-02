import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import QR from "./assets/qr.png";
import Markdown from "react-markdown";

const App = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatActive, setIsChatActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [conversationId]);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (message.trim() === "") return;

    setLoading(true);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: "user", text: message },
    ]);

    try {
      const response = await fetch(
        `https://python-chatbot-8kjt.onrender.com/chat/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            conversation_id: conversationId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error with API request");
      }

      const data = await response.json();
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "ai", text: data.response },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-[#1E2138] via-[#14182D] to-[#03040B] backdrop-blur-md ">
      <div className="hidden sm:block ">
        <div className="card bg-white w-96 shadow-xl rounded-2xl">
          <h1
            className="text-5xl pt-5 pb-5 text-center font-bold tracking-wide drop-shadow-2xl 
          bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 
          text-transparent bg-clip-text animate-pulse"
          >
            Zylo AI
          </h1>
          <p className="text-sm text-center text-gray-400 mb-10">
            Your personal AI-Powered ChatBot
          </p>
          <figure className="px-10 pt-10 ">
            <img src={QR} alt="qr" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title p-4">Scan this QR Code</h2>
            <p className="pb-4">
              Or visit{" "}
              <a href="https://miran-chatbot.netlify.app/">
                <span className="text-blue-900">miran-chatbot.netlify.app</span>
              </a>{" "}
              <br />
              on your Smartphone
            </p>
          </div>
        </div>
        <h4 className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-300/10 text-center">
          Developed with ❤ by Miran
        </h4>
      </div>
      <div className="w-full h-full sm:max-w-lg sm:w-full sm:h-full rounded-none shadow-2xl p-6 flex flex-col sm:hidden">
        <div className="flex justify-between items-center mb-5">
          <h1
            className="text-2xl font-bold  tracking-wide drop-shadow-2xl 
             bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 
             text-transparent bg-clip-text animate-pulse"
          >
            Zylo AI
          </h1>
        </div>
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 mb-5 rounded-xl shadow-inner p-2 hide-scrollbar"
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } `}
            >
              <div
                className={`max-w-[90%] whitespace-pre-wrap break-words py-2 rounded-full shadow-md text-sm md:text-base ${
                  msg.sender === "user"
                    ? "bg-gray-600/20 text-[#ECECEC] px-5"
                    : "shadow-none text-[#ECECEC]"
                } `}
              >
                {msg.sender === "ai" ? (
                  <Markdown>{msg.text}</Markdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-xs p-3 rounded-full text-[#ECECEC] animate-pulse shadow-md">
                typing...
              </div>
            </div>
          )}
        </div>
        {isChatActive && (
          <form onSubmit={sendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-full focus:outline-none focus:ring-1 focus:ring-black  text-[#ECECEC] text-sm md:text-base placeholder-gray-300/50"
              placeholder="Ask Anything"
            />
            <button
              type="submit"
              className="bg-[#ECECEC] text-black py-3 px-6 rounded-full text-sm md:text-base font-medium shadow-md hover:bg-gray-400 transition disabled:opacity-75"
              disabled={loading || !message.trim()}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default App;
