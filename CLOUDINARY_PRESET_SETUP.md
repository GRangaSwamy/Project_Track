# CLOUDINARY UPLOAD PRESET SETUP - QUICK GUIDE

**Cloud Name:** `dqis32szu`
**Required Preset:** `construction_tracker`

---

## 🚀 QUICK SETUP (5 Minutes)

### Step 1: Login to Cloudinary

1. Go to: https://cloudinary.com/console
2. Login with your credentials
3. You should see the dashboard for cloud: `dqis32szu`

---

### Step 2: Create Upload Preset

1. Click **Settings** (gear icon) in top-right
2. Click **Upload** tab in left sidebar
3. Scroll down to **Upload presets** section
4. Click **Add upload preset** button

---

### Step 3: Configure Preset

**Basic Settings:**
- **Preset name**: `construction_tracker`
- **Signing mode**: **Unsigned** ⚠️ IMPORTANT!
- **Folder**: `construction-tracker/projects`

**Advanced Settings (Optional):**
- **Allowed formats**: jpg, png, webp
- **Max file size**: 5 MB
- **Transformations**: 
  - Width: 1920
  - Height: 600
  - Crop: Limit
  - Quality: Auto
  - Format: Auto

**Click SAVE**

---

### Step 4: Verify Configuration

**Check these values:**
```
✅ Preset name: construction_tracker
✅ Signing mode: Unsigned
✅ Folder: construction-tracker/projects
✅ Status: Active
```

---

### Step 5: Test Upload

**Run the app:**
```bash
npm run dev
```

**Test:**
1. Navigate to "Add Project"
2. Click "Upload Project Image"
3. Select an image
4. Check console for: `✅ Image uploaded successfully`
5. Verify image appears in preview

**Check Cloudinary:**
1. Go to **Media Library**
2. Navigate to `construction-tracker/projects` folder
3. Verify uploaded image appears

---

## ✅ VERIFICATION CHECKLIST

- [ ] Logged into Cloudinary dashboard
- [ ] Cloud name is `dqis32szu`
- [ ] Created upload preset named `construction_tracker`
- [ ] Set signing mode to **Unsigned**
- [ ] Set folder to `construction-tracker/projects`
- [ ] Saved preset
- [ ] Tested upload in app
- [ ] Image appears in Cloudinary Media Library

---

## 🐛 TROUBLESHOOTING

### Error: 401 Unauthorized

**Cause:** Preset not found or not unsigned

**Fix:**
1. Check preset name is exactly: `construction_tracker`
2. Verify signing mode is **Unsigned** (not Signed)
3. Make sure preset is saved and active

---

### Error: Preset not found

**Cause:** Preset name mismatch

**Fix:**
1. Check preset name in dashboard
2. Update code if needed:
   ```javascript
   const CLOUDINARY_UPLOAD_PRESET = 'your_actual_preset_name';
   ```

---

### Upload succeeds but image not in folder

**Cause:** Folder setting incorrect

**Fix:**
1. Edit preset in dashboard
2. Set folder to: `construction-tracker/projects`
3. Save preset

---

## 📋 PRESET SETTINGS REFERENCE

```yaml
Preset Name: construction_tracker
Signing Mode: Unsigned
Folder: construction-tracker/projects
Allowed Formats: jpg, png, webp
Max File Size: 5 MB
Transformations:
  - Width: 1920
  - Height: 600
  - Crop: limit
  - Quality: auto
  - Format: auto
```

---

## 🔗 USEFUL LINKS

- **Cloudinary Console**: https://cloudinary.com/console
- **Upload Settings**: https://cloudinary.com/console/settings/upload
- **Media Library**: https://cloudinary.com/console/media_library
- **Documentation**: https://cloudinary.com/documentation/upload_presets

---

## ✅ SETUP COMPLETE!

Once configured, your app can:
- ✅ Upload project images
- ✅ Store in organized folders
- ✅ Auto-optimize images
- ✅ Serve via CDN
- ✅ No backend needed

**Ready to use!** 🎉
