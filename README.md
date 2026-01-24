# ☕ Loyalty System Automation (Tilda + iikoCard)

> **Production-ready middleware** developed for a coffee shop chain (4 locations) in Almaty.
> Orchestrates data flow between Frontend (Tilda), Loyalty Engine (iikoCard), and Messaging Services.

![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-orange?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=flat-square)
![SQL](https://img.shields.io/badge/SQL-Analytics-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production-success?style=flat-square)

---

## 📸 System Overview

### 1. The Result (Frontend & Admin UI)
Custom JS scripts allow customers to check balances. Admins receive alerts and can **cancel orders** directly from Telegram.

| Customer UI (Tilda) | Admin Alerts (Telegram) |
| :---: | :---: |
| <img src="assets/tilda-frontend-ui.png" width="400" alt="Tilda UI"> | <img src="assets/telegram-alert.png" width="300" alt="New Order"><br><br>⬇️ *After Cancellation* ⬇️<br><br><img src="assets/telegram-alert-cancel.png" width="300" alt="Order Cancelled"> |


### 2. The Brain (Backend Logic)
Complex logic handles idempotency, math calculations (5% accrual / partial redemption), and API routing.

![Workflow Overview](assets/workflow-overview.png)
*Main Order Processing Workflow (n8n)*

---

## 🚀 Key Features

*   **🛡️ Idempotency & Deduplication:** Prevents double-charging by verifying unique `order_id` against a Google Sheets ledger.
*   **🔌 API Gateway Pattern:** Front-end (Tilda) never communicates with the backend (iiko) directly. n8n acts as a secure proxy.
*   **🚨 Global Error Handling:** A dedicated "Watchdog" workflow catches 4xx/5xx errors, logs them to DB, and alerts the DevOps team.
*   **🔄 Fail-Safe Mechanisms:** HTTP Requests utilize a `3x Retry` policy to handle transient network issues.
*   **💻 Custom Frontend Integration:** Vanilla JS scripts (see [`docs/`](docs/)) injected into Tilda to enable dynamic balance checks.

---

## 🧪 How to Run a Demo

Since this is a backend integration, you can simulate triggers using **Postman** or **cURL**.

*   **Test Data:** Full JSON payloads (Tilda orders, Telegram callbacks) are located in the [`sample_payloads/`](sample_payloads/) directory.
*   **Execution:** Send a `POST` request to the n8n webhook URL using the data from these files to trigger the workflow.


## Expected Outcome
1.  n8n checks Google Sheet (see logs snapshot: [`assets/execution-logs.png`](assets/execution-logs.png)).
2.  If `orderid` is new → Calculates 5% points → Sends to iiko → Alerts Admin.
3.  If `orderid` exists → Stops execution (Idempotency).

---

## 📂 Repository Structure

### Workflows (n8n JSON)

| Workflow | Description |
|----------|-------------|
| [`01_order_processing_tilda.json`](01_order_processing_tilda.json) | **Core Logic.** Receives webhook, checks duplicates, calculates points, syncs with iiko |
| [`02_customer_balance_check.json`](02_customer_balance_check.json) | **Proxy API.** Handles "Check Balance" requests from the website |
| [`03_admin_refund_handler.json`](03_admin_refund_handler.json) | **Admin Tools.** Handles "Cancel Order" button clicks, revokes points, and updates DB |
| [`99_global_error_handler.json`](99_global_error_handler.json) | **Monitoring.** Catches failures from all other workflows |


### Documentation (`/docs`)
*   [📄 ARCHITECTURE.md](docs/ARCHITECTURE.md) — Component diagram & data flow.
*   [🔌 Integrations & API](docs/integrations.md) — Detailed API specs & Payloads.
*   [🔐 Security](docs/security.md) — How secrets and PII are protected.
*   [📖 Runbook](docs/RUNBOOK.md) — Troubleshooting guide.
*   [📊 SQL Examples](docs/sql_examples.md) — Analytical queries.
*   [💻 Frontend Scripts](docs/) — Custom JS code used in Tilda.

---

## 🛠 Setup & Configuration

1.  **Environment Variables:**

    Rename [`ENV.example`](ENV.example) to `.env` and fill in your API keys.
    *   *Note: Never commit real keys to the repository.*


2.  **Credentials (OAuth2):**

| Service | Setup |
|---------|-------|
| **Google Sheets:** | Create "Google Sheets OAuth2 API" credential in n8n using your `Client ID` and `Secret` |
| **Telegram:** | Add your Bot Token to n8n Credentials |


3.  **Tilda Setup:**
    Inject [`docs/tilda-checkout-integration.js`](docs/tilda-checkout-integration.js) into the Tilda Page Footer code.

---

### 👤 Author

**Gulnaz Bakinova**

*Integration & Automation Engineer (n8n / Low-code)*

Let's connect!
[LinkedIn](https://www.linkedin.com/in/gulnaz-bakinova/) 

