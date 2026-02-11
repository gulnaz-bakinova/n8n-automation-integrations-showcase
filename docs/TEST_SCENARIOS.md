# 🧪 Test Scenarios & Edge Cases

This document outlines the edge cases validated during the QA phase to ensure system resilience.

## 1. Idempotency & Duplicates
*   **Scenario:** Tilda sends the same webhook 2 times within 1 second.
*   **Expected Result:** First execution processes the order. Second execution detects existing `order_id` in Google Sheets and stops immediately.
*   **Status:** ✅ Passed.

## 2. API Failures (Resilience)
*   **Scenario:** iikoCard API returns `502 Bad Gateway` or `504 Timeout`.
*   **Expected Result:** n8n waits 3 seconds and retries the request (up to 3 times).
*   **Status:** ✅ Passed.

## 3. Business Logic
*   **Scenario:** New customer (phone not in iiko database).
*   **Expected Result:** API returns error "User not found". Workflow catches this, creates a new user via `create_or_update`, and proceeds with accrual.
*   **Status:** ✅ Passed.

## 4. Frontend Integration
*   **Scenario:** User enters an invalid phone number format in Tilda (e.g., 8 digits).
*   **Expected Result:** JS Script validates length (<10 digits) and shows "Enter valid phone number" error without sending a request to n8n.
*   **Status:** ✅ Passed.
