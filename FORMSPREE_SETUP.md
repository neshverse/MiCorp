# Formspree Email Setup Guide

## Issue Fixed
Your forms were using incorrect field names for Formspree. The key changes:

### What Was Wrong
- **Chatbot form**: Used capitalized field names (`Name`, `Email`, `Category`, `Message`)
- **Missing `_replyto` field**: Formspree needs this to know where to send emails

### What's Fixed Now
1. **Chatbot**: Now sends lowercase field names (`name`, `email`, `category`, `message`) + `_replyto` field
2. **Contact form**: Already had correct field names (`name`, `email`, `message`, `subject`)
3. **Added error logging**: Browser console now shows detailed Formspree responses for debugging

---

## How Formspree Works (Critical!)

### Field Name Rules
- **`email`** field: Formspree sends the email notification to the email address you configured in your Formspree dashboard
- **`_replyto`** field: Sets the "Reply-To" address for responses
- **`_subject`** field: Sets the email subject line
- All other fields (name, message, etc.) are included in the email body

### Your Current Setup
- **Formspree form ID**: `meokpzlj`
- **Form URL**: `https://formspree.io/f/meokpzlj`
- **Notification email**: This is set in your Formspree dashboard settings

---

## How to Verify It's Working

### 1. Test the Contact Form
- Go to `/pages/contact.html`
- Fill and submit the form
- Check your inbox for the confirmation email
- Check Formspree dashboard at https://formspree.io/dashboard for submissions

### 2. Test the Chatbot
- Click the chatbot button (bottom-right)
- Select a product category
- Enter your details (name, email, message)
- Confirm submission
- Check inbox and Formspree dashboard

### 3. Debug in Browser Console
- Open DevTools (F12)
- Go to Console tab
- Submit a form and look for logs like:
  ```
  Formspree error: {...}
  Submission error: ...
  ```

---

## Common Issues & Solutions

### Issue: Still not receiving emails
**Solution 1**: Check Formspree dashboard
- Go to https://formspree.io/dashboard
- Verify email is confirmed
- Check "Settings" > "Email" configuration
- Look for submissions in the form's history

**Solution 2**: Verify field names
- Use browser DevTools > Network tab
- Submit form and look at the POST request body
- Should contain: `name=...&email=...&message=...&_replyto=...`

**Solution 3**: Check spam/promotions folder
- Formspree sends from `noreply@formspree.io`
- Add this to safe senders if in spam

### Issue: "Network error" message
- Check browser console for actual error
- Ensure form `action` attribute is correct
- Check if Formspree endpoint is accessible

---

## Recent Changes

### Contact Form (`/pages/contact.html`)
✓ Field names correct: `name`, `email`, `message`, `subject`
✓ Form posts to: `https://formspree.io/f/meokpzlj`

### Chatbot Form (`/js/chatbot.js`)
✓ Fixed field names: `name`, `email`, `category`, `message`
✓ Added `_replyto` field for reply-to address
✓ Added `_subject` field for custom subject line
✓ Added error logging in catch blocks

---

## Next Steps

1. **Test both forms** and verify emails arrive
2. **Check Formspree dashboard** for submission history
3. **Monitor browser console** for any JavaScript errors
4. If still issues, check Formspree account settings

---

For more info: https://formspree.io/docs
