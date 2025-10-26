# Forgot Password Feature - Testing Guide

## Prerequisites
1. Ensure your backend server is running on `http://localhost:8000`
2. Ensure your frontend is running on `http://localhost:3000`
3. SMTP email configuration is set up in `.env` file
4. MongoDB is running and connected

## Step-by-Step Testing

### Test 1: Forgot Password from Login Panel

**Steps:**
1. Navigate to home page
2. Click the login icon in the navbar
3. In the login modal, click "Forgot password?" link
4. ForgotPassword modal should appear
5. Enter a valid email address (e.g., test@example.com)
6. Click "Send Reset Link"
7. You should see success message: "If email exists, password reset link has been sent"

**Expected Result:**
- Modal closes after 2 seconds
- Email is sent to the provided address (check email inbox or console if SMTP not configured)

---

### Test 2: Forgot Password from Signup Panel

**Steps:**
1. Navigate to home page
2. Click the login icon in the navbar
3. In the login modal, click "Create an account"
4. In the signup modal, click "Forgot password?" link
5. ForgotPassword modal should appear
6. Enter a valid email address
7. Click "Send Reset Link"

**Expected Result:**
- Same as Test 1
- Modal closes and returns to signup form

---

### Test 3: Reset Password with Valid Token

**Steps:**
1. Complete Test 1 or Test 2
2. Check your email for the reset link
3. Click the reset link in the email
4. You should be redirected to `/reset-password/{token}` page
5. Page should show "Resetting..." briefly, then display the reset form
6. Enter new password (minimum 6 characters)
7. Confirm password (must match)
8. Click "Reset Password"
9. You should see success message
10. You should be redirected to home page after 2 seconds

**Expected Result:**
- Password is successfully reset
- You can login with the new password

---

### Test 4: Reset Password with Invalid Token

**Steps:**
1. Manually navigate to `/reset-password/invalid-token-here`
2. Page should show error message: "Invalid or expired reset token"
3. Click "Go to Home" button

**Expected Result:**
- Error message is displayed
- User is redirected to home page

---

### Test 5: Reset Password with Expired Token

**Steps:**
1. Get a valid reset token from email
2. Wait for 1 hour (or modify the code to test with shorter expiry)
3. Try to use the reset link
4. Page should show error message: "Invalid or expired reset token"

**Expected Result:**
- Expired token is rejected
- User cannot reset password with expired token

---

### Test 6: Password Validation

**Steps:**
1. Get a valid reset link
2. Try to enter passwords that don't match
3. Click "Reset Password"
4. Error message should appear: "Passwords do not match"

**Steps:**
1. Get a valid reset link
2. Try to enter password less than 6 characters
3. Click "Reset Password"
4. Error message should appear: "Password must be at least 6 characters"

**Expected Result:**
- Validation errors are shown
- Password is not reset

---

### Test 7: Email Verification

**Steps:**
1. Complete Test 1
2. Check your email inbox
3. Look for email from: `videoeditoromkar@gmail.com` (or configured MAIL_FROM)
4. Subject should be: "Password Reset Request - Shushruta"
5. Email should contain:
   - Professional HTML template
   - "Reset Password" button
   - Reset link
   - 1-hour expiration warning
   - Shushruta branding

**Expected Result:**
- Email is properly formatted
- All information is correct
- Reset link is clickable

---

### Test 8: Non-existent Email

**Steps:**
1. Click "Forgot password?"
2. Enter an email that doesn't exist in the database
3. Click "Send Reset Link"

**Expected Result:**
- Same success message is shown (for security)
- No email is sent
- User cannot determine if email exists

---

## Debugging Tips

### If emails are not being sent:
1. Check `.env` file for SMTP configuration
2. Verify SMTP credentials are correct
3. Check server console for error messages
4. If SMTP not configured, emails will be logged to console

### If reset link doesn't work:
1. Check if token is correctly passed in URL
2. Verify token hasn't expired (1 hour limit)
3. Check browser console for errors
4. Check server console for errors

### If password reset fails:
1. Verify passwords match
2. Verify password is at least 6 characters
3. Check server console for database errors
4. Verify MongoDB is running

---

## API Endpoints for Manual Testing

### 1. Request Password Reset
```bash
curl -X POST http://localhost:8000/api/user/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### 2. Verify Reset Token
```bash
curl -X POST http://localhost:8000/api/user/verify-reset-token \
  -H "Content-Type: application/json" \
  -d '{"resetToken":"your-token-here"}'
```

### 3. Reset Password
```bash
curl -X POST http://localhost:8000/api/user/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken":"your-token-here",
    "newPassword":"newpassword123",
    "confirmPassword":"newpassword123"
  }'
```

---

## Success Criteria
- ✅ User can request password reset from login panel
- ✅ User can request password reset from signup panel
- ✅ Email is sent with reset link
- ✅ Reset link is valid for 1 hour
- ✅ User can reset password with valid token
- ✅ Password validation works correctly
- ✅ Invalid/expired tokens are rejected
- ✅ User can login with new password
- ✅ Email doesn't reveal if account exists

