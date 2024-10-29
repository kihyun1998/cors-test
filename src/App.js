// src/App.js
import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

function App() {
  const [endpoint, setEndpoint] = useState("/user/login");
  const [method, setMethod] = useState("POST");
  const [requestBody, setRequestBody] = useState(
    '{\n  "userName": "testuser",\n  "password": "testpassword"\n}'
  );
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRequestBody, setShowRequestBody] = useState(true);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setResponse("");

      let parsedBody;
      try {
        parsedBody = method !== "GET" ? JSON.parse(requestBody) : null;
      } catch (e) {
        throw new Error("Invalid JSON in request body");
      }

      const config = {
        method: method,
        url: `${BASE_URL}${endpoint}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (method !== "GET" && parsedBody) {
        config.data = parsedBody;
      }

      const result = await axios(config);
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (err) {
      setError(
        err.message +
          (err.response
            ? "\n" + JSON.stringify(err.response.data, null, 2)
            : "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>API 테스트 도구</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "flex-start",
        }}
      >
        <select
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
            setShowRequestBody(e.target.value !== "GET");
          }}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100px",
          }}
        >
          {HTTP_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="API 엔드포인트 (예: /api/user/login)"
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            flexGrow: 1,
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          전송
        </button>
      </div>

      <div
        style={{ display: "flex", gap: "20px", height: "calc(100vh - 200px)" }}
      >
        <div style={{ flex: 1 }}>
          <h3>요청</h3>
          {showRequestBody && (
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="JSON 요청 본문을 입력하세요"
              style={{
                width: "100%",
                height: "calc(100% - 40px)",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontFamily: "monospace",
                resize: "none",
              }}
            />
          )}
          {!showRequestBody && (
            <p style={{ color: "#666" }}>
              GET 요청에는 request body가 필요하지 않습니다.
            </p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3>응답</h3>
          {loading && <p>로딩 중...</p>}

          {error && (
            <pre
              style={{
                backgroundColor: "#ffebee",
                padding: "10px",
                borderRadius: "4px",
                whiteSpace: "pre-wrap",
                margin: 0,
                height: "calc(100% - 60px)",
                overflowY: "auto",
              }}
            >
              {error}
            </pre>
          )}

          {response && (
            <pre
              style={{
                backgroundColor: "#e8f5e9",
                padding: "10px",
                borderRadius: "4px",
                whiteSpace: "pre-wrap",
                margin: 0,
                height: "calc(100% - 60px)",
                overflowY: "auto",
              }}
            >
              {response}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
