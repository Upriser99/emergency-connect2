# 🔧 Map Fix - IMPORTANT!

## ❌ Problem
When you open `index.html` directly by double-clicking (using `file://` protocol), the browser blocks JavaScript files from loading due to security restrictions (CORS policy). This is why you see:
```
MapService is not defined
```

## ✅ Solution
You **MUST** run the app through a local server. I've already started one for you!

---

## 🚀 Quick Start (Server is Running!)

### The server is already running on your computer!

**Access the app:**
1. Open your browser
2. Go to: **http://localhost:8000**
3. The map should now work!

**To stop the server:**
- Press `Ctrl+C` in the PowerShell window where it's running

---

## 📱 For Mobile Testing

### Option 1: Same WiFi Network
1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.5`)

2. On your phone (connected to same WiFi):
   - Open browser
   - Go to: `http://YOUR_IP:8000`
   - Example: `http://192.168.1.5:8000`

### Option 2: Deploy Online (Recommended)
```powershell
# Install Vercel (one-time)
npm install -g vercel

# Deploy (takes 2 minutes)
cd d:\project
vercel
```
Then open the URL on any device!

---

## 🔄 To Restart Server Later

**Option A: Double-click**
- Just double-click `start-server.bat` in the project folder

**Option B: Command Line**
```powershell
cd d:\project
python -m http.server 8000
```

Then open: **http://localhost:8000**

---

## ✅ Checklist

- [x] Server is running (I started it for you)
- [ ] Open http://localhost:8000 in your browser
- [ ] Click a category (e.g., Hospitals)
- [ ] Click "🗺️ Map" button
- [ ] Map should now display with markers!

---

## 🐛 If Map Still Doesn't Work

1. **Check browser console** (Press F12):
   - Look for any red errors
   - Share them with me

2. **Try the test page**:
   - Go to: http://localhost:8000/map-test.html
   - If this works, the main app should too

3. **Clear browser cache**:
   - Press `Ctrl+Shift+Delete`
   - Clear cached files
   - Refresh the page

---

**The server is running now - just open http://localhost:8000 in your browser!** 🎉
