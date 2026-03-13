# 🚀 Quick Start Guide - แก้ไข Network Error

## ปัญหาที่พบ
```
Error: Network error: Failed to fetch
```

## แก้ไขใน 5 นาที ⚡

### ขั้นตอนที่ 1: เตรียม Google Sheet และ Drive Folder

1. สร้าง Google Sheet ใหม่
2. คัดลอก Spreadsheet ID จาก URL
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

3. สร้าง Google Drive Folder สำหรับเก็บสลิป
4. คัดลอก Folder ID จาก URL
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID]
   ```

### ขั้นตอนที่ 2: Deploy Google Apps Script

1. เปิด https://script.google.com/
2. New Project
3. คัดลอกโค้ดจาก `docs/apps-script-iftar-registration-updated.js`
4. แก้ไข:
   ```javascript
   var SLIP_FOLDER_ID = 'YOUR_FOLDER_ID';
   var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
   ```

5. Deploy → New deployment
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** ⚠️
   - Deploy

6. คัดลอก Web app URL

### ขั้นตอนที่ 3: อัพเดทโค้ด

แก้ไข `src/config.ts`:
```typescript
export const GOOGLE_APPS_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE'
```

### ขั้นตอนที่ 4: ทดสอบ

1. เปิด `test-api.html` ในเบราว์เซอร์
2. ใส่ URL ที่ได้จาก Apps Script
3. กดปุ่ม "ทดสอบการเชื่อมต่อ"
4. ถ้าเห็น ✅ สำเร็จ! แสดงว่าพร้อมแล้ว

### ขั้นตอนที่ 5: Build และ Deploy

```bash
npm run build
```

จากนั้น deploy ตามคู่มือใน `DeploymentGuide.txt`

## ✅ Checklist

- [ ] Google Sheet สร้างแล้ว
- [ ] Drive Folder สร้างแล้ว
- [ ] Apps Script deploy แล้ว (Who has access: Anyone)
- [ ] URL อัพเดทใน src/config.ts
- [ ] ทดสอบด้วย test-api.html แล้ว (ได้ ✅)
- [ ] Build ใหม่แล้ว
- [ ] Deploy แล้ว

## 🆘 ยังไม่ได้?

ดูรายละเอียดเพิ่มเติมใน:
- `GOOGLE_APPS_SCRIPT_SETUP.md` - คู่มือละเอียด
- `TROUBLESHOOTING.md` - แก้ไขปัญหา
- `DeploymentGuide.txt` - วิธี deploy
