# MATERIAL TRACKING - QUICK REFERENCE GUIDE

## 🚀 QUICK START

### Adding Material Entry
1. Navigate to Project Detail page
2. Scroll to Material Tracking section
3. Click **➕ Add** on any material card
4. Fill in:
   - Amount (e.g., 3000)
   - Date (default: today)
   - Payment Method (Cash/PhonePe)
5. Click **✓ Save**
6. Total updates instantly!

### Viewing Estimation
1. Click **📊 Get Detailed Estimation** button
2. View date-wise breakdown table
3. See payment methods for each entry
4. Click **📄 Download PDF** to export

### Deleting Entry
1. Open Detailed Estimation
2. Scroll to Individual Entries
3. Click **❌ Delete** on any entry
4. Confirm deletion
5. Table updates instantly!

---

## 📋 COMPONENT REFERENCE

### MaterialImageStrip
**Location:** `src/components/common/MaterialImageStrip.jsx`

**Props:**
- `projectId` (string, required) - Project ID
- `onUpdate` (function, optional) - Callback after update

**Features:**
- Real-time totals with onSnapshot
- Inline add form
- Payment method selection
- Horizontal scroll
- Responsive design

**Usage:**
```jsx
<MaterialImageStrip 
    projectId={projectId} 
    onUpdate={handleMaterialUpdate}
/>
```

---

### MaterialEstimationTable
**Location:** `src/components/common/MaterialEstimationTable.jsx`

**Props:**
- `isOpen` (boolean, required) - Modal open state
- `onClose` (function, required) - Close handler
- `projectId` (string, required) - Project ID
- `projectName` (string, optional) - For PDF filename
- `onUpdate` (function, optional) - Callback after update

**Features:**
- Real-time sync with onSnapshot
- PDF export with jsPDF
- Delete functionality
- Payment method display
- Simple black & white design

**Usage:**
```jsx
<MaterialEstimationTable
    isOpen={isEstimationTableOpen}
    onClose={() => setIsEstimationTableOpen(false)}
    projectId={projectId}
    projectName={project?.name}
    onUpdate={handleMaterialUpdate}
/>
```

---

## 🔧 SERVICE FUNCTIONS

### subscribeMaterialLogs
**Real-time listener for material logs**

```javascript
const unsubscribe = subscribeMaterialLogs(projectId, (result) => {
    if (result.success) {
        const logs = result.data;
        // Update UI
    }
});

// Cleanup
return () => unsubscribe();
```

---

### addMaterialLog
**Add new material entry**

```javascript
const result = await addMaterialLog(projectId, {
    material: 'Sand',
    amount: 3000,
    date: '2026-02-16',
    paymentMethod: 'Cash'
});

if (result.success) {
    console.log('Log created:', result.id);
}
```

---

### deleteMaterialLog
**Delete material entry**

```javascript
const result = await deleteMaterialLog(projectId, logId);

if (result.success) {
    console.log('Log deleted');
}
```

---

### calculateMaterialTotals
**Calculate totals from logs array**

```javascript
const totals = calculateMaterialTotals(logs);
// Returns: { Sand: 4000, Cement: 4000, ... }
```

---

### groupLogsByDate
**Group logs by date**

```javascript
const grouped = groupLogsByDate(logs);
// Returns: { logsByDate: {...}, dates: [...] }
```

---

## 💾 DATABASE SCHEMA

### Collection Path
```
projects/{projectId}/materialLogs/{logId}
```

### Document Structure
```javascript
{
  material: "Sand",              // String (required)
  amount: 3000,                  // Number (required)
  date: "2026-02-16",            // String (required)
  paymentMethod: "Cash",         // String (required)
  timestamp: serverTimestamp()   // Timestamp (auto)
}
```

### Validation Rules
- `material`: Must be one of: Sand, Cement, Labour, Metal, Iron
- `amount`: Must be positive number
- `date`: Must be valid ISO date string
- `paymentMethod`: Must be "Cash" or "PhonePe"

---

## 🎨 CONSTANTS

### MATERIALS
```javascript
['Sand', 'Cement', 'Labour', 'Metal', 'Iron']
```

### PAYMENT_METHODS
```javascript
['Cash', 'PhonePe']
```

### MATERIAL_IMAGES
```javascript
{
    Sand: 'https://images.unsplash.com/...',
    Cement: 'https://images.unsplash.com/...',
    Labour: 'https://images.unsplash.com/...',
    Metal: 'https://images.unsplash.com/...',
    Iron: 'https://images.unsplash.com/...',
}
```

---

## 📄 PDF EXPORT

### Generate PDF
```javascript
const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.text('Material Estimation Report', 14, 20);
    
    // Add project info
    doc.text(`Project: ${projectName}`, 14, 30);
    
    // Generate table
    doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
    });
    
    // Save
    doc.save(`${projectName}_Estimation.pdf`);
};
```

