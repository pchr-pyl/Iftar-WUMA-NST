/**
 * @file Home.tsx
 * @description Multi-step registration wizard for the WUMA Iftar Party with Black &amp; Gold theme,
 * dual language support (TH/EN), and local light/dark mode switching.
 */

import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Moon, Sun, Globe } from 'lucide-react'
import { GOOGLE_APPS_SCRIPT_URL, QR_CODE_IMAGE_URL, PRICING } from '../config'

/**
 * Represents a full snapshot of the registration data for one attendee group.
 */
interface RegistrationState {
  /** Full name of the registrant. */
  fullName: string
  /** Organization or unit. */
  organization: string
  /** Alumni batch or generation. */
  batch: string
  /** Additional notes about participants. */
  participantsNote: string
  /** Contact phone number. */
  phone: string
  /** LINE ID for contact. */
  lineId: string
  /** Number of adult participants. */
  adults: number
  /** Number of children (7-15 years). */
  children: number
  /** Number of toddlers (under 7 years). */
  toddlers: number
  /** Total fee in THB. */
  total: number
}

/** Theme mode for the local page UI. */
type ThemeMode = 'dark' | 'light'

/** Supported UI languages. */
type Language = 'th' | 'en'

/**
 * Generic shape for language-specific phrase collections.
 * Using a flexible record keeps the implementation simple in this single file.
 */
type LanguageStrings = Record<string, any>

/** Adult ticket price in THB. */
const ADULT_PRICE = PRICING.ADULT_PRICE
/** Child ticket price in THB. */
const CHILD_PRICE = PRICING.CHILD_PRICE

/**
 * List of organization options for the registration form.
 */
const ORGANIZATIONS: string[] = [
  'ศูนย์การแพทย์ มหาวิทยาลัยวลัยลักษณ์',
  'สหกรณ์',
  'สำนักวิชาการจัดการ',
  'สำนักวิชาครุศาสตร์และศิลปศาสตร์',
  'สำนักวิชาศิลปศาสตร์',
  'สำนักวิชาครุศาสตร์',
  'สำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์',
  'สำนักวิชาพหุภาษาและการศึกษาทั่วไป',
  'สำนักวิชาการบัญชีและการเงิน',
  'สำนักวิชานิติศาสตร์',
  'สำนักวิชาพยาบาลศาสตร์',
  'สำนักวิชาสหเวชศาสตร์',
  'สำนักวิชาแพทยศาสตร์',
  'สำนักวิชเภสัชศาสตร์',
  'สำนักวิชาสาธารณสุขศาสตร์',
  'สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร',
  'สำนักวิชาวิทยาศาสตร์',
  'สำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี',
  'สำนักวิชาสารสนเทศศาสตร์',
  'สำนักวิชาสถาปัตยกรรมศาสตร์และการออกแบบ',
  'สถาบันส่งเสริมการวิจัยและนวัตกรรมสู่ความเป็นเลิศ',
  'บัณฑิตวิทยาลัยมหาวิทยาลัยวลัยลักษณ์',
  'วิทยาลัยทันตแพทยศาสตร์นานาชาติ',
  'วิทยาลัยสัตวแพทยศาสตร์อัครราชกุมารี',
  'วิทยาลัยนานาชาติ',
  'สำนักงานสภามหาวิทยาลัย',
  'สำนักอธิการบดี',
  'หน่วยตรวจสอบภายใน',
  'ส่วนการเงินและบัญชี',
  'ส่วนทรัพยากรมนุษย์และองค์กร',
  'ส่วนส่งเสริมและพัฒนานักศึกษา',
  'ส่วนสื่อสารองค์กร',
  'ส่วนแผนงานและยุทธศาสตร์',
  'ส่วนพัสดุ',
  'ศูนย์กิจการนานาชาติ',
  'ส่วนอำนวยการและสารบรรณ',
  'ศูนย์ความเป็นเลิศการเรียนการสอน',
  'ส่วนอาคารสถานที่',
  'ส่วนนิติการ',
  'ศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี',
  'ศูนย์เทคโนโลยีดิจิทัล',
  'ศูนย์บรรณสารและสื่อการศึกษา',
  'ศูนย์บริการการศึกษา',
  'ศูนย์บริการวิชาการ',
  'ศูนย์ส่งเสริมวัฒนธรรมและการกีฬา',
  'ศูนย์สมาร์ทฟาร์มและภูมิสถาปัตย์',
  'ศูนย์สหกิจศึกษาและพัฒนาอาชีพ',
  'ศูนย์บริหารทรัพย์สิน',
  'อุทยานวิทยาศาสตร์และเทคโนโลยี',
  'ส่วนบริการกลาง',
  'อุทยานพฤกษศาสตร์',
]

/**
 * Initial empty registration state used when the form loads.
 */
const emptyRegistrationState: RegistrationState = {
  fullName: '',
  organization: '',
  batch: '',
  participantsNote: '',
  phone: '',
  lineId: '',
  adults: 0,
  children: 0,
  toddlers: 0,
  total: 0,
}

/**
 * Localized text resources for Thai and English interfaces.
 */
