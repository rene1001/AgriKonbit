# Socket.IO Connection Diagnostic Guide

## Current Status

The Socket.IO connection is showing "server error" which indicates an **authentication issue**.

## What Was Fixed

### Client-Side (`client/src/contexts/SocketContext.js`)
- ✅ Changed transport from websocket-only to **polling + websocket** (more reliable)
- ✅ Limited reconnection attempts to **5** (prevents infinite loops)
- ✅ Added graceful error handling
- ✅ App continues to work without Socket.IO (real-time features disabled)
- ✅ Better console logging for diagnostics

### Server-Side (`server/config/socket.js`)
- ✅ Removed fallback JWT_SECRET (now requires proper configuration)
- ✅ Added JWT_SECRET validation check
- ✅ Added user active status check
- ✅ Better error logging with specific messages

### Server Configuration (`server/index.js`)
- ✅ Added polling transport support
- ✅ Improved CORS configuration
- ✅ Increased ping timeouts for stability

## Diagnosing the Issue

### Step 1: Check Server Logs

Look at your backend terminal for messages like:
- `Socket connection attempt without token` → Token not being sent
- `Socket authentication failed: Invalid token` → JWT_SECRET mismatch
- `Socket authentication failed: Token expired` → User needs to re-login
- `Socket authentication failed: User X not found` → Database issue
- `Socket authentication failed: User X is deactivated` → Account disabled

### Step 2: Verify JWT_SECRET Configuration

**Check if JWT_SECRET is set in server/.env:**

```bash
# In server directory
cat .env | grep JWT_SECRET
```

**The JWT_SECRET must:**
- Be at least 32 characters long
- Be the SAME in both `.env` and when tokens were created
- NOT be the default `'your-secret-key'`

### Step 3: Check Browser Console

After refreshing the page, you should see:
- `🔌 Attempting Socket.IO connection to: http://localhost:3001`
- Then either:
  - `✅ Socket.IO connected` (success!)
  - `⚠️ Socket.IO authentication failed: ...` (shows specific error)

### Step 4: Test Your Token

Open browser console and run:

```javascript
// Get your current token
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);

// Decode token (without verification)
if (token) {
  const parts = token.split('.');
  const payload = JSON.parse(atob(parts[1]));
  console.log('Token payload:', payload);
  console.log('Token expires:', new Date(payload.exp * 1000));
  console.log('Token expired:', Date.now() > payload.exp * 1000);
}
```

## Common Issues & Solutions

### Issue 1: "Invalid token" or "server error"

**Cause:** JWT_SECRET mismatch between when token was created and current server configuration

**Solution:**
1. Check server/.env has correct JWT_SECRET
2. Restart the backend server
3. **Log out and log back in** to get a new token with correct signature

### Issue 2: "Token expired"

**Cause:** Token has expired (default: 7 days)

**Solution:**
- Log out and log back in to get a fresh token

### Issue 3: "User not found"

**Cause:** User was deleted from database but token still exists

**Solution:**
- Clear localStorage and log in again
- Or check database for user existence

### Issue 4: "Account deactivated"

**Cause:** User account is marked as inactive in database

**Solution:**
- Reactivate account in admin panel
- Or check `users` table: `UPDATE users SET is_active = 1 WHERE id = X;`

## Quick Fix: Restart Everything

If you're unsure what's wrong:

1. **Stop all servers**
2. **Restart backend first:**
   ```bash
   cd server
   npm start
   ```
3. **Wait for "Server running" message**
4. **Restart frontend:**
   ```bash
   cd client
   npm start
   ```
5. **Clear browser cache and refresh**
6. **Log out and log back in** (gets fresh token)

## Expected Behavior

### With Working Socket.IO:
- Console shows: `✅ Socket.IO connected`
- Real-time notifications work
- Messages update instantly
- No repeated error messages

### Without Socket.IO (Graceful Degradation):
- Console shows: `⚠️ Socket.IO authentication failed: ...`
- App continues to work normally
- Notifications require page refresh
- Messages require manual refresh
- No repeated error spam

## Testing Socket.IO Connection

After fixing, test by:

1. **Open two browser windows** (or incognito + normal)
2. **Log in as different users** in each
3. **Send a message** from one user
4. **Check if other user sees it instantly** (if Socket.IO works)
5. **Or refresh to see it** (if Socket.IO is disabled)

## Need More Help?

Check the backend terminal for specific error messages. The server now logs:
- Connection attempts
- Authentication failures with reasons
- User connection/disconnection events

The most common fix is: **Log out, restart backend, log back in**.
