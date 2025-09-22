const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const https = require("https");
const cors = require("cors");

dotenv.config({ path: path.join(__dirname, ".env")});

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Read server env variables
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const ENDPOINT = process.env.ENDPOINT;

// Read LLM target env variables
const LLM_HOST = process.env.LLM_HOST;
const LLM_PORT = process.env.LLM_PORT;
const LLM_PROTOCOL = process.env.LLM_PROTOCOL;
const LLM_ENDPOINT = process.env.LLM_ENDPOINT;

// Proxy handler
app.post(ENDPOINT, async (req, res) => {
  const llmUrl = `${LLM_PROTOCOL}://${LLM_HOST}:${LLM_PORT}${LLM_ENDPOINT}`;
  
  // Remove unsafe headers
  const { host, connection, 'content-length': _, ...safeHeaders } = req.headers;

  // Ensure JSON
  safeHeaders['content-type'] = 'application/json';

  try {
    console.log("Proxying request to:", llmUrl);

    const response = await fetch(llmUrl, {
      method: "POST",
      headers: safeHeaders,
      body: JSON.stringify(req.body), // Node will calculate Content-Length automatically
    });

    const responseJson = await response.json();
    res.status(response.status).send(responseJson);
  } catch (err) {
    console.error(`Error proxying request to ${llmUrl}`, err);
    res.status(500).send("Internal Server Error");
  }
});

// Start server based on protocol
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

https.createServer(sslOptions, app).listen(PORT, HOST, () => {
  console.log(
    `HTTPS proxy server running at https://${HOST}:${PORT}${ENDPOINT} [POST]`
  );
});
