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

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = 'FormResponses';
    var sheet = ss.getSheetByName(sheetName) || ss.getActiveSheet();

    var now = new Date();

    // Handle optional slip upload
    var slipUrl = '';
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
        var blob = Utilities.newBlob(decodedBytes, contentType, data.slip.fileName);

        // Create file in the configured folder
        var folder = DriveApp.getFolderById(SLIP_FOLDER_ID);
        
        // Add timestamp to filename to make it unique
        var timestamp = new Date().getTime();
        var uniqueFileName = timestamp + '_' + data.slip.fileName;
        
        var file = folder.createFile(blob);
        file.setName(uniqueFileName);
        
        // Set sharing so anyone with the link can view
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        // Public URL (depends on folder/file sharing settings)
        slipUrl = file.getUrl();
      }
    } catch (slipError) {
      // Do not block registration if slip upload fails; log the error instead.
      Logger.log('Slip upload error: ' + slipError);
      slipUrl = '';
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

    return createResponse({ success: true, slipUrl: slipUrl });
  } catch (error) {
    Logger.log('doPost error: ' + error);
    return createResponse({ success: false, message: 'Server error' });
  }
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
