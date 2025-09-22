import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";
import http from "http";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Read server env variables
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
const PROTOCOL = process.env.PROTOCOL || "http";
const ENDPOINT = process.env.ENDPOINT || "/";
const METHOD = (process.env.METHOD || "POST").toLowerCase();

// Read LLM target env variables
const LLM_HOST = process.env.LLM_HOST || "localhost";
const LLM_PORT = process.env.LLM_PORT || 8000;
const LLM_PROTOCOL = process.env.LLM_PROTOCOL || "http";
const LLM_ENDPOINT = process.env.LLM_ENDPOINT || "/";
const LLM_METHOD = process.env.LLM_METHOD || "POST" ;

// Proxy handler
app[METHOD](ENDPOINT, async (req, res) => {
  try {
    const llmUrl = `${LLM_PROTOCOL}://${LLM_HOST}:${LLM_PORT}${LLM_ENDPOINT}`;
    const response = await axios({
      method: LLM_METHOD,
      url: llmUrl,
      data: req.body,
      headers: req.headers, // forward headers
    });

    res.status(response.status).send(response.data);
  } catch (err) {
    console.error("Error proxying request:", err.message);
    res.status(err.response?.status || 500).send(err.response?.data || "Internal Server Error");
  }
});

// Start server based on protocol
if (PROTOCOL === "https") {
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  };

  https.createServer(sslOptions, app).listen(PORT, HOST, () => {
    console.log(`HTTPS proxy server running at https://${HOST}:${PORT}${ENDPOINT} [${METHOD.toUpperCase()}]`);
  });
} else {
  http.createServer(app).listen(PORT, HOST, () => {
    console.log(`HTTP proxy server running at http://${HOST}:${PORT}${ENDPOINT} [${METHOD.toUpperCase()}]`);
  });
}
