{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # Security Architecture\
\
Security is a priority in this integration, dealing with financial data (loyalty points) and personal customer info (PII).\
\
## 1. Credentials Management\
*   **No Hardcoded Secrets:** All API keys, tokens, and passwords are removed from the code.\
*   **Environment Variables:** The system uses `.env` variables (see `ENV.example`) to inject secrets at runtime.\
*   **n8n Credentials:** n8n's internal encrypted credential store is used for Google OAuth2 and Telegram tokens.\
\
## 2. Network Security (API Gateway Pattern)\
*   **Frontend Isolation:** The Tilda website (frontend) **never** communicates with iikoCard directly.\
*   **Proxy Logic:** Tilda sends data to n8n -> n8n validates/transforms it -> n8n talks to iiko.\
*   **Benefit:** This hides the iikoCard API keys and internal logic from the public internet.\
\
## 3. Data Privacy (PII)\
*   **Minimal Logging:** We only log `order_id` and status for debugging. Customer names and full phone numbers are processed in memory but not permanently stored in external logs unless necessary for error audit.\
\
## 4. Access Control\
*   **Admin Bot:** Only specific Chat IDs (admins) can trigger refund actions via Telegram.}