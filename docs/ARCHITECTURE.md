{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 AppleColorEmoji;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red220\green220\blue223;\red219\green219\blue223;
\red20\green21\blue23;\red220\green220\blue223;\red20\green21\blue23;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;\cssrgb\c88836\c88837\c89792;\cssrgb\c88732\c88733\c89798;
\cssrgb\c10213\c10998\c11770;\cssrgb\c88836\c88838\c89792;\cssrgb\c10196\c10980\c11765;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # System Architecture\
\
This project implements a Loyalty System Middleware that connects a frontend website (Tilda) with a backend loyalty engine (iikoCard).\
\
## 
\f1 \uc0\u55358 \u56809 
\f0  Components\
\
| Component | Type | Role |\
| :--- | :--- | :--- |\
|\cf2  **Tilda** | \expnd0\expndtw0\kerning0
Frontend + Custom JS\kerning1\expnd0\expndtw0  | \expnd0\expndtw0\kerning0
Website with injected scripts for Balance Check & Point Redemption UI.\kerning1\expnd0\expndtw0  |\
|\cf0  **n8n** | Orchestrator | Handles business logic, API transformations, and routing. |\
| **iikoCard** | Backend API | Stores customer balances, handles accruals and withdrawals. |\
| **Google Sheets** | Database (Lightweight) | Stores execution logs and handles Idempotency (deduplication). |\
| **Telegram** | Admin UI | Notifies admins and allows manual refund operations via UI buttons. |\
| **WhatsApp** | Notification Service | Sends loyalty updates to customers (via GreenAPI/Wazzup). |\
\
---\
\
## 
\f1 \uc0\u55357 \u56580 
\f0  Data Flow Diagram\
\
```mermaid\
sequenceDiagram\
    participant User as Customer\
    participant Tilda as Tilda Website\
    participant n8n as n8n Middleware\
    participant DB as Google Sheets\
    participant iiko as iikoCard API\
    participant Admin as Telegram Bot\
\
    User->>Tilda: Places Order\
    Tilda->>n8n: Webhook (Order JSON)\
    \
    rect rgb(240, 248, 255)\
    note right of n8n: 1. Idempotency Check\
    n8n->>DB: Check if order_id exists?\
    DB-->>n8n: Result (Found/Not Found)\
    end\
\
    alt Order is Duplicate\
        n8n->>n8n: Stop Execution\
    else Order is New\
        n8n->>iiko: Auth & Get Token\
        \
        alt Spend Bonuses\
            n8n->>iiko: Withdraw Points\
            n8n->>n8n: Recalc Remaining Pay\
        else Earn Bonuses\
            n8n->>n8n: Calc 5% of Total\
            n8n->>iiko: Accrue Points\
        end\
\
        n8n->>DB: Log Transaction (Success)\
        n8n->>Admin: Notify Admin (New Order)\
    end\
\
\
\pard\pardeftab720\sa360\partightenfactor0
\cf5 \expnd0\expndtw0\kerning0
## \uc0\u55357 \u57056  Key Design Decisions\
### 1. API Gateway Pattern\
n8n acts as a secure middleware. The frontend (Tilda) never communicates with iikoCard directly. This hides API keys and business logic from the public web.\
### 2. Idempotency\
To prevent double-charging or double-accrual on network retries, every order is checked against a Google Sheets ledger using the unique `order_id` before processing.\
### 3. Fail-Safe Operations\
*   **Retry Policy:** All HTTP requests to iikoCard have a **3x retry** strategy to handle transient network glitches.\
*   **Global Error Handler:** A dedicated workflow catches unexpected failures and logs them for audit.\cf7 \
}