{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww13340\viewh9320\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # SQL Queries for Reporting & Reconciliation\
\
Although this project uses Google Sheets as a lightweight database, here are the SQL queries I would use if the data were stored in a relational database (e.g., PostgreSQL).\
\
## Table Structure (Hypothetical)\
We assume two tables exist:\
1. `orders_log` (stores business transactions)\
2. `execution_logs` (stores n8n technical logs)\
\
---\
\
### 1. Check for Duplicate Orders (Idempotency Check)\
Before processing a new order, we check if the `order_id` already exists to prevent double-charging.\
\
```sql\
SELECT count(*) \
FROM orders_log \
WHERE order_id = '1365207519';\
-- If result > 0, stop execution.\
\
\
\pard\pardeftab560\slleading20\partightenfactor0
\cf0 ### 2. Daily Reconciliation Report (Analytics)\
Calculate total sales and total bonuses accrued for the current day. Useful for reconciling with the POS system (iiko).\
\
SELECT \
    DATE(created_at) as report_date,\
    COUNT(order_id) as total_orders,\
    SUM(total_amount) as revenue,\
    SUM(bonus_accrued) as total_bonuses_given\
FROM orders_log\
WHERE created_at >= CURRENT_DATE\
GROUP BY DATE(created_at);\
\
\
### 3. Error Analysis (Diagnostics)\
Find the most frequent errors in the last 7 days to prioritize fixes.\
\
SELECT \
    error_message,\
    COUNT(*) as error_count,\
    MAX(created_at) as last_occurrence\
FROM execution_logs\
WHERE status = 'error' \
  AND created_at >= NOW() - INTERVAL '7 days'\
GROUP BY error_message\
ORDER BY error_count DESC;}