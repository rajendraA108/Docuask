# 📧 Email Configuration Guide for DocuAsk

This guide explains how to set up email sending for your DocuAsk application.

## ⚙️ Email Services Supported

DocuAsk uses **Nodemailer** which supports:
- ✅ **Gmail** (recommended for testing)
- ✅ **SendGrid**
- ✅ **Mailgun**
- ✅ **AWS SES**
- ✅ **Custom SMTP servers**

---

## 🔧 Setup Options

### Option 1: Gmail (Easiest for Testing)

#### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Scroll to **"How you sign in to Google"**
3. Click **2-Step Verification**
4. Follow the prompts to enable 2-Step Verification

#### Step 2: Generate App Password

1. Return to [Google Account Security](https://myaccount.google.com/security)
2. Click **App passwords** (appears only after enabling 2-Step Verification)
3. Select **Mail** and **Windows Computer** (or your setup)
4. Google will generate a 16-character password
5. **Copy this password** — you'll use it in `.env`

#### Step 3: Update `.env`

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx    # Your 16-char app password
FRONTEND_URL=http://localhost:4200
```

#### Testing

```bash
# Start backend
cd backend
npm run dev

# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Pass123!"}'

# Check logs for: ✅ Welcome email sent to test@example.com
```

---

### Option 2: SendGrid (Production Recommended)

#### Step 1: Create SendGrid Account

1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your email and phone
3. Go to **Settings** → **API Keys**
4. Click **Create API Key**
5. Save the API key

#### Step 2: Update `.env`

```env
# SendGrid Configuration
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your-api-key-here
FRONTEND_URL=http://localhost:4200
```

#### Step 3: Verify Sender Email

1. Go to **Sender Authentication** in SendGrid
2. Add your email as **Single Sender**
3. Verify the email address

---

### Option 3: Mailgun

#### Step 1: Create Mailgun Account

1. Sign up at [Mailgun](https://mailgun.com)
2. Verify your domain or use sandbox domain
3. Go to **Domain Settings**
4. Copy SMTP credentials

#### Step 2: Update `.env`

```env
# Mailgun Configuration
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-mailgun-password
FRONTEND_URL=http://localhost:4200
```

---

### Option 4: AWS SES (Amazon Simple Email Service)

#### Step 1: Setup AWS SES

1. Go to [AWS Console](https://console.aws.amazon.com)
2. Navigate to **Simple Email Service (SES)**
3. Verify your email in **Verified Identities**
4. Request production access (if in sandbox)
5. Create SMTP credentials in **Settings**

#### Step 2: Update `.env`

```env
# AWS SES Configuration
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com    # Change region as needed
EMAIL_PORT=587
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
FRONTEND_URL=http://localhost:4200
```

---

## 🚀 Using Custom SMTP

For corporate email or custom mail servers:

```env
EMAIL_HOST=mail.yourcompany.com
EMAIL_PORT=587                          # or 465 for SSL
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
FRONTEND_URL=http://localhost:4200
```

---

## 🧪 Testing Email Configuration

### Test 1: Server Startup

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Email service ready
Server running on port 3000
```

### Test 2: Send Welcome Email

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "your-email@gmail.com",
    "password": "TestPass123!"
  }'
```

**Check:**
- ✅ Backend logs show: `✅ Welcome email sent to your-email@gmail.com`
- ✅ Email arrives in inbox within 1-2 seconds

### Test 3: Check Logs for Errors

```bash
# Look for these in backend console:
✅ Email service ready              # Good
❌ Email service error              # Bad - credentials wrong
⚠️  Email not configured            # Missing env variables
```

---

## 🔍 Troubleshooting

### ❌ "Email service not configured"

**Solution:**
- All required variables missing: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`
- Check `.env` file exists and has all values
- Restart backend after editing `.env`

```bash
# Verify variables are set
echo $env:EMAIL_HOST
echo $env:EMAIL_USER
```

### ❌ "Invalid login credentials"

**Gmail Solution:**
- You're using regular password instead of App Password
- Generate a new App Password
- Gmail App Passwords must be 16 characters
- Don't add spaces when copying