const TEXTS: Record<Language, LanguageStrings> = {
  th: {
    header: {
      organization: 'Walailak University Muslim Alumni Association',
      title: 'ทีมวูม่า นครศรีฯรวมตัว!',
      subtitle: '“IFTAR PARTY WUMA NAKHON SI THAMMARAT”',
      description:
        'ขอเรียนเชิญพี่น้องมาร่วมกิจกรรมอิฟฎอรในเดือนรอมฎอน ประจำปี ฮิจเราะห์ศักราช 1447',
      dateLabel: 'วันจัดงาน',
      dateValue: 'จันทร์ที่ 16 มีนาคม 2569',
      timeLabel: 'เวลา',
      timeValue: '17.00 น. เป็นต้นไป',
      placeLabel: 'สถานที่',
      placeValue: 'ร้านซีไซด์ซีฟู้ด แอนด์ คาเฟ่',
    },
    languageToggle: {
      label: 'ภาษา',
      th: 'ไทย',
      en: 'อังกฤษ',
    },
    themeToggle: {
      dark: 'โหมดมืด',
      light: 'โหมดสว่าง',
    },
    steps: {
      labels: {
        step1: 'ข้อมูลผู้ลงทะเบียน',
        step2: 'ชำระเงิน',
        step3: 'สรุปและยืนยัน',
      },
      step1: {
        title: 'ขั้นตอนที่ 1: กรอกข้อมูลลงทะเบียน',
        subtitle:
          'กรุณากรอกข้อมูลให้ครบถ้วน แล้วกด "บันทึกข้อมูลและไปขั้นตอนที่ 2" เพื่อไปยังหน้าชำระเงิน',
        fullName: 'ชื่อ-สกุล',
        fullNamePlaceholder: 'เช่น นายอาลี วูม่า',
        organization: 'หน่วยงานที่สังกัด',
        organizationPlaceholder: 'พิมพ์หรือเลือกจากรายการ',
        batch: 'ศิษย์เก่ารุ่นที่',
        batchPlaceholder: 'เช่น รุ่นที่ 10',
        participantsNote: 'ผู้เข้าร่วม',
        participantsNotePlaceholder: '',
        phone: 'เบอร์ติดต่อ',
        phonePlaceholder: 'เช่น 08x-xxx-xxxx',
        lineId: 'LINE ID',
        linePlaceholder: 'เช่น @wuma-alumni',
        attendeesTitle: 'จำนวนผู้เข้าร่วม',
        adultsLabel: 'ผู้ใหญ่',
        adultsHintPrefix: 'ผู้ใหญ่ (คนละ',
        childrenLabel: 'เด็ก 7-15 ปี',
        childrenHintPrefix: 'เด็ก 7-15 ปี (คนละ',
        toddlersLabel: 'เด็กเล็กต่ำกว่า 7 ขวบ (เข้าฟรี)',
        toddlersHint:
          '* เด็กเล็กอายุต่ำกว่า 7 ขวบไม่คิดค่าลงทะเบียน แต่ช่วยกรอกจำนวนเพื่อใช้ในการเตรียมอาหาร',
      },
      step2: {
        title: 'ขั้นตอนที่ 2: ชำระเงิน',
        subtitle:
          'กรุณาสแกน QR เพื่อชำระเงินตามยอดที่แสดงด้านล่าง และแนบสลิปก่อนดำเนินการไปขั้นตอนถัดไป',
        qrTitle: 'สแกนชำระเงินได้ที่',
        qrAlt: 'QR พร้อมเพย์สำหรับชำระเงินค่าลงทะเบียนงาน Iftar Party',
        qrNote:
          'หลังจากสแกนและชำระเงินแล้ว กรุณาแนบสลิปในขั้นตอนนี้ก่อนกดไปต่อ',
        qrDownloadButton: 'ดาวน์โหลดภาพ QR Code',
        qrFallback: 'หากภาพ QR ไม่แสดง กรุณากดปุ่มดาวน์โหลดด้านล่าง',
        attachTitle: 'แนบสลิปการโอน',
        attachChosen: 'ไฟล์ที่เลือก',
        attachInfo: '',
        summaryTitle: 'สรุปค่าลงทะเบียน',
        adultRowLabel: 'ผู้ใหญ่',
        childRowLabel: 'เด็ก 7-15 ปี',
        toddlerRowLabel: 'เด็กเล็กต่ำกว่า 7 ขวบ (เข้าฟรี)',
        totalLabel: 'ยอดรวมที่ต้องชำระ',
        footerNote:
          'กรุณาตรวจสอบยอดชำระและแนบสลิปให้เรียบร้อยก่อนไปยังหน้าสรุปและยืนยัน',
        paidButton: 'ชำระเงินแล้ว / แนบสลิป',
        slipError: 'กรุณาแนบไฟล์สลิปก่อนดำเนินการต่อ',
      },
      step3: {
        title: 'ขั้นตอนที่ 3: สรุปและยืนยัน',
        subtitle:
          'โปรดตรวจสอบความถูกต้องของข้อมูลด้านล่าง หากครบถ้วนแล้วให้กด "ยืนยันการลงทะเบียน"',
        registrantTitle: 'ข้อมูลผู้ลงทะเบียน',
        paymentTitle: 'สรุปจำนวนและการชำระเงิน',
        nameLabel: 'ชื่อ-สกุล',
        orgLabel: 'หน่วยงาน',
        batchLabel: 'ศิษย์เก่ารุ่นที่',
        noteLabel: 'ผู้เข้าร่วม / หมายเหตุ',
        phoneLabel: 'เบอร์ติดต่อ',
        lineLabel: 'LINE ID',
        adultsLabel: 'ผู้ใหญ่',
        childrenLabel: 'เด็ก 7-15 ปี',
        toddlersLabel: 'เด็กเล็กต่ำกว่า 7 ขวบ',
        totalLabel: 'ยอดรวมที่ต้องชำระ',
        paymentStatusLabel: 'สถานะการชำระเงิน',
        slipLabel: 'ไฟล์สลิป',
        paymentPaid: 'ชำระเงินแล้ว (แนบสลิปในขั้นตอนที่ 2)',
        paymentPending: 'ยังไม่แนบสลิป / รอชำระ',
        slipNone: '-',
        slipUnnamed: 'ชำระแล้วแต่ไม่ระบุชื่อไฟล์',
        confirmButton: 'ยืนยันการลงทะเบียน',
        confirmedButton: 'ยืนยันแล้ว',
        joinLineButton: 'เข้าร่วมไลน์ ศิษย์เก่า มวล นครศรีฯ',
        confirmedNote:
          'ระบบบันทึกการยืนยันของคุณเรียบร้อยแล้ว ขอบคุณที่ร่วมงาน "IFTAR PARTY WUMA NAKHON SI THAMMARAT"',
      },
    },
    errors: {
      missingRegistration: 'ไม่พบข้อมูลการลงทะเบียน กรุณากรอกข้อมูลในขั้นตอนที่ 1 ใหม่อีกครั้ง',
    },
    buttons: {
      submitStep1: 'บันทึกข้อมูลและไปขั้นตอนที่ 2',
      backToStep1: 'แก้ไขข้อมูล',
      backToStep2: 'แก้ไขข้อมูล',
    },
    common: {
      peopleSuffix: 'คน',
      currencySuffix: 'บาท',
    },
  },
  en: {
    header: {
      organization: 'Walailak University Muslim Alumni Association',
      title: 'WUMA Nakhon Si Thammarat Gathering!',
      subtitle: '“IFTAR PARTY WUMA NAKHON SI THAMMARAT”',
      description:
        'You are warmly invited to our Iftar gathering in the month of Ramadan, Hijri year 1447.',
      dateLabel: 'Date',
      dateValue: 'Monday, 16 March 2026',
      timeLabel: 'Time',
      timeValue: 'From 17:00 onwards',
      placeLabel: 'Venue',
      placeValue: 'Seaside Seafood &amp; Cafe',
    },
    languageToggle: {
      label: 'Language',
      th: 'Thai',
      en: 'English',
    },
    themeToggle: {
      dark: 'Dark mode',
      light: 'Light mode',
    },
    steps: {
      labels: {
        step1: 'Registrant details',
        step2: 'Payment',
        step3: 'Summary &amp; confirm',
      },
      step1: {
        title: 'Step 1: Registration details',
        subtitle:
          'Please fill in all required information, then click "Save and go to Step 2" to continue to the payment page.',
        fullName: 'Full name',
        fullNamePlaceholder: 'e.g. Mr. Ali WUMA',
        organization: 'Organization / Unit',
        organizationPlaceholder: 'Type or select from the list',
        batch: 'Alumni batch',
        batchPlaceholder: 'e.g. Batch 10',
        participantsNote: 'Participants',
        participantsNotePlaceholder: '',
        phone: 'Phone number',
        phonePlaceholder: 'e.g. 08x-xxx-xxxx',
        lineId: 'LINE ID',
        linePlaceholder: 'e.g. @wuma-alumni',
        attendeesTitle: 'Number of participants',
        adultsLabel: 'Adults',
        adultsHintPrefix: 'Adults (',
        childrenLabel: 'Children 7-15 yrs',
        childrenHintPrefix: 'Children 7-15 yrs (',
        toddlersLabel: 'Children under 7 yrs (free)',
        toddlersHint:
          '* Children under 7 years are free, but please fill in the number to help us prepare food.',
      },
      step2: {
        title: 'Step 2: Payment',
        subtitle:
          'Please scan the QR code, complete the payment, and attach the slip before continuing to the next step.',
        qrTitle: 'Scan to pay',
        qrAlt: 'QR code for paying the Iftar Party registration fee',
        qrNote:
          'After payment, please attach your payment slip here before continuing.',
        qrDownloadButton: 'Download QR code image',
        qrFallback: 'If the QR image does not appear, please use the download button below.',
        attachTitle: 'Attach payment slip',
        attachChosen: 'Selected file',
        attachInfo: '',
        summaryTitle: 'Fee summary',
        adultRowLabel: 'Adults',
        childRowLabel: 'Children 7-15 yrs',
        toddlerRowLabel: 'Children under 7 yrs (free)',
        totalLabel: 'Total amount due',
        footerNote:
          'Please review the total and attach the payment slip before moving to the confirmation step.',
        paidButton: 'Paid / Attach slip',
        slipError: 'Please attach a payment slip before continuing.',
      },
      step3: {
        title: 'Step 3: Summary &amp; confirmation',
        subtitle:
          'Please review all information carefully. If everything is correct, click "Confirm registration".',
        registrantTitle: 'Registrant information',
        paymentTitle: 'Participants &amp; payment',
        nameLabel: 'Full name',
        orgLabel: 'Organization',
        batchLabel: 'Alumni batch',
        noteLabel: 'Participants / note',
        phoneLabel: 'Phone number',
        lineLabel: 'LINE ID',
        adultsLabel: 'Adults',
        childrenLabel: 'Children 7-15 yrs',
        toddlersLabel: 'Children under 7 yrs',
        totalLabel: 'Total amount due',
        paymentStatusLabel: 'Payment status',
        slipLabel: 'Slip file',
        paymentPaid: 'Paid (slip attached in Step 2)',
        paymentPending: 'Pending / no slip attached',
        slipNone: '-',
        slipUnnamed: 'Paid but file name not provided',
        confirmButton: 'Confirm registration',
        confirmedButton: 'Confirmed',
        joinLineButton: 'Join the WU alumni LINE group',
        confirmedNote:
          'Your confirmation has been recorded. Thank you for joining the "IFTAR PARTY WUMA NAKHON SI THAMMARAT".',
      },
    },
    errors: {
      missingRegistration:
        'Registration data not found. Please fill in the form again in Step 1.',
    },
    buttons: {
      submitStep1: 'Save and go to Step 2',
      backToStep1: 'Edit information',
      backToStep2: 'Edit information',
    },
    common: {
      peopleSuffix: 'people',
      currencySuffix: 'THB',
    },
  },
}

