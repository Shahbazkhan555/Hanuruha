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

    // --- NEW: AI CHAT PROXY LOGIC ---
    if (data.action === "chat") {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // ⚠️  PASTE YOUR GEMINI API KEY BETWEEN THE QUOTES BELOW
      //     Get one from: https://aistudio.google.com/app/apikey
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      var GEMINI_API_KEY = "PASTE_YOUR_API_KEY_HERE";
      
      // Auto-identify the best available model for your key
      var listUrl = "https://generativelanguage.googleapis.com/v1beta/models?key=" + GEMINI_API_KEY;
      var modelName = "models/gemini-1.5-flash"; // Default fallback

      try {
        var listResponse = UrlFetchApp.fetch(listUrl, { "muteHttpExceptions": true });
        var listJson = JSON.parse(listResponse.getContentText());
        if (listJson.models && listJson.models.length > 0) {
          // Look for 1.5 flash, then 2.0 flash, then pro
          var preferred = ["models/gemini-1.5-flash", "models/gemini-2.0-flash", "models/gemini-pro", "models/gemini-1.0-pro"];
          for (var p = 0; p < preferred.length; p++) {
            if (listJson.models.some(m => m.name === preferred[p])) {
              modelName = preferred[p];
              break;
            }
          }
        }
      } catch (e) {
        Logger.log("List models failed, using default: " + e);
      }

      var url = "https://generativelanguage.googleapis.com/v1beta/" + modelName + ":generateContent?key=" + GEMINI_API_KEY;

      var systemPrompt =
        "You are the compassionate AI Support Assistant for Hanuruha Women's Rehabilitation Centre in Bangalore. " +
        "Your goal is to provide supportive, non-judgmental information to women and their families seeking help for substance abuse or psychiatric disorders.\n\n" +

        "### KEY KNOWLEDGE ###\n" +
        "- **Programs**: De-addiction & Detox (medically supervised), Mental Health & Psychological Support (CBT, Trauma-focused), Residential Rehab (safe, women-only environment), Family Support & Counselling.\n" +
        "- **Facilities**: Clean/peaceful accommodation, A/C & Non-A/C rooms, VIP wards, Nutritious meals, Yoga/Meditation spaces, 24/7 Medical & Emotional support.\n" +
        "- **Locations**: Main Center is in Peenya 3rd Phase, Bangalore. Additional branches in Vijayanagar & Hessaraghatta Road.\n" +
        "- **Legacy**: 25+ years of experience, over 5000+ women helped through Sthree Kendra and Hanuruha.\n\n" +

        "### RESPONSE GUIDELINES ###\n" +
        "1. **Tone**: Warm, professional, and hopeful. Use phrases like 'We are here to help' and 'There is hope for a new beginning.'\n" +
        "2. **Conciseness**: Keep answers under 3-4 sentences. Use bullet points for lists.\n" +
        "3. **Safety Reference**: For any mention of immediate danger, self-harm, or severe withdrawal, provide the 24/7 Helpline: +91 7353 836 666 immediately.\n" +
        "4. **No Medical Advice**: Do NOT prescribe medication or give clinical diagnoses. Always suggest booking a consultation for personalized medical advice.\n" +
        "5. **Call to Action**: Gently encourage booking a free consultation if they are ready to take the next step.\n\n" +

        "Main Emergency Number: +91 7353 836 666\n" +
        "Email: info@hanuruha.in";

      var payload = {
        "contents": [{
          "parts": [{
            "text": "SYSTEM INSTRUCTIONS: " + systemPrompt + "\n\nUSER MESSAGE: " + data.message
          }]
        }],
        "generationConfig": {
          "temperature": 0.5,
          "maxOutputTokens": 400
        }
      };

      var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
      };

      var response = UrlFetchApp.fetch(url, options);
      var json = JSON.parse(response.getContentText());

      var aiMessage = "I'm having trouble connecting. Please call us at +91 7353 836 666.";

      if (json.candidates && json.candidates[0].content && json.candidates[0].content.parts[0].text) {
        aiMessage = json.candidates[0].content.parts[0].text;
      } else if (json.error) {
        // Log the real error and show it in the chat for debugging
        Logger.log("Gemini API Error (" + modelName + "): " + JSON.stringify(json.error));
        aiMessage = "Debug Error (" + modelName + "): " + (json.error.message || JSON.stringify(json.error));
      }

      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", reply: aiMessage }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // --- ORIGINAL: BOOKING LOGIC ---
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
    } catch (mailError) {
      // Email sending is optional, don't fail if it errors
      Logger.log("Email error: " + mailError);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Booking saved successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
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
