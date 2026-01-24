# 🔌 Integrations & API Reference

This project orchestrates data flow between 4 main external systems.

## 1. Tilda Webhook (Frontend Trigger)
Tilda sends a `POST` request to n8n whenever an order is placed.

**Endpoint:** `https://n8n.your-domain.com/webhook/tilda-order`  
**Payload Format (JSON):**
```json
{
  "payment": {
    "orderid": "1234567890",
    "amount": "2500",
    "products": [
      {
        "name": "Latte",
        "price": "1200",
        "quantity": 1
      }
    ]
  },
  "name": "Client name",
  "phone": "+79991234567",
  "formid": "form12345"
}
```

## 2. iikoCard API (Loyalty Engine)
Used for managing customer balances.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/1/access_token` | **Auth.** Retrieves temporary session token. |
| `POST` | `/api/1/loyalty/iiko/customer/info` | **Get Balance.** Finds wallet by phone number. |
| `POST` | `/api/1/loyalty/iiko/customer/create_or_update` | **Sync Profile.** Creates or updates customer data. |
| `POST` | `/api/1/loyalty/iiko/customer/wallet/chargeoff` | **Withdraw.** Spends points. |
| `POST` | `/api/1/loyalty/iiko/customer/wallet/topup` | **Accrue.** Adds points (cashback). |

## 3. Google Sheets API (Database)
Used via **OAuth2** for logging and idempotency checks.

*   **Read:** Lookup `order_id` in `logs` sheet (prevent duplicates).
*   **Write:** Append new rows to `logs` and `errors` sheets.

## 4. Telegram Bot API
Used for Admin notifications and interactive refund buttons.

*   **SendMessage:** Sends HTML-formatted alerts about new orders.
*   **CallbackQuery:** Handles clicks on "Cancel Order" inline buttons.
*   **EditMessageText:** Updates the message status to "Cancelled" after processing.
