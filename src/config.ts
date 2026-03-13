/**
 * Application configuration
 */

/**
 * Google Apps Script Web App URL
 * 
 * To update this URL:
 * 1. Deploy your Google Apps Script as a Web App
 * 2. Copy the deployment URL
 * 3. Replace the URL below
 * 
 * See GOOGLE_APPS_SCRIPT_SETUP.md for detailed instructions
 */
export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzB1jxw1EBlcuRePgk3RkepDggt9nsEGSq6QZyE9N6KqZQnptktiB7VzQ2WZZ4kGK4S/exec'

/**
 * QR Code image URL for payment
 */
export const QR_CODE_IMAGE_URL = 'https://pub-cdn.sider.ai/u/U07GH245N4A/web-coder/69b18e36ce9201cd12b2b206/resource/332b2ebb-455c-4091-85d0-1491e429b992.png'

/**
 * Pricing configuration
 */
export const PRICING = {
  ADULT_PRICE: 300,
  CHILD_PRICE: 200,
} as const