/**
 * Formats a number into Thai locale currency-like string (no symbol).
 * @param amount - Raw amount to format.
 * @returns Formatted string.
 */
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('th-TH', { minimumFractionDigits: 0 })
}

/**
 * Returns Tailwind utility classes for the page background according to theme.
 * @param theme - Current theme mode.
 */
const getPageBackgroundClass = (theme: ThemeMode): string => {
  if (theme === 'dark') {
    return 'bg-black text-zinc-50'
  }
  return 'bg-[#fdf7e9] text-zinc-900'
}

/**
 * Returns class names for the main content card according to theme.
 * @param theme - Current theme mode.
 */
const getMainCardClass = (theme: ThemeMode): string => {
  if (theme === 'dark') {
    return 'rounded-2xl border border-[#FDB40F] bg-black/95 shadow-2xl shadow-black/50'
  }
  return 'rounded-2xl border border-[#e5cf95] bg-white/95 shadow-[0_18px_45px_rgba(0,0,0,0.12)]'
}

/**
 * Props for the step 1 form component.
 */
interface Step1FormProps {
  /** Initial values when entering the step (used when going back/forward). */
  initialData: RegistrationState
  /** Callback when step 1 has been completed. */
  onSubmit: (data: RegistrationState) => void
  /** Current language. */
  language: Language
  /** Localized strings. */
  texts: LanguageStrings
  /** Current theme mode. */
  theme: ThemeMode
}

/**
 * Props for the payment step (step 2).
 */
interface Step2PaymentProps {
  /** Latest registration data from step 1. */
  registration: RegistrationState | null
  /** Callback when user has paid and attached a slip. */
  onPaidWithSlip: (fileName: string | null, fileData?: string | null, fileMimeType?: string | null) => void
  /** Callback when user wants to go back to step 1. */
  onBack: () => void
  /** Current language. */
  language: Language
  /** Localized strings. */
  texts: LanguageStrings
  /** Current theme mode. */
  theme: ThemeMode
}

/**
 * Props for the summary step (step 3).
 */
interface Step3SummaryProps {
  /** Final registration data to display. */
  registration: RegistrationState | null
  /** Whether the user indicated they already paid. */
  hasPaid: boolean
  /** File name of the attached payment slip, if any. */
  slipFileName: string | null
  /** Whether the user has already confirmed the registration. */
  isConfirmed: boolean
  /** Whether the form is currently submitting. */
  isSubmitting: boolean
  /** Error message if submission failed. */
  submitError: string | null
  /** Callback when user confirms the registration. */
  onConfirm: () => void
  /** Callback when user wants to go back to step 2. */
  onBack: () => void
  /** Current language. */
  language: Language
  /** Localized strings. */
  texts: LanguageStrings
  /** Current theme mode. */
  theme: ThemeMode
}

/**
 * Props for a summary row component.
 */
interface SummaryRowProps {
  /** Label text shown on the left. */
  label: string
  /** Value text shown on the right. */
  value: string
  /** Whether the row is visually highlighted. */
  highlight?: boolean
}

/**
 * Props for the stepper component.
 */
interface StepperProps {
  /** Current wizard step. */
  currentStep: 1 | 2 | 3
  /** Localized strings. */
  texts: LanguageStrings
  /** Current theme mode. */
  theme: ThemeMode
}

/**
 * Props for the language toggle component.
 */
interface LanguageToggleProps {
  /** Current language. */
  language: Language
  /** Callback when the language changes. */
  onChange: (lang: Language) => void
  /** Localized strings. */
  texts: LanguageStrings
}

/**
 * Props for the theme toggle component.
 */
interface ThemeToggleProps {
  /** Current theme mode. */
  theme: ThemeMode
  /** Callback when the theme changes. */
  onChange: (theme: ThemeMode) => void
  /** Localized strings. */
  texts: LanguageStrings
}

/**
 * HomePage component renders the multi-step layout for the Iftar Party registration,
 * including theme and language toggles.
 */
const HomePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [registration, setRegistration] = useState<RegistrationState | null>(null)
  const [hasPaid, setHasPaid] = useState(false)
  const [slipFileName, setSlipFileName] = useState<string | null>(null)
  const [slipFileData, setSlipFileData] = useState<string | null>(null)
  const [slipFileMimeType, setSlipFileMimeType] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [language, setLanguage] = useState<Language>('th')

  const texts = TEXTS[language]

  /**
   * Handles submission of step 1: calculates total and stores data, then moves to step 2.
   * @param data - Completed registration data from step 1.
   */
  const handleStep1Submit = (data: RegistrationState): void => {
    setRegistration(data)
    setCurrentStep(2)
    setHasPaid(false)
    setSlipFileName(null)
    setSlipFileData(null)
    setSlipFileMimeType(null)
    setIsConfirmed(false)
    setSubmitError(null)
  }

  /**
   * Handles flow when the user indicates they have paid and attached a slip.
   * @param fileName - Name of the slip file chosen by the user.
   * @param fileData - Base64 encoded file data.
   * @param fileMimeType - MIME type of the file.
   */
  const handlePaidWithSlip = (fileName: string | null, fileData?: string | null, fileMimeType?: string | null): void => {
    setHasPaid(true)
    setSlipFileName(fileName)
    setSlipFileData(fileData || null)
    setSlipFileMimeType(fileMimeType || null)
    setCurrentStep(3)
  }

  /**
   * Handles flow when the user wants to continue registration without payment slip.
   */
  const handleBackToStep1 = (): void => {
    setCurrentStep(1)
  }

  const handleBackToStep2 = (): void => {
    setCurrentStep(2)
  }

  /**
   * Submits registration data to Google Apps Script and marks as confirmed.
   */
  const handleConfirm = async (): Promise<void> => {
    if (!registration) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload: any = {
        fullName: registration.fullName,
        organization: registration.organization,
        batch: registration.batch,
        participantsNote: registration.participantsNote,
        phone: registration.phone,
        lineId: registration.lineId,
        adults: registration.adults,
        children: registration.children,
        toddlers: registration.toddlers,
        total: registration.total,
        timestamp: new Date().toISOString(),
      }

      // Only include slip when we actually have a file.
      if (slipFileData && slipFileName) {
        payload.slip = {
          base64: slipFileData,
          fileName: slipFileName,
          contentType: slipFileMimeType,
        }
      }

      // Try with CORS first (if Apps Script is properly configured)
      try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          mode: 'cors',
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.slipError || result.message || 'ส่งข้อมูลไม่สำเร็จ')
        }

        setIsConfirmed(true)
      } catch (corsError) {
        // If CORS fails, try with no-cors mode as fallback
        console.log('CORS failed, trying no-cors mode:', corsError)
        
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })

        // With no-cors mode, we assume success if no error is thrown
        setIsConfirmed(true)
      }
    } catch (error) {
      setSubmitError('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ')
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      className={clsx(
        'min-h-screen flex justify-center overflow-x-hidden px-4 py-6 transition-colors duration-300 md:px-6 md:py-8',
        getPageBackgroundClass(theme),
      )}
    >
      <div className="relative w-full max-w-[560px] space-y-6 md:max-w-[760px] lg:max-w-[980px]">
        <BackgroundPattern theme={theme} />

        {/* Top Header Bar with Icon Toggles */}
        <TopHeaderBar
          theme={theme}
          language={language}
          onLanguageChange={setLanguage}
          onThemeChange={setTheme}
        />

        <EventHeader
          theme={theme}
          language={language}
          texts={texts}
        />

        <Stepper currentStep={currentStep} texts={texts} theme={theme} />

        <div className={clsx(getMainCardClass(theme), 'px-4 py-5 md:px-6 md:py-6')}>
          {currentStep === 1 && (
            <Step1Form
              initialData={registration ?? emptyRegistrationState}
              onSubmit={handleStep1Submit}
              language={language}
              texts={texts}
              theme={theme}
            />
          )}

          {currentStep === 2 && (
            <Step2Payment
              registration={registration}
              onPaidWithSlip={handlePaidWithSlip}
              onBack={handleBackToStep1}
              language={language}
              texts={texts}
              theme={theme}
            />
          )}

          {currentStep === 3 && (
            <Step3Summary
              registration={registration}
              hasPaid={hasPaid}
              slipFileName={slipFileName}
              isConfirmed={isConfirmed}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onConfirm={handleConfirm}
              onBack={handleBackToStep2}
              language={language}
              texts={texts}
              theme={theme}
            />
          )}
        </div>
      </div>
    </main>
  )
}

/**
 * BackgroundPattern component renders a subtle geometric pattern inspired by Islamic motifs.
 */
const BackgroundPattern: React.FC<{ theme: ThemeMode }> = ({ theme }) => {
  const opacity = theme === 'dark' ? 'opacity-20' : 'opacity-30'
  const color =
    theme === 'dark'
      ? '[background-image:radial-gradient(circle_at_1px_1px,#FDB40F_1px,transparent_0)]'
      : '[background-image:radial-gradient(circle_at_1px_1px,#e5cf95_1px,transparent_0)]'

  return (
    <>
      {/* Top left corner pattern */}
      <div
        className={clsx(
          'pointer-events-none absolute top-0 left-0 w-1/3 h-1/3 -z-10',
          opacity,
          color,
          '[background-size:26px_26px]',
        )}
      />
      {/* Top right corner pattern */}
      <div
        className={clsx(
          'pointer-events-none absolute top-0 right-0 w-1/3 h-1/3 -z-10',
          opacity,
          color,
          '[background-size:26px_26px]',
        )}
      />
    </>
  )
}

/**
 * TopHeaderBar component with icon toggles for theme and language at the top right.
 */
const TopHeaderBar: React.FC<{
  theme: ThemeMode
  language: Language
  onLanguageChange: (lang: Language) => void
  onThemeChange: (theme: ThemeMode) => void
}> = ({ theme, language, onLanguageChange, onThemeChange }) => {
  const isDark = theme === 'dark'
  const pillClass = isDark
    ? 'border-[#f0ba25] bg-[#0b0b0b] text-[#FDB40F] shadow-[0_0_26px_rgba(253,180,15,0.18)]'
    : 'border-[#d8c27d] bg-[#f7f0dc] text-[#8b6a12] shadow-none'
  const controlButtonClass = isDark
    ? 'border-[#f0ba25] bg-[#0b0b0b] text-[#FDB40F] shadow-[0_0_30px_rgba(253,180,15,0.28)] hover:bg-[#181818]'
    : 'border-[#d8c27d] bg-[#fbf6e8] text-[#8b6a12] shadow-none hover:bg-[#f4ecd7]'
  const controlIconClass = isDark
    ? 'border-[#f0ba25]/40 bg-[#1f1f1f]'
    : 'border-[#d8c27d] bg-[#fffaf0]'

  return (
    <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
      <div
        className={clsx(
          'inline-flex min-h-11 max-w-[190px] items-center rounded-full border px-4 py-2 text-[0.82rem] font-semibold uppercase leading-tight tracking-[0.24em] sm:max-w-none sm:text-[0.95rem]',
          pillClass,
        )}
      >
        WUMA IFTAR 1447
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onLanguageChange(language === 'th' ? 'en' : 'th')}
          className={clsx(
            'flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors sm:h-12 sm:gap-3 sm:px-5',
            controlButtonClass,
          )}
          title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
        >
          <span
            className={clsx(
              'flex h-7 w-7 items-center justify-center rounded-full border',
              controlIconClass,
            )}
          >
            <Globe size={16} />
          </span>
          <span className="uppercase tracking-[0.2em]">{language === 'th' ? 'TH' : 'EN'}</span>
        </button>

        <button
          type="button"
          onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
          className={clsx(
            'flex h-11 w-11 items-center justify-center rounded-full border transition-colors sm:h-12 sm:w-12',
            controlButtonClass,
          )}
          title={isDark ? 'โหมดสว่าง' : 'โหมดมืด'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  )
}

/**
 * EventHeader component shows event title and information.
 */
