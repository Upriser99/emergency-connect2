# 📱 How to Run Emergency Connect on Your Mobile Phone

## **Option 1: Quick Test via Local Network (Recommended)**

### Step 1: Find Your Computer's IP Address
Open PowerShell and run:
```powershell
ipconfig
```
Look for "IPv4 Address" under your WiFi/Ethernet adapter (e.g., `192.168.1.5`)

### Step 2: Start a Local Server
In PowerShell, navigate to your project folder and run:
```powershell
cd d:\project
python -m http.server 8000
```

**OR** if Python isn't installed:
```powershell
# Install a simple server (one-time)
npm install -g http-server

# Run server
http-server -p 8000
```

### Step 3: Access from Mobile
1. Make sure your phone is on the **same WiFi network** as your computer
2. Open browser on your phone
3. Go to: `http://YOUR_IP_ADDRESS:8000`
   - Example: `http://192.168.1.5:8000`

---

## **Option 2: Deploy Online (Best for Real Testing)**

### A. Deploy to Vercel (Free, 2 minutes)

1. **Install Vercel CLI:**
```powershell
npm install -g vercel
```

2. **Deploy:**
```powershell
cd d:\project
vercel
```

3. **Follow prompts:**
   - Login/signup (free)
   - Confirm project settings
   - Get instant URL like: `https://emergency-connect-xyz.vercel.app`

4. **Access from anywhere:**
   - Open the URL on your mobile phone
   - Works from anywhere with internet!

### B. Deploy to Netlify (Free, Drag & Drop)

1. Go to: https://app.netlify.com/drop
2. Drag the `d:\project` folder onto the page
3. Get instant URL
4. Open on mobile!

---

## **Option 3: Transfer Files to Phone**

### Via USB:
1. Connect phone to computer
2. Copy entire `d:\project` folder to phone
3. Open `index.html` in mobile browser

### Via Cloud:
1. Upload `d:\project` folder to Google Drive/OneDrive
2. Download on phone
3. Open `index.html` in mobile browser

---

## **Troubleshooting Map Issue**

The map might not show because:

### Fix 1: Check Browser Console
1. Open browser DevTools (F12)
2. Click "Console" tab
3. Look for errors related to Leaflet or map
4. Share any errors you see

### Fix 2: Test Map Separately
I'll create a simple test file to verify map works.

### Fix 3: Internet Connection
- Map tiles need internet to load
- Make sure you're online when clicking "Map" view

---

## **Recommended: Use Option 2A (Vercel)**

**Why?**
- ✅ Works on any device
- ✅ Real GPS on mobile
- ✅ Shareable link
- ✅ Free forever
- ✅ Auto HTTPS (secure)
- ✅ Takes 2 minutes

**Steps:**
```powershell
npm install -g vercel
cd d:\project
vercel
```

Then open the URL on your phone! 🚀
