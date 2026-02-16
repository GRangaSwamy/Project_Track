# 🔧 Cloudinary Upload Preset Setup Guide

## ⚠️ IMPORTANT: You MUST create an unsigned upload preset in Cloudinary

The 400 Bad Request error is because the upload preset doesn't exist or isn't configured correctly.

---

## 📋 **Step-by-Step Setup**

### Step 1: Login to Cloudinary Dashboard
1. Go to: https://cloudinary.com/console
2. Login with your account

### Step 2: Navigate to Upload Presets
1. Click **Settings** (gear icon) in the top right
2. Click **Upload** tab in the left sidebar
3. Scroll down to **Upload presets** section

### Step 3: Create Unsigned Upload Preset
1. Click **Add upload preset**
2. Configure:
   - **Preset name:** `daily_logs`
   - **Signing mode:** **Unsigned** ⚠️ CRITICAL
   - **Folder:** `construction_tracker` (optional)
   - **Access mode:** Public
   - **Unique filename:** Yes (recommended)
   - **Overwrite:** No (recommended)

3. Click **Save**

### Step 4: Verify Configuration
1. Find your new preset in the list
2. Verify:
   - ✅ Name is exactly: `daily_logs`
   - ✅ Signing mode shows: **Unsigned**
   - ✅ Status is: **Enabled**

---

## 🔍 **Verify Your Cloudinary Config**

### Cloud Name:
Your cloud name is: **`dqis32szu`**

You can verify this at:
https://cloudinary.com/console/settings/account

### Upload Preset:
Must be: **`daily_logs`** (unsigned)

### Upload URL:
```
https://api.cloudinary.com/v1_1/dqis32szu/image/upload
```

---

## 🧪 **Test Upload Preset**

You can test if your preset works using curl:

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/dqis32szu/image/upload \
  -F "file=@/path/to/test-image.jpg" \
  -F "upload_preset=daily_logs"
```

**Expected Response:**
```json
{
  "public_id": "construction_tracker/abc123",
  "secure_url": "https://res.cloudinary.com/dqis32szu/image/upload/v1234567890/construction_tracker/abc123.jpg",
  "width": 1920,
  "height": 1080,
  ...
}
```

**Error Response (if preset doesn't exist):**
```json
{
  "error": {
    "message": "Upload preset not found"
  }
}
```

---

## ⚠️ **Common Issues**

### Issue 1: "Upload preset not found"
**Cause:** Preset doesn't exist or name is wrong

**Fix:**
1. Go to Cloudinary dashboard
2. Settings → Upload → Upload presets
3. Create preset named exactly: `daily_logs`
4. Make sure it's **Unsigned**

### Issue 2: "Must supply api_key"
**Cause:** Preset is set to "Signed" instead of "Unsigned"

**Fix:**
1. Edit the preset
2. Change **Signing mode** to **Unsigned**
3. Save

### Issue 3: 400 Bad Request
**Causes:**
- Preset doesn't exist
- Preset is signed (not unsigned)
- Cloud name is wrong
- File is too large

**Fix:**
1. Verify cloud name: `dqis32szu`
2. Verify preset exists and is unsigned
3. Check file size < 10MB
4. Check file is an image

---

## 📝 **Cloudinary Dashboard URLs**

- **Console:** https://cloudinary.com/console
- **Settings:** https://cloudinary.com/console/settings
- **Upload Presets:** https://cloudinary.com/console/settings/upload
- **Account:** https://cloudinary.com/console/settings/account

---

## ✅ **Verification Checklist**

Before testing the upload:

- [ ] Logged into Cloudinary dashboard
- [ ] Navigated to Settings → Upload
- [ ] Created upload preset named: `daily_logs`
- [ ] Set signing mode to: **Unsigned**
- [ ] Preset status is: **Enabled**
- [ ] Verified cloud name is: `dqis32szu`
- [ ] Saved the preset

---

## 🚀 **After Setup**

Once you've created the unsigned upload preset:

1. The upload should work immediately
2. No code changes needed
3. Test by uploading an image in your app
4. Check browser console for success/error logs

---

## 🔐 **Security Notes**

### ✅ Safe (Unsigned Upload):
- No API secret in frontend code
- Upload preset controls what can be uploaded
- Public read access to images
- Cloudinary handles security

### ❌ Never Do:
- Don't use signed uploads in frontend
- Don't expose API secret
- Don't hardcode API key in client code

---

## 📊 **Expected Behavior**

### Successful Upload:
```
📤 Uploading image to Cloudinary: photo.jpg (245.67 KB)
✅ Image uploaded successfully: https://res.cloudinary.com/dqis32szu/image/upload/v1234567890/construction_tracker/abc123.jpg
```

### Failed Upload:
```
❌ Cloudinary upload error: {
  status: 400,
  error: { message: "Upload preset not found" }
}
```

---

## 🎯 **Next Steps**

1. **Create the upload preset** (if not done)
2. **Test the upload** in your app
3. **Check browser console** for logs
4. **Verify images** appear in Cloudinary Media Library

---

## 📞 **Need Help?**

If you're still getting errors:

1. Check browser console for detailed error logs
2. Verify preset exists in Cloudinary dashboard
3. Verify preset is **Unsigned**
4. Try the curl test command above
5. Check Cloudinary status: https://status.cloudinary.com/

---

**Once the preset is created, the upload will work!** 🎉