const EventHeader: React.FC<{
  theme: ThemeMode
  language: Language
  texts: LanguageStrings
}> = ({ theme, language, texts }) => {
  const isDark = theme === 'dark'
  const infoCardClass = clsx(
    'rounded-2xl border px-4 py-3 md:px-5 md:py-4',
    isDark
      ? 'border-[#9a6d00] bg-[#050505] shadow-[inset_0_0_0_1px_rgba(253,180,15,0.05)]'
      : 'border-[#e4cf91] bg-[#fffdf7]'
  )

  return (
    <header
      className={clsx(
        'rounded-[28px] px-4 py-5 shadow-xl md:rounded-[32px] md:px-6 md:py-7',
        isDark
          ? 'border border-[#9a6d00] bg-[linear-gradient(180deg,#0b0b0b_0%,#070707_100%)] shadow-[0_20px_50px_rgba(0,0,0,0.55)]'
          : 'border border-[#e5cf95] bg-gradient-to-r from-[#fffaf0] via-[#fff6e2] to-[#fffaf0] shadow-[0_16px_40px_rgba(0,0,0,0.18)]',
      )}
    >
      <div className="space-y-4 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-8 lg:space-y-0">
        <div className="space-y-4">
        <p className="max-w-[430px] text-[0.72rem] font-semibold tracking-[0.2em] text-[#FDB40F] uppercase sm:text-sm md:text-[1.05rem]">
          {texts.header.organization}
        </p>
        <h1 className={clsx(
          'text-[1.55rem] font-black leading-[0.95] sm:text-[1.9rem] md:text-[3rem]',
          isDark ? 'text-[#fff6d7]' : 'text-zinc-900',
        )}>
          {texts.header.title}
        </h1>
        <p className={clsx(
          'text-base font-bold leading-tight sm:text-lg md:text-[1.1rem]',
          isDark ? 'text-[#FDB40F]' : 'text-[#8B6914]'
        )}>
          {texts.header.subtitle}
        </p>
        <p
          className={clsx(
            'max-w-[460px] text-[0.92rem] leading-relaxed md:text-base',
            isDark ? 'text-zinc-100' : 'text-zinc-800',
          )}
        >
          {texts.header.description}
        </p>
        </div>

        <div className="space-y-3 pt-1 lg:pt-0">
          <div className={infoCardClass}>
            <p className="mb-1 text-[0.82rem] font-semibold text-[#FDB40F] md:text-sm">{texts.header.dateLabel}</p>
            <p className={clsx('text-[1.05rem] font-extrabold leading-tight sm:text-[1.25rem] md:text-xl', isDark ? 'text-white' : 'text-zinc-900')}>
              {texts.header.dateValue}
            </p>
          </div>
          <div className={infoCardClass}>
            <p className="mb-1 text-[0.82rem] font-semibold text-[#FDB40F] md:text-sm">{texts.header.timeLabel}</p>
            <p className={clsx('text-[1.05rem] font-extrabold leading-tight sm:text-[1.25rem] md:text-xl', isDark ? 'text-white' : 'text-zinc-900')}>
              {texts.header.timeValue}
            </p>
            <div className="mt-2">
              <button
                onClick={() => {
                  const event = {
                    title: 'IFTAR PARTY WUMA NAKHON SI THAMMARAT',
                    start: '20260316T170000',
                    end: '20260316T210000',
                    location: 'Seaside Seafood & Cafe, Thasala',
                    description: 'WUMA Iftar Gathering 1447 - Walailak University Muslim Alumni Association'
                  }
                  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`
                  window.open(googleCalendarUrl, '_blank')
                }}
                className={clsx(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  isDark
                    ? 'bg-[#FDB40F] text-black hover:bg-[#FDB40F]/90'
                    : 'bg-[#8b6a12] text-white hover:bg-[#8b6a12]/90'
                )}
              >
                <span>เพิ่มลงปฏิทิน</span>
              </button>
            </div>
          </div>
          <div className={infoCardClass}>
            <p className="mb-1 text-[0.82rem] font-semibold text-[#FDB40F] md:text-sm">{texts.header.placeLabel}</p>
            <p className={clsx('text-[1.05rem] font-extrabold leading-tight sm:text-[1.25rem] md:text-xl', isDark ? 'text-white' : 'text-zinc-900')}>
              {texts.header.placeValue}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="https://www.facebook.com/seasideseafoodthasala"
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  isDark
                    ? 'bg-[#FDB40F] text-black hover:bg-[#FDB40F]/90'
                    : 'bg-[#8b6a12] text-white hover:bg-[#8b6a12]/90'
                )}
              >
                <span>Facebook</span>
              </a>
              <a
                href="https://maps.app.goo.gl/uvAG2SYH7hVezPUN6"
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  isDark
                    ? 'bg-[#FDB40F] text-black hover:bg-[#FDB40F]/90'
                    : 'bg-[#8b6a12] text-white hover:bg-[#8b6a12]/90'
                )}
              >
                <span>Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * LanguageToggle allows switching between Thai and English text.
 */
const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onChange,
  texts,
}) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[#FDB40F]/60 bg-black/10 px-1 py-1 text-[11px] backdrop-blur-sm">
      <span className="px-2 text-[10px] font-medium text-[#FDB40F]">
        {texts.languageToggle.label}
      </span>
      <button
        type="button"
        onClick={() => onChange('th')}
        className={clsx(
          'rounded-full px-2 py-0.5 text-[11px] font-semibold transition',
          language === 'th'
            ? 'bg-[#FDB40F] text-black shadow-sm shadow-amber-500/40'
            : 'text-[#FDB40F]/80 hover:bg-[#FDB40F]/15',
        )}
      >
        {texts.languageToggle.th}
      </button>
      <button
        type="button"
        onClick={() => onChange('en')}
        className={clsx(
          'rounded-full px-2 py-0.5 text-[11px] font-semibold transition',
          language === 'en'
            ? 'bg-[#FDB40F] text-black shadow-sm shadow-amber-500/40'
            : 'text-[#FDB40F]/80 hover:bg-[#FDB40F]/15',
        )}
      >
        {texts.languageToggle.en}
      </button>
    </div>
  )
}

/**
 * ThemeToggle allows switching between dark and light visual styles.
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onChange, texts }) => {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={() => onChange(isDark ? 'light' : 'dark')}
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition',
        isDark
          ? 'border-[#FDB40F]/70 bg-black/40 text-[#FDB40F] hover:bg-black/60'
          : 'border-[#d7bd6b] bg-white/70 text-[#8b6a12] hover:bg-white',
      )}
    >
      <span
        className={clsx(
          'inline-block h-3 w-3 rounded-full',
          isDark ? 'bg-[#FDB40F]' : 'bg-[#1a1a1a]',
        )}
      />
      <span>{isDark ? texts.themeToggle.dark : texts.themeToggle.light}</span>
    </button>
  )
}

/**
 * Stepper component displays the three-step progress indicator.
 */
const Stepper: React.FC<StepperProps> = ({ currentStep, texts, theme }) => {
  const steps: Array<{ id: 1 | 2 | 3; label: string }> = [
    { id: 1, label: texts.steps.labels.step1 },
    { id: 2, label: texts.steps.labels.step2 },
    { id: 3, label: texts.steps.labels.step3 },
  ]

  const isDark = theme === 'dark'

  return (
    <nav aria-label="ขั้นตอนการลงทะเบียน">
      <ol
        className={clsx(
          'grid grid-cols-3 gap-2 rounded-[24px] border p-3 text-xs md:gap-3 md:rounded-[28px] md:p-4 md:text-sm',
          isDark
            ? 'border-zinc-800 bg-[linear-gradient(180deg,#111215_0%,#0a0b0d_100%)] shadow-[0_14px_36px_rgba(0,0,0,0.45)]'
            : 'border-[#e5cf95] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.12)]',
        )}
      >
        {steps.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep

          return (
            <li key={step.id} className="min-w-0">
              <div className="flex items-center gap-2 md:gap-3">
                <div
                  className={clsx(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all md:h-10 md:w-10 md:text-base',
                    isActive &&
                    'border-[#FDB40F] bg-[#FDB40F] text-black shadow-[0_0_24px_rgba(253,180,15,0.55)]',
                    !isActive &&
                    isCompleted &&
                    'border-emerald-400 bg-emerald-400 text-black',
                    !isActive &&
                    !isCompleted &&
                    (isDark
                      ? 'border-[#4f5563] bg-[#171923] text-zinc-100'
                      : 'border-[#d3d3d3] bg-white text-zinc-600'),
                  )}
                >
                  {step.id}
                </div>
                <span
                  className={clsx(
                    'min-w-0 whitespace-normal break-words text-[0.68rem] leading-snug sm:text-xs md:text-base',
                    isActive && 'font-semibold text-[#d8dff6]',
                    !isActive &&
                    isCompleted &&
                    (isDark ? 'text-emerald-300' : 'text-emerald-700'),
                    !isActive &&
                    !isCompleted &&
                    (isDark ? 'text-[#a9b0c3]' : 'text-zinc-600'),
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Step1Form component collects attendee information and calculates the total fee on submit.
 */
const Step1Form: React.FC<Step1FormProps> = ({
  initialData,
  onSubmit,
  language,
  texts,
  theme,
}) => {
  const [fullName, setFullName] = useState(initialData.fullName)
  const [organization, setOrganization] = useState(initialData.organization)
  const [batch, setBatch] = useState(initialData.batch)
  const [participantsNote, setParticipantsNote] = useState(initialData.participantsNote)
  const [phone, setPhone] = useState(initialData.phone)
  const [lineId, setLineId] = useState(initialData.lineId)
  const [adults, setAdults] = useState(initialData.adults)
  const [children, setChildren] = useState(initialData.children)
  const [toddlers, setToddlers] = useState(initialData.toddlers)

  // Auto-compute participantsNote from attendee counts
  useEffect(() => {
    const total = adults + children + toddlers
    setParticipantsNote(total > 0 ? String(total) : '')
  }, [adults, children, toddlers])

  const isDark = theme === 'dark'

  const total = adults * ADULT_PRICE + children * CHILD_PRICE
  const autoParticipantHint = language === 'th'
    ? 'เลือกจำนวนด้านล่างได้เลย ระบบจะรวมจำนวนผู้เข้าร่วมให้อัตโนมัติ'
    : 'Select attendee counts below. The participant total will update automatically.'

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const data: RegistrationState = {
      fullName,
      organization,
      batch,
      participantsNote,
      phone,
      lineId,
      adults,
      children,
      toddlers,
      total,
    }
    onSubmit(data)
  }

  const baseInputClass = clsx(
    'w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors',
    isDark
      ? 'border-[#FDB40F] bg-black/60 text-white focus:border-[#FFD700] focus:ring-[#FFD700] placeholder-zinc-400'
      : 'border-[#D4AF37] bg-white text-black focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder-zinc-500',
  )

  const counterButtonClass = clsx(
    'flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold transition-colors',
    isDark
      ? 'bg-[#FDB40F] text-black hover:bg-[#FFD700]'
      : 'bg-[#FDB40F] text-black hover:bg-[#FFD700]'
  )

  const counterValueClass = clsx(
    'flex items-center justify-center w-16 h-10 text-lg font-bold',
    isDark ? 'text-white' : 'text-black'
  )

  const Counter = ({ value, onChange, label, price, freeLabel }: { value: number; onChange: (v: number) => void; label: string; price?: number; freeLabel?: string }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-[#FDB40F]">{label}</span>
        {price !== undefined && (
          <span className={clsx('text-xs', isDark ? 'text-zinc-300' : 'text-zinc-600')}>
            {language === 'th' ? `คนละ ${price.toLocaleString()} บาท` : `${price} THB per person`}
          </span>
        )}
        {freeLabel && (
          <span className={clsx('text-xs', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
            {freeLabel}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className={counterButtonClass}
        >
          -
        </button>
        <span className={counterValueClass}>{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className={counterButtonClass}
        >
          +
        </button>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#FDB40F]">
          {texts.steps.step1.title}
        </h2>
        <p className={clsx('text-xs', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
          {texts.steps.step1.subtitle}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_360px] lg:items-start">
        {/* Left Column - Form Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#FDB40F]">
              {texts.steps.step1.fullName}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={baseInputClass}
              placeholder={texts.steps.step1.fullNamePlaceholder}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#FDB40F]">
              {texts.steps.step1.organization}
            </label>
            <input
              type="text"
              list="organization-options"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className={baseInputClass}
              placeholder={texts.steps.step1.organizationPlaceholder}
            />
            <datalist id="organization-options">
              {ORGANIZATIONS.map((org) => (
                <option key={org} value={org} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#FDB40F]">
              {texts.steps.step1.batch}
            </label>
            <input
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className={baseInputClass}
              placeholder={texts.steps.step1.batchPlaceholder}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#FDB40F]">
              {texts.steps.step1.phone}
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                setPhone(value)
              }}
              className={baseInputClass}
              placeholder="0812345678"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#FDB40F]">
              {texts.steps.step1.lineId}
            </label>
            <input
              type="text"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              className={baseInputClass}
              placeholder={texts.steps.step1.linePlaceholder}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#FDB40F]">
              {texts.steps.step1.participantsNote}
            </label>
            <p className={clsx('text-[11px] leading-relaxed', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
              {autoParticipantHint}
            </p>
            <input
              type="number"
              inputMode="numeric"
              readOnly
              value={participantsNote}
              className={clsx(baseInputClass, 'cursor-not-allowed opacity-80')}
              placeholder="0"
            />
          </div>
        </div>

        {/* Right Column - Attendees Counter */}
        <div className={clsx(
          'rounded-xl border p-5 space-y-4 h-fit lg:sticky lg:top-6',
          isDark
            ? 'border-[#FDB40F]/50 bg-black/80'
            : 'border-[#e5cf95] bg-[#fffaf0]/80',
        )}>
          <h3 className="text-base font-semibold text-[#FDB40F]">
            {texts.steps.step1.attendeesTitle}
          </h3>

          <div className="space-y-2">
            <Counter
              label={language === 'th' ? 'ผู้ใหญ่' : 'Adults'}
              value={adults}
              onChange={setAdults}
              price={ADULT_PRICE}
            />
            <div className="border-t border-[#FDB40F]/20" />
            <Counter
              label={language === 'th' ? 'เด็ก 7-15 ปี' : 'Children 7-15 yrs'}
              value={children}
              onChange={setChildren}
              price={CHILD_PRICE}
            />
            <div className="border-t border-[#FDB40F]/20" />
            <Counter
              label={language === 'th' ? 'เด็กเล็กต่ำกว่า 7 ขวบ' : 'Toddlers under 7 yrs'}
              freeLabel={language === 'th' ? '(เข้าฟรี)' : '(free)'}
              value={toddlers}
              onChange={setToddlers}
            />
          </div>

          <div className="border-t border-[#FDB40F]/30 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className={clsx('text-sm font-bold', isDark ? 'text-white' : 'text-black')}>
                {language === 'th' ? 'ยอดรวมที่ต้องชำระ' : 'Total amount due'}
              </span>
              <span className="text-xl font-bold text-[#FDB40F]">
                {formatCurrency(total)} {language === 'th' ? 'บาท' : 'THB'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-full bg-[#FDB40F] px-6 py-3 text-sm font-semibold text-black shadow-md shadow-amber-500/40 transition hover:bg-[#FFD700] hover:shadow-lg hover:shadow-amber-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB40F] focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
          >
            {texts.buttons.submitStep1}
          </button>
        </div>
      </div>
    </form>
  )
}

/**
 * Step2Payment component displays QR payment information and the calculated fee.
 */
const Step2Payment: React.FC<Step2PaymentProps> = ({
  registration,
  onPaidWithSlip,
  onBack,
  language,
  texts,
  theme,
}) => {
  const [localSlipFileName, setLocalSlipFileName] = useState<string | null>(null)
  const [localSlipFileData, setLocalSlipFileData] = useState<string | null>(null)
  const [localSlipMimeType, setLocalSlipMimeType] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isQrImageError, setIsQrImageError] = useState(false)
  const isDark = theme === 'dark'

  if (!registration) {
    return (
      <div
        className={clsx(
          'text-sm',
          isDark ? 'text-zinc-300' : 'text-zinc-700',
        )}
      >
        {texts.errors.missingRegistration}
      </div>
    )
  }

  const adultLine =
    language === 'th'
      ? `${registration.adults} ${texts.common.peopleSuffix} (รวม ${formatCurrency(
        registration.adults * ADULT_PRICE,
      )} ${texts.common.currencySuffix})`
      : `${registration.adults} ${texts.common.peopleSuffix} (total ${formatCurrency(
        registration.adults * ADULT_PRICE,
      )} ${texts.common.currencySuffix})`

  const childLine =
    language === 'th'
      ? `${registration.children} ${texts.common.peopleSuffix} (รวม ${formatCurrency(
        registration.children * CHILD_PRICE,
      )} ${texts.common.currencySuffix})`
      : `${registration.children} ${texts.common.peopleSuffix} (total ${formatCurrency(
        registration.children * CHILD_PRICE,
      )} ${texts.common.currencySuffix})`

  const toddlerLine = `${registration.toddlers} ${texts.common.peopleSuffix}`
  const totalText = `${formatCurrency(registration.total)} ${texts.common.currencySuffix}`

  /**
   * Handles file selection for the slip input.
   * Converts file to base64 for upload to Google Drive.
   * @param event - Native input change event.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      setLocalSlipFileName(file.name)
      setLocalSlipMimeType(file.type)
      setError(null)

      // แปลงไฟล์เป็น base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        // ลบ prefix "data:image/jpeg;base64," ออก เก็บเฉพาะข้อมูล base64 ล้วน
        const base64Data = base64String.split(',')[1]
        setLocalSlipFileData(base64Data)
      }
      reader.onerror = () => {
        setError('Error reading file')
        setLocalSlipFileData(null)
      }
      reader.readAsDataURL(file)
    } else {
      setLocalSlipFileName(null)
      setLocalSlipFileData(null)
      setLocalSlipMimeType(null)
    }
  }

  /**
   * Handles clicking the "paid with slip" button.
   * Requires a slip file to be selected first.
   */
  const handlePaidClick = (): void => {
    if (!localSlipFileName || !localSlipFileData) {
      setError(texts.steps.step2.slipError)
      return
    }
    onPaidWithSlip(localSlipFileName, localSlipFileData, localSlipMimeType)
  }

  const leftCardClass = clsx(
    'flex flex-col items-center gap-3 rounded-2xl border px-4 py-3',
    isDark
      ? 'border-[#FDB40F]/70 bg-black/80'
      : 'border-[#e5cf95] bg-[#fffaf0]',
  )

  const rightCardClass = clsx(
    'space-y-3 rounded-xl border px-4 py-3 text-xs',
    isDark
      ? 'border-[#FDB40F]/50 bg-black/80'
      : 'border-[#e5cf95] bg-[#fffaf0]/80',
  )

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#FDB40F]">
          {texts.steps.step2.title}
        </h2>
        <p
          className={clsx(
            'text-xs',
            isDark ? 'text-zinc-300' : 'text-zinc-700',
          )}
        >
          {texts.steps.step2.subtitle}
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(320px,0.98fr)_minmax(300px,0.82fr)]">
        <div className="space-y-4">
          <div className={leftCardClass}>
            <p className="text-xs font-semibold text-[#FDB40F]">
              {texts.steps.step2.qrTitle}
            </p>
            {!isQrImageError ? (
              <img
                src={QR_CODE_IMAGE_URL}
                alt={texts.steps.step2.qrAlt}
                className="w-full max-w-xs rounded-lg bg-white p-2 object-cover"
                onError={() => setIsQrImageError(true)}
              />
            ) : (
              <div className="flex w-full max-w-xs flex-col items-center justify-center rounded-lg border border-dashed border-[#FDB40F]/50 bg-white/70 px-4 py-10 text-center">
                <p className="text-sm font-semibold text-[#8B6914]">QR Code unavailable</p>
                <p className="mt-2 text-[11px] text-zinc-600">{texts.steps.step2.qrFallback}</p>
              </div>
            )}
            <a
              href={QR_CODE_IMAGE_URL}
              download="iftar-wuma-qr-code.png"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[#d3b96a] bg-white px-4 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-[#fff6df]"
            >
              {texts.steps.step2.qrDownloadButton}
            </a>
            <p
              className={clsx(
                'text-center text-[11px]',
                isDark ? 'text-zinc-300' : 'text-zinc-700',
              )}
            >
              {texts.steps.step2.qrNote}
            </p>
          </div>

          <div className={rightCardClass}>
            <p className="text-[11px] font-semibold text-[#FDB40F]">
              {texts.steps.step2.attachTitle}
            </p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className={clsx(
                'block w-full text-[11px]',
                isDark ? 'text-zinc-200' : 'text-zinc-800',
                'file:mr-3 file:rounded-md file:border-0 file:bg-[#FDB40F] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-[#FFD700]',
              )}
            />
            {localSlipFileName && (
              <p
                className={clsx(
                  'text-[11px]',
                  isDark ? 'text-emerald-300' : 'text-emerald-700',
                )}
              >
                {texts.steps.step2.attachChosen}:{' '}
                <span className="font-medium">{localSlipFileName}</span>
              </p>
            )}
            <p
              className={clsx(
                'text-[11px]',
                isDark ? 'text-zinc-400' : 'text-zinc-600',
              )}
            >
              {texts.steps.step2.attachInfo}
            </p>
            {error && (
              <p className="text-[11px] text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className={rightCardClass}>
          <p className="text-[11px] font-semibold text-[#FDB40F]">
            {texts.steps.step2.summaryTitle}
          </p>
          <SummaryRow label={texts.steps.step2.adultRowLabel} value={adultLine} highlight={false} theme={theme} />
          <SummaryRow label={texts.steps.step2.childRowLabel} value={childLine} highlight={false} theme={theme} />
          <SummaryRow label={texts.steps.step2.toddlerRowLabel} value={toddlerLine} highlight={false} theme={theme} />
          <div className="mt-1 border-t border-[#FDB40F]/30 pt-2">
            <SummaryRow
              label={texts.steps.step2.totalLabel}
              value={totalText}
              highlight
              theme={theme}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-1 lg:flex-row lg:items-end lg:justify-between">
        <p
          className={clsx(
            'max-w-[420px] text-[11px] leading-relaxed',
            isDark ? 'text-zinc-400' : 'text-zinc-600',
          )}
        >
          {texts.steps.step2.footerNote}
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end sm:items-center lg:max-w-[430px]">
          <button
            type="button"
            onClick={onBack}
            className={clsx(
              'inline-flex items-center justify-center rounded-full border px-5 py-2 text-xs font-medium transition',
              isDark
                ? 'border-zinc-600 bg-black text-zinc-100 hover:bg-zinc-900'
                : 'border-[#d3b96a] bg-white text-zinc-800 hover:bg-[#fff6df]',
            )}
          >
            {texts.buttons.backToStep1}
          </button>
          <button
            type="button"
            onClick={handlePaidClick}
            className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
          >
            {texts.steps.step2.paidButton}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Step3Summary component shows all collected data and allows final confirmation.
 */
const Step3Summary: React.FC<Step3SummaryProps> = ({
  registration,
  hasPaid,
  slipFileName,
  isConfirmed,
  isSubmitting,
  submitError,
  onConfirm,
  onBack,
  language,
  texts,
  theme,
}) => {
  const isDark = theme === 'dark'

  if (!registration) {
    return (
      <div
        className={clsx(
          'text-sm',
          isDark ? 'text-zinc-300' : 'text-zinc-700',
        )}
      >
        {texts.errors.missingRegistration}
      </div>
    )
  }

  const paymentStatus = hasPaid
    ? texts.steps.step3.paymentPaid
    : texts.steps.step3.paymentPending

  const registrantCardClass = clsx(
    'space-y-3 rounded-xl border px-4 py-3 text-xs',
    isDark
      ? 'border-[#FDB40F]/50 bg-black/80'
      : 'border-[#e5cf95] bg-[#fffaf0]/80',
  )

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#FDB40F]">
          {texts.steps.step3.title}
        </h2>
        <p
          className={clsx(
            'text-xs',
            isDark ? 'text-zinc-300' : 'text-zinc-700',
          )}
        >
          {texts.steps.step3.subtitle}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className={registrantCardClass}>
          <p className="text-[11px] font-semibold text-[#FDB40F]">
            {texts.steps.step3.registrantTitle}
          </p>
          <SummaryRow
            label={texts.steps.step3.nameLabel}
            value={registration.fullName || '-'}
            theme={theme}
          />
          <SummaryRow
            label={texts.steps.step3.orgLabel}
            value={registration.organization || '-'}
            theme={theme}
          />
          <SummaryRow
            label={texts.steps.step3.batchLabel}
            value={registration.batch || '-'}
            theme={theme}
          />
          <SummaryRow
            label={texts.steps.step3.noteLabel}
            value={registration.participantsNote || '-'}
            theme={theme}
          />
          <SummaryRow
            label={texts.steps.step3.phoneLabel}
            value={registration.phone || '-'}
            theme={theme}
          />
          <SummaryRow
            label={texts.steps.step3.lineLabel}
            value={registration.lineId || '-'}
            theme={theme}
          />
        </div>

        <div className={registrantCardClass}>
          <p className="text-[11px] font-semibold text-[#FDB40F]">
            {texts.steps.step3.paymentTitle}
          </p>
          <SummaryRow
            label={texts.steps.step3.adultsLabel}
            value={`${registration.adults} ${texts.common.peopleSuffix}`}
            theme={theme}
          />
          <SummaryRow
            label={texts.steps.step3.childrenLabel}
            value={`${registration.children} ${texts.common.peopleSuffix}`}
            theme={theme}
          />
          <SummaryRow
            label={texts.steps.step3.toddlersLabel}
            value={`${registration.toddlers} ${texts.common.peopleSuffix}`}
            theme={theme}
          />
          <div className="mt-1 border-t border-[#FDB40F]/30 pt-2">
            <SummaryRow
              label={texts.steps.step3.totalLabel}
              value={`${formatCurrency(registration.total)} ${texts.common.currencySuffix}`}
              highlight
              theme={theme}
            />
          </div>
          <SummaryRow
            label={texts.steps.step3.paymentStatusLabel}
            value={paymentStatus}
            theme={theme}
          />
          <SummaryRow
            label={texts.steps.step3.slipLabel}
            value={
              slipFileName
                ? slipFileName
                : hasPaid
                  ? texts.steps.step3.slipUnnamed
                  : texts.steps.step3.slipNone
            }
            theme={theme}
          />
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {submitError && (
          <p className="text-xs text-red-400 bg-red-900/20 border border-red-400/30 rounded-lg px-3 py-2">
            Error: {submitError}
          </p>
        )}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:items-center">
          <button
            type="button"
            onClick={onBack}
            className={clsx(
              'inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-semibold transition',
              isDark
                ? 'border-zinc-600 bg-black text-zinc-100 hover:bg-zinc-900'
                : 'border-[#d3b96a] bg-white text-zinc-800 hover:bg-[#fff6df]',
            )}
          >
            {texts.buttons.backToStep2}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirmed || isSubmitting}
            className={clsx(
              'inline-flex items-center justify-center rounded-full px-8 py-2.5 text-sm font-semibold shadow-md shadow-amber-500/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB40F] focus-visible:ring-offset-2 focus-visible:ring-offset-black/60',
              isConfirmed || isSubmitting
                ? 'cursor-not-allowed bg-[#F5D27A]/70 text-zinc-800'
                : 'bg-[#FDB40F] text-black hover:bg-[#FFD700] hover:shadow-lg hover:shadow-amber-500/60',
            )}
          >
            {isSubmitting
              ? 'กำลังส่งข้อมูล...'
              : isConfirmed
                ? texts.steps.step3.confirmedButton
                : texts.steps.step3.confirmButton}
          </button>
          <a
            href="https://line.me/ti/g/HqQNRyMHNW"
            target="_blank"
            rel="noreferrer"
            className={clsx(
              'inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-semibold transition',
              isDark
                ? 'border-[#36C95F] bg-[#0f2b16] text-[#8ef0a7] hover:bg-[#15381d]'
                : 'border-[#36C95F] bg-[#effbf2] text-[#177b32] hover:bg-[#e2f8e8]',
            )}
          >
            {texts.steps.step3.joinLineButton}
          </a>
        </div>
        {isConfirmed && (
          <p
            className={clsx(
              'text-xs',
              isDark ? 'text-emerald-300' : 'text-emerald-700',
            )}
          >
            {texts.steps.step3.confirmedNote}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * SummaryRow component renders a single labeled row in summary boxes.
 */
const SummaryRow: React.FC<SummaryRowProps & { theme: ThemeMode }> = ({
  label,
  value,
  highlight,
  theme,
}) => {
  const isDark = theme === 'dark'
  return (
    <div className="flex items-center justify-between gap-2">
      <span
        className={clsx(
          'text-[11px] md:text-xs',
          highlight
            ? isDark ? 'font-semibold text-white' : 'font-semibold text-black'
            : isDark
              ? 'text-zinc-300'
              : 'text-zinc-700',
        )}
      >
        {label}
      </span>
      <span
        className={clsx(
          'text-[11px] md:text-xs',
          highlight
            ? 'font-bold text-[#FDB40F]'
            : isDark
              ? 'font-medium text-zinc-100'
              : 'font-medium text-zinc-800',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export default HomePage
