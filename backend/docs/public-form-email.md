# Public trial and waitlist emails

The About waitlist form and the existing waitlist modal both submit to `POST /api/v1/auth/waitlist`. The backend stores the enquiry and sends its details to Bitmo through the existing Resend integration. Their fields, validation messages, layout, and native dropdown presentation were left unchanged during the mobile selector/email follow-up.

Required backend environment variables:

```dotenv
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=Ilmbit <notifications@your-verified-domain.com>
WAITLIST_NOTIFICATION_EMAIL=contact@bitmosolutions.com
```

The recipient defaults to `contact@bitmosolutions.com` if the recipient variable is absent or empty. The sender must be an address on a domain verified for the Resend account. The visitor's validated email becomes `replyTo`, so replying to the notification addresses the visitor. Visitors cannot supply or override the team recipient. See [Resend's send-email reference](https://resend.com/docs/api-reference/emails/send-email).

Notifications contain the saved name, email, phone/WhatsApp number, country, course, pace, notes, request ID, and creation timestamp. They use plain text, so submitted markup remains literal text.

If the provider rejects the email, the network fails, credentials are absent, or no provider email ID is returned, the endpoint returns a recoverable 503. The saved enquiry remains available in Admin Requests. The existing forms display the returned message and can submit again.

Retries reuse the saved entry and `waitlist/<entry ID>` as the provider idempotency key. This also keeps the payload stable if a duplicate request contains different notes; existing email/course uniqueness semantics are preserved. Resend deduplicates these requests within its [24-hour idempotency window](https://resend.com/docs/dashboard/emails/idempotency-keys). This is not permanent duplicate suppression or a background retry queue.

No database migration is needed. Production needs the updated backend deployed with a working Resend key and verified sender. The local key is present and is restricted to sending; it cannot list domains. Automated tests mock Resend rather than send real mail. Live inbox delivery and production sender-domain verification were not exercised.
