/*
 * =============================================
 * HANURUHA - Google Apps Script for Google Sheets
 * =============================================
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Go to https://sheets.google.com and create a new Google Sheet
 * 2. Name it "Hanuruha Consultations"
 * 3. In the first row (header row), add these columns:
 *    A1: Timestamp
 *    B1: Full Name
 *    C1: Phone
 *    D1: Email
 *    E1: Consultation Type
 *    F1: Preferred Date
 *    G1: Message
 * 
 * 4. Go to Extensions → Apps Script
 * 5. Delete any existing code and paste THIS ENTIRE SCRIPT below
 * 6. Click "Deploy" → "New deployment"
 * 7. Select type: "Web app"
 * 8. Set "Execute as": "Me"
 * 9. Set "Who has access": "Anyone"
 * 10. Click "Deploy" and copy the Web App URL
 * 11. Paste that URL into script.js where it says GOOGLE_SCRIPT_URL
 * 
 * That's it! Form submissions will now go to your Google Sheet.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),           // Timestamp
      data.name,            // Full Name
      data.phone,           // Phone Number
      data.email,           // Email
      data.type,            // Consultation Type
      data.date,            // Preferred Date
      data.message          // Message
    ]);
    
    // Send email notification (optional - update the email address)
    try {
      MailApp.sendEmail({
        to: "info@hanuruha.in",
        subject: "New Consultation Booking - " + data.name,
        htmlBody: 
          "<h2>New Consultation Booking</h2>" +
          "<table style='border-collapse:collapse;'>" +
          "<tr><td style='padding:8px;font-weight:bold;'>Name:</td><td style='padding:8px;'>" + data.name + "</td></tr>" +
          "<tr><td style='padding:8px;font-weight:bold;'>Phone:</td><td style='padding:8px;'>" + data.phone + "</td></tr>" +
          "<tr><td style='padding:8px;font-weight:bold;'>Email:</td><td style='padding:8px;'>" + (data.email || "Not provided") + "</td></tr>" +
          "<tr><td style='padding:8px;font-weight:bold;'>Type:</td><td style='padding:8px;'>" + (data.type || "Not selected") + "</td></tr>" +
          "<tr><td style='padding:8px;font-weight:bold;'>Preferred Date:</td><td style='padding:8px;'>" + data.date + "</td></tr>" +
          "<tr><td style='padding:8px;font-weight:bold;'>Message:</td><td style='padding:8px;'>" + (data.message || "None") + "</td></tr>" +
          "</table>"
      });
    } catch(mailError) {
      // Email sending is optional, don't fail if it errors
      Logger.log("Email error: " + mailError);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Booking saved successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Hanuruha Booking API is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}
