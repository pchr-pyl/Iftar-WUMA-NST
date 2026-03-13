/**
 * @file apps-script-iftar-registration.js
 * @description Google Apps Script web app to receive Iftar registration data,
 * append it to a Google Sheet, and optionally save payment slip files to
 * a specific Google Drive folder.
 */

/**
 * Folder ID in Google Drive where payment slip files will be stored.
 * This must match the folder you created for slip uploads.
 *
 * Example Drive URL:
 * https://drive.google.com/drive/folders/1kIy8fhtRd0ItMs7wvdsw7-Zcv7eylTiN
 *
 * Folder ID is the last segment: 1kIy8fhtRd0ItMs7wvdsw7-Zcv7eylTiN
 *
 * IMPORTANT:
 * - Make sure the Apps Script project has permission to access this folder.
 */
var SLIP_FOLDER_ID = '1kIy8fhtRd0ItMs7wvdsw7-Zcv7eylTiN';

/**
 * Spreadsheet ID where form responses will be appended.
 *
 * Spreadsheet URL:
 * https://docs.google.com/spreadsheets/d/1-wVwPNDNLpen639peLrluF9exiD3QFdkH5hNegMtgwM/edit
 */
var SPREADSHEET_ID = '1-wVwPNDNLpen639peLrluF9exiD3QFdkH5hNegMtgwM';

/**
 * Sheet tab name to append rows into.
 * If it does not exist, the script will create it.
 */
var RESPONSES_SHEET_NAME = 'FormResponses';

/**
 * Handles POST requests from the React registration form.
 * Expects JSON body with:
 * fullName, organization, batch, participantsNote, phone, lineId,
 * adults, children, toddlers, total, timestamp,
 * and optional:
 * slip: {
 *   fileName: string,
 *   base64: string,        // Base64-encoded file content
 *   contentType: string    // MIME type, e.g. 'image/png' or 'application/pdf'
 * }
 *
 * The data is appended as a new row in the "FormResponses" sheet.
 * Columns:
 *  A: Timestamp (Server)
 *  B: Full Name
 *  C: Organization
 *  D: Batch
 *  E: Note
 *  F: Phone
 *  G: LINE ID
 *  H: Adults
 *  I: Children
 *  J: Toddlers
 *  K: Total
 *  L: Timestamp (Client)
 *  M: Slip URL (link to file in Drive, if created)
 *
 * @param {GoogleAppsScript.Events.DoPost} e - Incoming HTTP POST event.
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse({ success: false, message: 'No payload' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return createResponse({ success: false, message: 'Invalid JSON' });
    }

    // Use openById so this works reliably even for standalone Apps Script projects.
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(RESPONSES_SHEET_NAME) || ss.insertSheet(RESPONSES_SHEET_NAME);

    var now = new Date();

    // Handle optional slip upload
    var slipUrl = '';
    var slipErrorMessage = '';
    var hasSlipPayload = !!(data.slip && data.slip.base64 && data.slip.fileName);
    try {
      if (
        data.slip &&
        data.slip.base64 &&
        data.slip.fileName
      ) {
        var base64String = String(data.slip.base64);
        var contentType = data.slip.contentType || 'application/octet-stream';

        // Decode base64 content into a blob
        var decodedBytes = Utilities.base64Decode(base64String);

        // Create file in the configured folder
        var folder = DriveApp.getFolderById(SLIP_FOLDER_ID);
        Logger.log('Slip folder found: ' + folder.getName());
        
        // Add timestamp to filename to make it unique
        var timestamp = new Date().getTime();
        var uniqueFileName = timestamp + '_' + data.slip.fileName;
        
        var blob = Utilities.newBlob(decodedBytes, contentType, uniqueFileName);
        var file = folder.createFile(blob);
        Logger.log('Slip file created: ' + file.getId());
        
        // Set sharing so anyone with the link can view
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        // Public URL (depends on folder/file sharing settings)
        slipUrl = file.getUrl();
      }
    } catch (slipError) {
      slipErrorMessage = String(slipError && slipError.message ? slipError.message : slipError);
      Logger.log('Slip upload error: ' + slipErrorMessage);
      slipUrl = '';
    }

    if (hasSlipPayload && !slipUrl) {
      // Log the error but still save the row with empty slip URL
      Logger.log('Slip upload failed, saving row without slip URL: ' + slipErrorMessage);
    }

    // Prepare row values. Adjust order to match your header row.
    var row = [
      now, // Timestamp (Server)
      data.fullName || '',
      data.organization || '',
      data.batch || '',
      data.participantsNote || '',
      data.phone || '',
      data.lineId || '',
      Number(data.adults || 0),
      Number(data.children || 0),
      Number(data.toddlers || 0),
      Number(data.total || 0),
      data.timestamp || '', // Timestamp (Client)
      slipUrl              // Slip URL
    ];

    sheet.appendRow(row);

    return createResponse({ success: true, slipUrl: slipUrl, slipError: slipErrorMessage });
  } catch (error) {
    Logger.log('doPost error: ' + error);
    return createResponse({ success: false, message: 'Server error' });
  }
}

/**
 * Handles GET requests (used for CORS preflight check).
 */
function doGet(e) {
  return createResponse({ status: 'ok' });
}

/**
 * Creates a JSON response for the web app.
 *
 * @param {object} body - Body object to be stringified to JSON.
 * @returns {GoogleAppsScript.Content.TextOutput} JSON text output.
 */
function createResponse(body) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(body));
  return output;
}
