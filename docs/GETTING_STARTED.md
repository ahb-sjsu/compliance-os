# Getting Started with ComplianceOS

## Quick Start

1. Visit [ComplianceOS](https://ahb-sjsu.github.io/compliance-os/)
2. You're ready to go — no account required for the Free plan

## Adding Your First Vendor

1. Click **Vendors** in the sidebar
2. Click **+ Add Vendor** in the top bar
3. Fill in vendor details:
   - **Company name** (required)
   - **Contact** and **email**
   - **Category** (e.g., Technology, Legal, Logistics)
   - **Risk tier** — HIGH, MED, or LOW
   - **Paid vendor** — toggle if you pay this vendor
   - **Onsite access** — toggle if they access your facilities
4. Click **Save**

ComplianceOS automatically generates a compliance checklist based on the vendor's tier and attributes.

## Compliance Checklist

Each vendor gets an auto-generated checklist:

| Item | Required When |
|---|---|
| Contract (MSA/SOW) | All vendors |
| W-9 Form | Paid vendors |
| Certificate of Insurance | Onsite or HIGH tier |
| Security Questionnaire Lite | MED or HIGH tier |
| Incident Response Contact | MED or HIGH tier |
| Security Addendum | HIGH tier only |
| Security Evidence (SOC2/ISO 27001) | HIGH tier only |

Mark items as **Approved**, **Pending**, or **Waived** (with justification notes).

## Vendor Status Lifecycle

```
PROSPECT → IN_REVIEW → ACTIVE → ON_HOLD → OFFBOARDING → OFFBOARDED
```

- Vendors start as **Prospect**
- Moving to **Active** requires all checklist items to be complete and risk assessment done
- **On Hold** pauses a vendor relationship
- **Offboarding/Offboarded** tracks vendor sunset

## Document Tracking

Upload compliance documents with:
- Document type (Contract, Insurance, Security Report, etc.)
- Expiry date — ComplianceOS alerts you 30/60/90 days before expiry
- Sensitivity flag — marks documents as restricted

## Reports (Pro)

Pre-built reports available on the Pro plan:
- **All Vendors** — complete vendor list with status
- **Missing Items** — vendors with incomplete checklists
- **Expiring 30d / 90d** — documents approaching expiry
- **High Risk** — HIGH tier vendor summary
- **Offboarding** — vendors in offboarding status

## Google Drive Sync (Pro)

Sign in with Google to sync your data across devices. ComplianceOS uses Google Drive's hidden app folder — it cannot access any of your personal files.

## Data Privacy

- All data is stored locally in your browser (localStorage)
- With Google sign-in, data syncs to your own Google Drive
- No data is sent to ComplianceOS servers — there are no servers
- Export everything to CSV at any time
