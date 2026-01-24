# 📖 Operational Runbook

This guide describes how to troubleshoot, debug, and recover from common failures in the Loyalty System workflow.

## 🚨 Common Incident Scenarios

### 1. iikoCard API Timeout (502/504)
**Symptoms:** Error logs show `ECONNRESET` or `Gateway Timeout`.
**Cause:** iiko servers are temporarily overloaded or down.
**Automated Fix:** The workflows have a `Retry On Fail` policy (3 attempts, 3s delay).
**Manual Action:**
1. Check if [iiko Status Page](https://status.iiko.ru) reports outages.
2. If the error persists > 1 hour, contact iiko support.

### 2. Authorization Failure (401 Unauthorized)
**Symptoms:** Workflow fails at `iiko Auth (Get Token)` node.
**Cause:** API Login is incorrect or the user password changed.
**Action:**
1. Open n8n Editor.
2. Navigate to `iiko Auth` node.
3. Verify `userId` and `userSecret` in the body.
4. Update credentials if necessary.

### 3. Duplicate Order Warning
**Symptoms:** Execution stops at `Check Duplicate` node (Logic: True).
**Cause:** Tilda sent the webhook twice (common network behavior).
**Action:** **Do nothing.** This is expected behavior. The system successfully prevented a double transaction.

---

## 🔍 How to Debug Execution

1.  **Open Execution List:** Go to n8n → Workflow → Executions.
2.  **Filter by Error:** Look for red `Error` status.
3.  **Inspect Node:** Click on the execution. Find the node with the ❌ icon.
4.  **Check Output:** Hover over the node to see the JSON error response from the external API.

## 🔄 Recovery Procedures

### How to Retry a Failed Order
If an order failed due to a temporary glitch (e.g., Google Sheets was down) and needs to be processed again:

1.  Open the failed Execution in n8n.
2.  Click the **Retry** button in the top right corner.
3.  Select **Retry from failed node**.
4.  Verify that the execution completes successfully (Green status).

### Where are the logs?
*   **Business Logs:** See Google Sheet `n8n_execution_logs` (Tab: `logs`).
*   **Error Audit:** See Google Sheet `n8n_execution_logs` (Tab: `errors`).
