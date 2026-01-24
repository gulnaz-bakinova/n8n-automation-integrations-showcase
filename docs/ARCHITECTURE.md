# System Architecture

This project implements a Loyalty System Middleware that connects a frontend website (Tilda) with a backend loyalty engine (iikoCard).

## 🧩 Components

| Component | Type | Role |
| :--- | :--- | :--- |
| **Tilda** | Frontend + Custom JS | Website with injected scripts for Balance Check & Point Redemption UI. |
| **n8n** | Orchestrator | Handles business logic, API transformations, and routing. |
| **iikoCard** | Backend API | Stores customer balances, handles accruals and withdrawals. |
| **Google Sheets** | Database (Lightweight) | Stores execution logs and handles Idempotency (deduplication). |
| **Telegram** | Admin UI | Notifies admins and allows manual refund operations via UI buttons. |
| **WhatsApp** | Notification Service | Sends loyalty updates to customers. |

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
