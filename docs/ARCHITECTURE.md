# System Architecture

This project implements a Loyalty System Middleware that connects a frontend website (Tilda) with a backend loyalty engine (iikoCard).

## 🧩 Components

| Component | Type | Role |
| :--- | :--- | :--- |
| **Tilda** | Frontend / Trigger | Captures customer orders and sends Webhooks. |
| **n8n** | Orchestrator | Handles business logic, API transformations, and routing. |
| **iikoCard** | Backend API | Stores customer balances, handles accruals and withdrawals. |
| **Google Sheets** | Database (Lightweight) | Stores execution logs and handles Idempotency (deduplication). |
| **Telegram** | Admin UI | Notifies admins and allows manual refund operations via UI buttons. |
| **WhatsApp** | Notification Service | Sends loyalty updates to customers (via GreenAPI/Wazzup). |

---

## 🔄 Data Flow Diagram

```mermaid
sequenceDiagram
    participant User as Customer
    participant Tilda as Tilda Website
    participant n8n as n8n Middleware
    participant DB as Google Sheets
    participant iiko as iikoCard API
    participant Admin as Telegram Bot

    User->>Tilda: Places Order
    Tilda->>n8n: Webhook (Order JSON)
    
    rect rgb(240, 248, 255)
    note right of n8n: 1. Idempotency Check
    n8n->>DB: Check if order_id exists?
    DB-->>n8n: Result (Found/Not Found)
    end

    alt Order is Duplicate
        n8n->>n8n: Stop Execution
    else Order is New
        n8n->>iiko: Auth & Get Token
        
        alt Spend Bonuses
            n8n->>iiko: Withdraw Points
            n8n->>n8n: Recalc Remaining Pay
        else Earn Bonuses
            n8n->>n8n: Calc 5% of Total
            n8n->>iiko: Accrue Points
        end

        n8n->>DB: Log Transaction (Success)
        n8n->>Admin: Notify Admin (New Order)
    end
```

## 🛠 Key Design Decisions

### 1. API Gateway Pattern
n8n acts as a secure middleware. The frontend (Tilda) never communicates with iikoCard directly. This hides API keys and business logic from the public web.

### 2. Idempotency
To prevent double-charging or double-accrual on network retries, every order is checked against a Google Sheets ledger using the unique `order_id` before processing.

### 3. Fail-Safe Operations
*   **Retry Policy:** All HTTP requests to iikoCard have a **3x retry** strategy to handle transient network glitches.
*   **Global Error Handler:** A dedicated workflow catches unexpected failures and logs them for audit.
