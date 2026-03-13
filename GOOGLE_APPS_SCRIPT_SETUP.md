# วิธีแก้ไข Error: Network error: Failed to fetch

## ปัญหา
เว็บไซต์ไม่สามารถส่งข้อมูลไปยัง Google Apps Script ได้ เนื่องจาก:
1. Google Apps Script ยังไม่ได้ deploy เป็น Web App
2. การตั้งค่า CORS ไม่ถูกต้อง
3. URL ของ Apps Script ไม่ถูกต้อง

## วิธีแก้ไข

### ขั้นตอนที่ 1: Deploy Google Apps Script

1. เปิดไฟล์ `docs/apps-script-iftar-registration-updated.js`
2. คัดลอกโค้ดทั้งหมด
3. ไปที่ https://script.google.com/
4. สร้าง New Project
5. วางโค้ดที่คัดลอกมา
6. แก้ไข `SLIP_FOLDER_ID` และ `SPREADSHEET_ID` ให้ตรงกับของคุณ

### ขั้นตอนที่ 2: Deploy เป็น Web App

1. คลิก **Deploy** > **New deployment**
2. เลือก type: **Web app**
3. ตั้งค่าดังนี้:
   - Description: "Iftar Registration API"
   - Execute as: **Me** (your email)
   - Who has access: **Anyone** (สำคัญมาก!)
4. คลิก **Deploy**
5. คัดลอก **Web app URL** ที่ได้

### ขั้นตอนที่ 3: อัพเดท URL ในโค้ด

1. เปิดไฟล์ `src/pages/Home.tsx`
2. ค้นหา URL เก่า: `https://script.google.com/macros/s/AKfycbzB1jxw1EBlcuRePgk3RkepDggt9nsEGSq6QZyE9N6KqZQnptktiB7VzQ2WZZ4kGK4S/exec`
3. แทนที่ด้วย URL ใหม่ที่คัดลอกมา (มี 2 ที่)

### ขั้นตอนที่ 4: ทดสอบ

1. Build โปรเจกต์ใหม่: `npm run build`
2. Deploy ขึ้น Netlify/Vercel
3. ทดสอบลงทะเบียน

## หมายเหตุ

- ถ้ายังมีปัญหา ให้ตรวจสอบว่า Google Sheet และ Drive Folder มี permission ถูกต้อง
- ตรวจสอบ Console log ใน Browser DevTools (F12) เพื่อดู error message
