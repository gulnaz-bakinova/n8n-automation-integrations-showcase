{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red220\green220\blue223;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;\cssrgb\c88836\c88837\c89792;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec3 #  Integrations & API Reference\
\
This project orchestrates data flow between 4 main external systems.\
\
## 1. Tilda Webhook (Frontend Trigger)\
Tilda sends a `POST` request to n8n whenever an order is placed.\
\
**Endpoint:** `https://n8n.your-domain.com/webhook/tilda-order`\
**Payload Format (JSON):**\
```json\
\{\
  "payment": \{\
    "orderid": "1365207519",\
    "amount": "2500",\
    "products": [\
      \{\
        "name": "Latte",\
        "price": "1200",\
        "quantity": 1\
      \}\
    ]\
  \},\
  "name": "Jane Doe",\
  "phone": "+79991234567",\
  "formid": "form12345"\
\}\
\
## 2. iikoCard API (Loyalty Engine)\
Used for managing customer balances.\
\
| Method | Endpoint | Purpose |\
| :--- | :--- | :--- |\
| `POST` | `/api/1/access_token` | **Auth.** Retrieves temporary session token. |\
| `POST` | `/api/1/loyalty/iiko/customer/info` | **Get Balance.** Finds wallet by phone number. |\
| `POST` | `/api/1/loyalty/iiko/customer/create_or_update` | **Sync Profile.** Creates or updates customer data. |\
| `POST` | `/api/1/loyalty/iiko/customer/wallet/chargeoff` | **Withdraw.** Spends points. |\
| `POST` | `/api/1/loyalty/iiko/customer/wallet/topup` | **Accrue.** Adds points (cashback). |\
\
## 3. Google Sheets API (Database)\
Used via **OAuth2** for logging and idempotency checks.\
\
*   **Read:** Lookup `order_id` in `logs` sheet (prevent duplicates).\
*   **Write:** Append new rows to `logs` and `errors` sheets.\
\
## 4. Telegram Bot API\
Used for Admin notifications and interactive refund buttons.\
\
*   **SendMessage:** Sends HTML-formatted alerts about new orders.\
*   **CallbackQuery:** Handles clicks on "Cancel Order" inline buttons.\
*   **EditMessageText:** Updates the message status to "Cancelled" after processing.}