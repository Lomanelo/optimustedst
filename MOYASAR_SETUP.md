# Moyasar Payment Gateway Setup Guide

## Overview

Moyasar is the recommended payment gateway for KSA users. It's free to set up, Saudi Central Bank regulated, and supports multiple payment methods including Mada, Visa, Mastercard, Apple Pay, and STC Pay.

## Why Moyasar?

- ✅ **Free Setup** - No setup fees
- ✅ **KSA Compliant** - Regulated by Saudi Central Bank
- ✅ **Multiple Payment Methods** - Mada, Visa, Mastercard, Apple Pay, STC Pay
- ✅ **Developer Friendly** - Excellent documentation and sandbox environment
- ✅ **Competitive Rates** - Transparent pricing structure
- ✅ **Local Support** - Arabic and English support

## Setup Steps

### 1. Create Moyasar Account

1. Visit [moyasar.com](https://moyasar.com)
2. Click "Sign Up" to create a free account
3. Complete the registration process
4. Verify your business details (required for live payments)

### 2. Get API Keys

1. Login to your [Moyasar Dashboard](https://dashboard.moyasar.com)
2. Go to Settings > API Keys
3. Copy your **Test API Keys** for development:
   - `pk_test_...` (Publishable Key)
   - `sk_test_...` (Secret Key)
4. For production, use your **Live API Keys**:
   - `pk_live_...` (Publishable Key)
   - `sk_live_...` (Secret Key)

### 3. Update Environment Variables

Create or update your `.env.local` file:

```env
# Moyasar API Keys
MOYASAR_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
MOYASAR_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# For production, use live keys:
# MOYASAR_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE
# MOYASAR_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE
```

### 4. Update Payment Page

In `app/enrollment/payment/page.tsx`, replace the placeholder:

```typescript
publishable_api_key: 'pk_test_YOUR_MOYASAR_PUBLIC_KEY', // Replace with your actual public key
```

With:

```typescript
publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
```

And add to your `.env.local`:

```env
NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

### 5. Test the Integration

#### Test Cards for Sandbox

Use these test card numbers in sandbox mode:

**Successful Payment:**

- Card: `4111111111111111` (Visa)
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)

**Failed Payment:**

- Card: `4000000000000002`
- Expiry: Any future date
- CVV: Any 3 digits

#### Testing Flow

1. Go to any program page
2. Click "Enroll Now"
3. Fill out the enrollment form
4. Proceed to payment
5. Use test card details
6. Verify successful enrollment

### 6. Go Live

#### Business Verification

1. Submit required business documents to Moyasar
2. Wait for approval (usually 1-3 business days)
3. Replace test API keys with live API keys
4. Test with real payment methods

#### Required Documents

- Commercial Registration
- VAT Certificate
- Bank Account Details
- ID of business owner/authorized person

### 7. Webhook Setup (Optional but Recommended)

Set up webhooks to receive payment notifications:

1. In Moyasar Dashboard > Settings > Webhooks
2. Add endpoint: `https://yourdomain.com/api/moyasar/webhook`
3. Select events: `payment.paid`, `payment.failed`
4. Create the webhook handler in your app

### 8. Additional Features

#### Payment Links

For social media sales or manual invoicing:

```typescript
const paymentLink = `https://moyasar.com/i/${invoice_id}`;
```

#### Recurring Payments

For subscription-based programs:

- Use Moyasar's tokenization feature
- Store customer tokens securely
- Create recurring payment schedules

## Support

- **Moyasar Support:** support@moyasar.com
- **Phone:** 800 1111848
- **Documentation:** [docs.moyasar.com](https://docs.moyasar.com)
- **Live Chat:** Available on Moyasar website

## Pricing

- **Setup:** Free
- **Transaction Fees:** 2.9% + 1 SAR per transaction (typical rates)
- **No monthly fees**
- **No hidden charges**

Contact Moyasar sales team for custom pricing for high volume businesses.

## Security

- PCI DSS Level 1 Certified
- 3D Secure authentication
- Fraud detection and prevention
- Saudi Central Bank regulated
- ISO 27001 certified

## Next Steps

1. Create Moyasar account
2. Get test API keys
3. Update environment variables
4. Test the enrollment flow
5. Submit business verification
6. Go live with real payments

The enrollment system is now ready to accept payments from KSA users!
