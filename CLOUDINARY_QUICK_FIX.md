# 📸 Cloudinary Upload Preset - Visual Setup Guide

## 🎯 **Quick Fix: Create Upload Preset in 3 Minutes**

The 400 Bad Request error is because the upload preset doesn't exist. Follow these steps:

---

## 🚀 **Step-by-Step with Screenshots**

### Step 1: Login to Cloudinary
```
URL: https://cloudinary.com/console
```

### Step 2: Go to Settings
```
Click the ⚙️ Settings icon (top right corner)
```

### Step 3: Navigate to Upload Tab
```
Left sidebar → Click "Upload"
```

### Step 4: Find Upload Presets Section
```
Scroll down to "Upload presets" section
```

### Step 5: Add Upload Preset
```
Click "+ Add upload preset" button
```

### Step 6: Configure Preset
```
┌─────────────────────────────────────┐
│ Upload Preset Configuration         │
├─────────────────────────────────────┤
│                                     │
│ Preset name: *                      │
│ [daily_logs                      ]  │
│                                     │
│ Signing mode: *                     │
│ ○ Signed                            │
│ ● Unsigned  ← SELECT THIS!          │
│                                     │
│ Folder:                             │
│ [construction_tracker            ]  │
│                                     │
│ Access mode:                        │
│ [Public                          ▼] │
│                                     │
│ Unique filename:                    │
│ ☑ Yes (recommended)                 │
│                                     │
│ Overwrite:                          │
│ ☐ No (recommended)                  │
│                                     │
│         [Cancel]  [Save]            │
└─────────────────────────────────────┘
```

### Step 7: Save
```
Click "Save" button
```

### Step 8: Verify
```
You should see your new preset in the list:

┌─────────────────────────────────────┐
│ Upload Presets                      │
├─────────────────────────────────────┤
│ Name          Mode       Status     │
│ daily_logs    Unsigned   Enabled    │
└─────────────────────────────────────┘
```

---

## ✅ **Configuration Checklist**

Make sure these are set correctly:

```
✅ Preset name: daily_logs
✅ Signing mode: Unsigned (NOT Signed)
✅ Status: Enabled
✅ Folder: construction_tracker (optional)
✅ Access mode: Public
```

---

## 🧪 **Test It Works**

### Option 1: Test in Your App
1. Run: `npm run dev`
2. Go to a Phase
3. Click "Upload Phase Images"
4. Select an image
5. Click "Upload"
6. Check browser console

### Option 2: Test with Curl
```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/dqis32szu/image/upload \
  -F "file=@/path/to/test-image.jpg" \
  -F "upload_preset=daily_logs"
```

**Success Response:**
```json
{
  "secure_url": "https://res.cloudinary.com/dqis32szu/image/upload/...",
  "public_id": "construction_tracker/abc123",
  "width": 1920,
  "height": 1080
}
```

---

## 🔍 **Troubleshooting**

### Error: "Upload preset not found"
**Fix:** The preset doesn't exist. Create it following steps above.

### Error: "Must supply api_key"
**Fix:** Preset is set to "Signed" instead of "Unsigned". Change it to Unsigned.

### Error: 400 Bad Request
**Fix:** 
1. Verify preset name is exactly: `daily_logs`
2. Verify preset is Unsigned
3. Verify cloud name is: `dqis32szu`

---

## 📋 **Quick Reference**

### Your Cloudinary Config:
```
Cloud Name:     dqis32szu
Upload Preset:  daily_logs
Signing Mode:   Unsigned
Folder:         construction_tracker
Upload URL:     https://api.cloudinary.com/v1_1/dqis32szu/image/upload
```

### Dashboard URLs:
```
Console:        https://cloudinary.com/console
Settings:       https://cloudinary.com/console/settings
Upload Presets: https://cloudinary.com/console/settings/upload
Media Library:  https://cloudinary.com/console/media_library
```

---

## 🎯 **What Happens After Setup**

Once you create the preset:

1. ✅ Upload will work immediately
2. ✅ No code changes needed
3. ✅ Images upload to Cloudinary
4. ✅ URLs saved to Firestore
5. ✅ Images display in gallery

---

## 🔐 **Security Notes**

### Why Unsigned?
- ✅ Safe for frontend use
- ✅ No API secret needed
- ✅ Cloudinary handles security
- ✅ You control what can be uploaded via preset settings

### What's Protected?
- ✅ Upload size limits
- ✅ File type restrictions
- ✅ Folder organization
- ✅ Access controls

---

## 📊 **Expected Console Output**

### Success:
```
📤 Uploading image to Cloudinary: photo.jpg (245.67 KB)
✅ Image uploaded successfully: https://res.cloudinary.com/dqis32szu/image/upload/v1234567890/construction_tracker/abc123.jpg
✅ Phase images uploaded successfully
```

### Failure (Preset Not Found):
```
❌ Cloudinary upload error: {
  status: 400,
  statusText: 'Bad Request',
  error: {
    message: 'Upload preset not found'
  }
}
```

---

## ⏱️ **Time to Fix: 3 Minutes**

1. Login to Cloudinary (30 seconds)
2. Navigate to Upload Presets (30 seconds)
3. Create preset (1 minute)
4. Save and verify (1 minute)

**Total: 3 minutes** ⏱️

---

## 🎉 **That's It!**

Once you create the upload preset, the image upload will work perfectly!

**The code is already fixed - you just need to create the preset!** ✅

---

## 📞 **Need Help?**

If you're still stuck:

1. **Check:** Preset exists in dashboard
2. **Verify:** Preset is Unsigned
3. **Test:** Use curl command above
4. **Check:** Browser console for errors
5. **Verify:** Cloud name is `dqis32szu`

**Most issues are solved by creating the unsigned upload preset!**