**SendGrid/Mailgun Solution:**
- Verify API key is correct
- Check key hasn't expired
- Create a new key if unsure

### ❌ "Cannot verify transporter"

**Solution:**
```bash
# Test SMTP connection manually
npm install -g smtp-tool

smtp-tool --host smtp.gmail.com --port 587 \
  --user your-email@gmail.com \
  --pass "xxxx xxxx xxxx xxxx"
```

### ❌ "Emails not arriving"

**Check:**
1. ✅ Verify email address is correct
2. ✅ Check spam/junk folder
3. ✅ Verify "From" address is correct
4. ✅ Check backend logs for errors

```bash
# From address should match EMAIL_USER
# It appears as: "DocuAsk" <your-email@gmail.com>
```

### ❌ "ECONNREFUSED" or "Cannot connect"

**Solution:**
1. Check internet connection
2. Verify SMTP host and port:
   - Gmail: `smtp.gmail.com:587`
   - SendGrid: `smtp.sendgrid.net:587`
   - Mailgun: `smtp.mailgun.org:587`
3. Check if ISP blocks port 587 (try port 465)

```bash
# Test SMTP port connectivity
Test-NetConnection -ComputerName smtp.gmail.com -Port 587
```

---

## 📧 Email Templates

Current emails sent:

### Welcome Email
- **Trigger:** User registers
- **Includes:** Welcome message, dashboard link, next steps

### Query Result Email (Optional)
- **Trigger:** After AI processes query
- **Includes:** Question asked, AI answer, timestamp

### Future Emails
- Password reset
- Query notifications
- Account verification

---

## 🔐 Security Best Practices

### ✅ Do's
- ✅ Use App Passwords for Gmail (not regular password)
- ✅ Keep API keys in `.env` (never commit to git)
- ✅ Use different keys for dev/staging/production
- ✅ Rotate keys periodically
- ✅ Use TLS/SSL (port 587 or 465)

### ❌ Don'ts
- ❌ Don't commit `.env` to GitHub
- ❌ Don't use personal password for Gmail
- ❌ Don't use same key across environments
- ❌ Don't share API keys in code
- ❌ Don't log sensitive data

---

## 📊 Email Service Comparison

| Service | Cost | Setup | Limits | Best For |
|---------|------|-------|--------|----------|
| **Gmail** | Free | Easy | 500/day | Development |
| **SendGrid** | $0-300/mo | Medium | 3K-500K/mo | Production |
| **Mailgun** | $0-35/mo | Medium | 1K-10K/mo | Small projects |
| **AWS SES** | $0.10/1000 | Hard | Unlimited | Scaling apps |
| **Custom** | Varies | Hard | Varies | Enterprise |

---

## 🚀 Deployment Emails

### Heroku
```bash
heroku config:set EMAIL_HOST=smtp.sendgrid.net
heroku config:set EMAIL_USER=apikey
heroku config:set EMAIL_PASSWORD=SG.xxxxx
```

### Azure App Service
```bash
az webapp config appsettings set \
  --resource-group myGroup \
  --name myapp \
  --settings EMAIL_HOST=smtp.sendgrid.net EMAIL_USER=apikey EMAIL_PASSWORD=SG.xxxxx
```

### AWS EC2
```bash
# Edit /etc/environment or use secrets manager
export EMAIL_HOST=smtp.sendgrid.net
export EMAIL_USER=apikey
export EMAIL_PASSWORD=SG.xxxxx
```

---

## ✅ Checklist

Before going to production:

- [ ] Email service configured in `.env`
- [ ] Test welcome email works
- [ ] Verify sender email is correct
- [ ] Check email isn't going to spam
- [ ] Add company branding to email template
- [ ] Set up email unsubscribe link
- [ ] Monitor bounce rates
- [ ] Set SPF/DKIM records (SendGrid/Mailgun)

---

## 📞 Support

For questions:
- Check `.env.example` for variable names
- Review backend logs for errors
- Test with cURL command above
- Verify credentials with service provider

**Email service will not break your app** — it logs errors and continues gracefully if email is not configured.
