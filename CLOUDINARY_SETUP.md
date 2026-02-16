# CLOUDINARY SETUP INSTRUCTIONS

**Date**: 2026-02-16
**Purpose**: Configure Cloudinary for project image uploads

---

## 🔧 CLOUDINARY CONFIGURATION

### Step 1: Create Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

### Step 2: Get Your Credentials

1. Login to Cloudinary Dashboard
2. Go to **Dashboard** → **Settings** → **Upload**
3. Note down:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - Create an **Upload Preset** (see below)

### Step 3: Create Upload Preset

1. In Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `construction-tracker-projects`
   - **Signing mode**: **Unsigned** (for client-side uploads)
   - **Folder**: `construction-tracker/projects`
   - **Transformations** (optional):
     - Width: 1920
     - Height: 600
     - Crop: Limit
     - Quality: Auto
     - Format: Auto
5. Click **Save**

### Step 4: Update Code

Open `src/services/imageUploadService.js` and update:

```javascript
const CLOUDINARY_CLOUD_NAME = 'your-cloud-name'; // Replace with your cloud name
const CLOUDINARY_UPLOAD_PRESET = 'construction-tracker-projects'; // Replace with your preset name
```

**Example:**
```javascript
const CLOUDINARY_CLOUD_NAME = 'dxyz123abc';
const CLOUDINARY_UPLOAD_PRESET = 'construction-tracker-projects';
```

---

## 📋 CONFIGURATION CHECKLIST

- [ ] Created Cloudinary account
- [ ] Verified email
- [ ] Noted Cloud Name
- [ ] Created Upload Preset (unsigned)
- [ ] Set folder to `construction-tracker/projects`
- [ ] Updated `imageUploadService.js` with credentials
- [ ] Tested image upload in Add Project form

---

## 🔒 SECURITY NOTES

### Unsigned Upload Preset
- ✅ **Pros**: Easy client-side uploads, no backend needed
- ⚠️ **Cons**: Anyone with your preset can upload to your Cloudinary

### Recommendations:
1. **Set upload limits** in Cloudinary dashboard
2. **Enable moderation** if needed
3. **Monitor usage** regularly
4. **Use signed uploads** for production (requires backend)

### For Production:
Consider implementing signed uploads with a backend endpoint:
```javascript
// Backend endpoint to generate signature
POST /api/cloudinary/signature
```

---

## 📊 CLOUDINARY FREE TIER LIMITS

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

**Sufficient for small to medium construction tracking apps!**

---

## 🧪 TESTING

### Test Image Upload:

1. Run the app: `npm run dev`
2. Navigate to **Add Project**
3. Fill in project details
4. Click **Upload Project Image**
5. Select an image
6. Check console for upload success
7. Verify image appears in preview
8. Submit form
9. Check Project Detail page for background image

### Verify in Cloudinary:

1. Login to Cloudinary Dashboard
2. Go to **Media Library**
3. Navigate to `construction-tracker/projects` folder
4. Verify uploaded images appear

---

## 🐛 TROUBLESHOOTING

### Error: "Upload failed"
- ✅ Check Cloud Name is correct
- ✅ Check Upload Preset is correct
- ✅ Verify preset is **unsigned**
- ✅ Check internet connection

### Error: "Invalid file type"
- ✅ Only JPG, PNG, WebP allowed
- ✅ Check file extension

### Error: "File too large"
- ✅ Maximum file size: 5MB
- ✅ Image will be compressed before upload

### Image not showing in header
- ✅ Check `projectImageUrl` saved in Firestore
- ✅ Verify Cloudinary URL is accessible
- ✅ Check browser console for errors

---

## 🎨 IMAGE OPTIMIZATION

### Automatic Optimizations:
- **Compression**: Images compressed before upload
- **Format**: Auto-converted to WebP (modern browsers)
- **Quality**: Auto-optimized for web
- **Dimensions**: Limited to 1920x600 for headers

### Manual Optimization:
Edit transformations in `imageUploadService.js`:

```javascript
formData.append('transformation', JSON.stringify([
    { width: 1920, height: 600, crop: 'limit' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
]));
```

---

## 🚀 DEPLOYMENT NOTES

### Environment Variables (Recommended):

Create `.env` file:
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=construction-tracker-projects
```

Update `imageUploadService.js`:
```javascript
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
```

Add to `.gitignore`:
```
.env
.env.local
```

---

## ✅ SETUP COMPLETE

Once configured, you can:
- ✅ Upload project images during creation
- ✅ Change project background images anytime
- ✅ View beautiful hero-style project headers
- ✅ Automatic image optimization
- ✅ Mobile camera capture support

**Ready to use!** 🎉
