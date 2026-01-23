{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # \uc0\u55357 \u56534  Operational Runbook\
\
This guide describes how to troubleshoot, debug, and recover from common failures in the Loyalty System workflow.\
\
## \uc0\u55357 \u57000  Common Incident Scenarios\
\
### 1. iikoCard API Timeout (502/504)\
**Symptoms:** Error logs show `ECONNRESET` or `Gateway Timeout`.\
**Cause:** iiko servers are temporarily overloaded or down.\
**Automated Fix:** The workflows have a `Retry On Fail` policy (3 attempts, 3s delay).\
**Manual Action:**\
1. Check if [iiko Status Page](https://status.iiko.ru) reports outages.\
2. If the error persists > 1 hour, contact iiko support.\
\
### 2. Authorization Failure (401 Unauthorized)\
**Symptoms:** Workflow fails at `iiko Auth (Get Token)` node.\
**Cause:** API Login is incorrect or the user password changed.\
**Action:**\
1. Open n8n Editor.\
2. Navigate to `iiko Auth` node.\
3. Verify `userId` and `userSecret` in the body.\
4. Update credentials if necessary.\
\
### 3. Duplicate Order Warning\
**Symptoms:** Execution stops at `Check Duplicate` node (Logic: True).\
**Cause:** Tilda sent the webhook twice (common network behavior).\
**Action:** **Do nothing.** This is expected behavior. The system successfully prevented a double transaction.\
\
---\
\
## \uc0\u55357 \u56589  How to Debug Execution\
\
1.  **Open Execution List:** Go to n8n \uc0\u8594  Workflow \u8594  Executions.\
2.  **Filter by Error:** Look for red `Error` status.\
3.  **Inspect Node:** Click on the execution. Find the node with the \uc0\u10060  icon.\
4.  **Check Output:** Hover over the node to see the JSON error response from the external API.\
\
## \uc0\u55357 \u56580  Recovery Procedures\
\
### How to Retry a Failed Order\
If an order failed due to a temporary glitch (e.g., Google Sheets was down) and needs to be processed again:\
\
1.  Open the failed Execution in n8n.\
2.  Click the **Retry** button in the top right corner.\
3.  Select **Retry from failed node**.\
4.  Verify that the execution completes successfully (Green status).\
\
### Where are the logs?\
*   **Business Logs:** See Google Sheet `n8n_execution_logs` (Tab: `logs`).\
*   **Error Audit:** See Google Sheet `n8n_execution_logs` (Tab: `errors`).}