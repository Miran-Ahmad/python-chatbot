import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import QR from "./assets/qr.png";

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
    <div className="bg-white fixed inset-0 flex justify-center items-center">
      <div className="hidden sm:block">
        {/* <img src={QR} height={200} width={200} /> */}
        <div className="card bg-base-100 w-96 shadow-xl rounded-2xl">
          <figure className="px-10 pt-10">
            <img src={QR} alt="Shoes" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title p-4">Scan this QR Code</h2>
            <p className="pb-4">
              Or visit{" "}
              <a href="https://miran-chatbot.netlify.app/">
                <span className="text-blue-900">
                  https://miran-chatbot.netlify.app/
                </span>
              </a>{" "}
              <br />
              on your Smartphone
            </p>
            <div className="card-actions">
              {/* <button className="btn btn-primary">Buy Now</button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full sm:max-w-lg sm:w-full sm:h-full bg-white rounded-none shadow-2xl p-6 flex flex-col sm:hidden">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl text-black">Zylo AI</h1>
        </div>
        {/* <hr className="mb-6 text-black" /> */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 mb-5 bg-white rounded-xl shadow-inner p-2"
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs py-2 px-5 rounded-full shadow-md text-sm md:text-base ${
                  msg.sender === "user"
                    ? "bg-white text-black"
                    : "shadow-none text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-xs p-3 rounded-xl bg-white text-black animate-pulse shadow-md">
                typing...
              </div>
            </div>
          )}
        </div>

        {isChatActive && (
          <form onSubmit={sendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-black text-sm md:text-base placeholder-black"
              placeholder="Ask Anything"
            />
            <button
              type="submit"
              className="bg-black text-white py-3 px-6 rounded-full text-sm md:text-base font-medium shadow-md hover:bg-gray-400 transition disabled:opacity-75"
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
