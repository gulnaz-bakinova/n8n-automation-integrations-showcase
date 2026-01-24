# SQL Queries for Reporting & Reconciliation

Although this project uses Google Sheets as a lightweight database, here are the SQL queries I would use if the data were stored in a relational database (e.g., PostgreSQL).

## Table Structure (Hypothetical)
We assume two tables exist:
1. `orders_log` (stores business transactions)
2. `execution_logs` (stores n8n technical logs)

---

### 1. Check for Duplicate Orders (Idempotency Check)
Before processing a new order, we check if the `order_id` already exists to prevent double-charging.

```sql
SELECT count(*)
FROM orders_log
WHERE order_id = '1234567890';
-- If result > 0, stop execution.
```

### 2. Daily Reconciliation Report (Analytics)
Calculate total sales and total bonuses accrued for the current day. Useful for reconciling with the POS system (iiko).

```sql
SELECT
    DATE(created_at) as report_date,
    COUNT(order_id) as total_orders,
    SUM(total_amount) as revenue,
    SUM(bonus_accrued) as total_bonuses_given
FROM orders_log
WHERE created_at >= CURRENT_DATE
GROUP BY DATE(created_at);
```

### 3. Error Analysis (Diagnostics)
Find the most frequent errors in the last 7 days to prioritize fixes.

```sql
SELECT
    error_message,
    COUNT(*) as error_count,
    MAX(created_at) as last_occurrence
FROM execution_logs
WHERE status = 'error'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY error_message
ORDER BY error_count DESC;
```
