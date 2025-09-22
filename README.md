# LLM Proxy Server

A proxy Express HTTPS server designed to facilitate local HTTP LLM servers, preventing HTTP/2 errors when interacting with vLLM or Ollama HTTPS servers.

## 🚀 Features

- **HTTPS Proxying**: Acts as an intermediary HTTPS server for local HTTP-based LLM servers.
- **Compatibility**: Ensures smooth communication with vLLM and Ollama HTTPS servers.
- **Error Prevention**: Mitigates common HTTP/2-related issues during LLM server interactions.

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/himanshu-DLTech/llm_proxy_server.git
   cd llm_proxy_server
   ```

2. Install dependencies:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. Configure environment variables:
   ```bash
   cp example.env .env
   ```
   Edit the `.env` file to set appropriate values for your setup.

4. Start the server:
   ```bash
   node server.js
   ```

## ⚙️ Configuration

The `.env` file contains the following environment variables:

- `HOST`: host for the proxy server
- `PORT`: port for the proxy server
- `ENDPOINT`: endpoint for the proxy server \(generally, same as LLM endpoint\)
- `SSL_KEY_PATH`: Path to the SSL private key.
- `SSL_CERT_PATH`: Path to the SSL certificate.
- `LLM_HOST`: Hostname for your local LLM server (e.g., `localhost`).
- `LLM_PORT`: Port on which the Local LLM server is running.
- `LLM_POTOCOL`: Protocol for local LLm \('http' or 'https'\).
- `LLM_ENDPOINT`: API endpoint for local LLm \(`/v1/chat/completions`\).

Ensure that your SSL certificate and key are correctly configured to enable HTTPS.

## 🧪 Usage

Once the server is running, it will listen on the specified `PORT`. You can send HTTPS requests to this proxy server, which will forward them to your local LLM server. This setup helps in avoiding HTTP/2 errors commonly encountered when directly calling vLLM or Ollama HTTPS servers.

## 🧩 Example

If your local LLM server is running at `http://localhost:5000`, and your proxy server is configured to run on port `3000`, you can send a request like:

```bash
curl -X POST https://\<proxy_server_host\>:3000/\<proxy_server_endpoint\> -d '{"key": "value"}' -H "Content-Type: application/json"
```

The proxy server will forward this request to `http://localhost:5000/your-endpoint`, ensuring secure and error-free communication.

## 📁 Project Structure

```
llm_proxy_server/
├── .gitignore
├── example.env
├── install.sh
├── server.js
└── README.md
```

- `.gitignore`: Specifies files and directories to be ignored by Git.
- `example.env`: Sample environment configuration file.
- `install.sh`: Script to automate the installation process.
- `server.js`: Main application file containing the proxy server logic.
- `README.md`: This documentation file.
