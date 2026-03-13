# คู่มือแก้ไขปัญหา (Troubleshooting Guide)

## ปัญหา: Error: Network error: Failed to fetch

### สาเหตุที่เป็นไปได้

1. **Google Apps Script ยังไม่ได้ deploy หรือ deploy ไม่ถูกต้อง**
2. **URL ของ Google Apps Script ไม่ถูกต้อง**
3. **การตั้งค่า permissions ไม่ถูกต้อง**
4. **ปัญหา CORS (Cross-Origin Resource Sharing)**

### วิธีแก้ไขทีละขั้นตอน

#### 1. ตรวจสอบ Google Apps Script Deployment

```bash
# เปิดไฟล์ Apps Script
open docs/apps-script-iftar-registration-updated.js
```

ทำตามขั้นตอนใน `GOOGLE_APPS_SCRIPT_SETUP.md`

#### 2. อัพเดท URL ในโค้ด

แก้ไขไฟล์ `src/config.ts`:

```typescript
export const GOOGLE_APPS_SCRIPT_URL = 'YOUR_NEW_DEPLOYMENT_URL_HERE'
```

#### 3. ทดสอบในเครื่อง

```bash
npm run dev
```

เปิด Browser DevTools (F12) และดู Console เพื่อตรวจสอบ error

#### 4. Build และ Deploy

```bash
npm run build
```

### การทดสอบว่า Apps Script ทำงานหรือไม่

ใช้ curl หรือ Postman ทดสอบ:

```bash
curl -X POST YOUR_APPS_SCRIPT_URL \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "organization": "Test Org",
    "phone": "0812345678",
    "adults": 1,
    "children": 0,
    "toddlers": 0,
    "total": 300,
    "timestamp": "2026-03-13T10:00:00.000Z"
  }'
```

ควรได้ response:
```json
{"success":true,"slipUrl":"","slipError":""}
```

### ปัญหาอื่นๆ

#### ปัญหา: ส่งข้อมูลสำเร็จแต่ไม่เห็นใน Google Sheet

- ตรวจสอบ `SPREADSHEET_ID` ใน Apps Script
- ตรวจสอบว่า Sheet มีชื่อ "FormResponses"
- ตรวจสอบ permissions ของ Spreadsheet

#### ปัญหา: อัพโหลดสลิปไม่ได้

- ตรวจสอบ `SLIP_FOLDER_ID` ใน Apps Script
- ตรวจสอบว่า Apps Script มี permission เข้าถึง Drive Folder
- ตรวจสอบว่าไฟล์ไม่เกิน 50MB

## ติดต่อ

หากยังมีปัญหา กรุณาติดต่อผู้ดูแลระบบ