### PDF Customization
- **Page Size:** A4
- **Theme:** Grid (black & white)
- **Font:** Helvetica
- **Margins:** 14px

---

## 🔄 REAL-TIME SYNC

### Setup Listener
```javascript
useEffect(() => {
    if (!projectId) return;
    
    const unsubscribe = subscribeMaterialLogs(projectId, (result) => {
        if (result.success) {
            // Update state
            setLogs(result.data);
        }
    });
    
    // Cleanup on unmount
    return () => unsubscribe();
}, [projectId]);
```

### Benefits
- ✅ Instant updates across devices
- ✅ No manual refresh needed
- ✅ Automatic cleanup
- ✅ Efficient data sync

---

## 🎯 COMMON TASKS

### Task 1: Change Material Images
**File:** `src/services/materialService.js`

```javascript
const MATERIAL_IMAGES = {
    Sand: 'YOUR_IMAGE_URL',
    Cement: 'YOUR_IMAGE_URL',
    // ... update all
};
```

---

### Task 2: Add New Payment Method
**File:** `src/services/materialService.js`

```javascript
const PAYMENT_METHODS = ['Cash', 'PhonePe', 'GooglePay'];
```

**File:** `src/components/common/MaterialImageStrip.jsx`
- Update radio buttons to include new method

---

### Task 3: Customize PDF Layout
**File:** `src/components/common/MaterialEstimationTable.jsx`

```javascript
doc.autoTable({
    head: [tableHeaders],
    body: tableData,
    theme: 'grid',  // Change to 'striped', 'plain'
    styles: {
        fontSize: 9,  // Adjust font size
        cellPadding: 3,  // Adjust padding
    },
});
```

---

### Task 4: Change Date Format
**File:** `src/components/common/MaterialEstimationTable.jsx`

```javascript
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',  // Add year
    });
};
```

---

## 🐛 TROUBLESHOOTING

### Issue: Real-time updates not working
**Solution:**
1. Check Firestore rules allow read/write
2. Verify projectId is valid
3. Check browser console for errors
4. Ensure cleanup function is called

### Issue: PDF not downloading
**Solution:**
1. Check jsPDF is installed
2. Verify browser allows downloads
3. Check console for errors
4. Try different browser

### Issue: Images not loading
**Solution:**
1. Check image URLs are valid
2. Verify CORS settings
3. Check network tab in DevTools
4. Use local images if needed

### Issue: Payment method not saving
**Solution:**
1. Check formData state
2. Verify radio button selection
3. Check addMaterialLog call
4. Verify Firestore document

---

## 📱 MOBILE OPTIMIZATION

### Horizontal Scroll
```css
overflowX: 'auto'
scrollbarWidth: 'thin'
```

### Touch Targets
- Minimum 44px × 44px
- Adequate spacing
- Large buttons

### Responsive Grid
```css
minWidth: '280px'
maxWidth: '280px'
gap: 'var(--spacing-md)'
```

---

## ⚡ PERFORMANCE TIPS

### 1. Lazy Load Images
```javascript
loading="lazy"
```

### 2. Memoize Calculations
```javascript
const totals = useMemo(() => 
    calculateMaterialTotals(logs), 
    [logs]
);
```

### 3. Debounce Real-time Updates
```javascript
const debouncedUpdate = debounce(updateUI, 300);
```

### 4. Optimize PDF Generation
- Generate only when needed
- Cache table data
- Use smaller images

---

## 🔐 SECURITY NOTES

### Firestore Rules
```javascript
match /projects/{projectId}/materialLogs/{logId} {
    allow read, write: if request.auth != null;
    allow delete: if request.auth != null;
}
```

### Input Validation
- Sanitize amount input
- Validate date format
- Check material type
- Verify payment method

---

## 📊 ANALYTICS TRACKING

### Track Material Additions
```javascript
analytics.logEvent('material_added', {
    material: material,
    amount: amount,
    paymentMethod: paymentMethod
});
```

### Track PDF Downloads
```javascript
analytics.logEvent('pdf_downloaded', {
    projectId: projectId,
    entryCount: logs.length
});
```

---

## 🎓 BEST PRACTICES

1. **Always cleanup listeners**
   ```javascript
   return () => unsubscribe();
   ```

2. **Validate before save**
   ```javascript
   if (!amount || amount <= 0) return;
   ```

3. **Show loading states**
   ```javascript
   {loading && <LoadingSpinner />}
   ```

4. **Handle errors gracefully**
   ```javascript
   try {
       // operation
   } catch (error) {
       alert('Error: ' + error.message);
   }
   ```

5. **Use constants**
   ```javascript
   import { MATERIALS, PAYMENT_METHODS } from '...';
   ```

---

## 📞 SUPPORT

For issues or questions:
1. Check this guide
2. Review component code
3. Check browser console
4. Verify Firestore data
5. Test in incognito mode

---

**Quick Reference Guide Complete** ✅

All essential information for working with the enhanced Material Tracking System!
