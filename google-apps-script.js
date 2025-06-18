/**
 * Google Apps Script for Optimus KSA Coming Soon Form with UTM Tracking
 * This script receives form submissions and adds them to the Google Sheet with UTM parameters
 * 
 * Instructions:
 * 1. Open Google Apps Script (script.google.com)
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Update the SHEET_ID constant with your actual Google Sheet ID
 * 5. Deploy as a web app with execute permissions for "Anyone"
 * 6. Copy the web app URL and update the GOOGLE_SHEETS_URL in the API route
 */

// Your Google Sheet ID from the URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
const SHEET_ID = '1R8hH8PnOuHIESWEylyu3Lcc-KisTTSVMEzYYhSzlhdY';
const SHEET_NAME = 'Coming Soon Leads'; // You can change this to your preferred sheet name

function doPost(e) {
  try {
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    
    console.log('Received data:', data); // Debug log
    
    // Get the spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Add headers to match the exact Excel structure
      const headers = [
        'S.',
        'Date',
        'Timestamp', 
        'First Name', 
        'Last Name', 
        'Country Code',
        'Phone Number', 
        'Email Address',
        'Nationality',
        'M/F',
        'Certificate',
        'Speciality',
        'Years of Experience',
        'Industry',
        'UTM Source',
        'UTM Medium', 
        'UTM Campaign',
        'UTM Term',
        'UTM Content',
        'Page URL'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format the header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#2B1F4F');
      headerRange.setFontColor('white');
      
      // Auto-resize columns
      sheet.autoResizeColumns(1, headers.length);
    }
    
    // Check for duplicates based on email and phone number
    const lastRow = sheet.getLastRow();
    
    if (lastRow > 1) { // If there are existing data rows
      const dataRange = sheet.getRange(2, 1, lastRow - 1, 20); // Get all data rows (now 20 columns)
      const existingData = dataRange.getValues();
      
      const incomingEmail = (data.email || '').toLowerCase().trim();
      const incomingPhone = (data.phone || '').replace(/\s+/g, ''); // Remove spaces for comparison
      
      // Check each existing row for duplicates
      for (let i = 0; i < existingData.length; i++) {
        const row = existingData[i];
        const existingPhone = (row[6] || '').toString().replace(/\s+/g, ''); // Column 7 (Phone Number)
        const existingEmail = (row[7] || '').toString().toLowerCase().trim(); // Column 8 (Email Address)
        
        // Check for email duplicate
        if (incomingEmail && existingEmail && incomingEmail === existingEmail) {
          console.log('Duplicate email found:', incomingEmail);
          return ContentService
            .createTextOutput(JSON.stringify({ 
              status: 'duplicate', 
              message: 'A user with this email address already exists',
              duplicateType: 'email',
              existingData: {
                serialNumber: row[0],
                name: `${row[3]} ${row[4]}`,
                email: existingEmail,
                phone: existingPhone
              }
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
        
        // Check for phone duplicate
        if (incomingPhone && existingPhone && incomingPhone === existingPhone) {
          console.log('Duplicate phone found:', incomingPhone);
          return ContentService
            .createTextOutput(JSON.stringify({ 
              status: 'duplicate', 
              message: 'A user with this phone number already exists',
              duplicateType: 'phone',
              existingData: {
                serialNumber: row[0],
                name: `${row[3]} ${row[4]}`,
                email: existingEmail,
                phone: existingPhone
              }
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // No duplicates found, proceed with adding the new record
    
    // Calculate the serial number (chronological order starting from 1)
    let serialNumber = 1;
    
    if (lastRow > 1) { // If there are data rows beyond the header
      // Find the highest valid serial number in column A (S.)
      const dataRange = sheet.getRange(2, 1, lastRow - 1, 1);
      const values = dataRange.getValues().flat();
      const serialNumbers = values.filter(val => 
        typeof val === 'number' && 
        val > 0 && 
        val < 10000 && 
        !isNaN(val)
      );
      
      if (serialNumbers.length > 0) {
        serialNumber = Math.max(...serialNumbers) + 1;
      } else {
        // Fallback: count non-empty rows
        const nonEmptyRows = values.filter(val => val !== null && val !== "" && val !== 0).length;
        serialNumber = nonEmptyRows + 1;
      }
    }
    
    // Ensure we have all the required data fields
    const firstName = data.firstName || '';
    const lastName = data.lastName || '';
    const countryCode = data.countryCode || '';
    const phone = data.phone || '';
    const email = data.email || '';
    const gender = data.gender || '';
    const certificate = data.certificate || '';
    const dateField = data.date || '';
    const timestampField = data.timestamp || '';
    
    // Prepare the row data matching the exact Excel structure (20 columns)
    const rowData = [
      serialNumber,                    // 1. S. (chronological serial number)
      dateField,                       // 2. Date (MM/DD/YYYY)
      timestampField,                  // 3. Timestamp (HH:MM:SS AM/PM)
      firstName,                       // 4. First Name
      lastName,                        // 5. Last Name
      countryCode,                     // 6. Country Code (e.g., +966)
      phone,                           // 7. Phone Number (without country code)
      email,                           // 8. Email Address
      '',                              // 9. Nationality (empty for now)
      gender,                          // 10. M/F
      certificate,                     // 11. Certificate (from dropdown)
      '',                              // 12. Speciality (empty for now)
      '',                              // 13. Years of Experience (empty for now)
      '',                              // 14. Industry (empty for now)
      data.utm_source || '',           // 15. UTM Source
      data.utm_medium || '',           // 16. UTM Medium
      data.utm_campaign || '',         // 17. UTM Campaign
      data.utm_term || '',             // 18. UTM Term
      data.utm_content || '',          // 19. UTM Content
      data.page_url || ''              // 20. Page URL
    ];
    
    console.log('Prepared row data:', rowData); // Debug log
    console.log('Row data length:', rowData.length); // Debug log
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns to fit content (20 columns)
    sheet.autoResizeColumns(1, 20);
    
    // Log the successful submission for debugging
    console.log('Data added successfully with serial number:', serialNumber);
    console.log('Certificate value:', certificate);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Data added successfully with UTM tracking',
        serialNumber: serialNumber,
        rowLength: rowData.length,
        certificate: certificate
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error
    console.error('Error in doPost:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString(),
        receivedData: e.postData ? e.postData.contents : 'No data received'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'success', 
      message: 'Google Apps Script is working!' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify the script works with UTM parameters
 * You can run this from the Apps Script editor to test
 */
function testScript() {
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+966501234567',
    email: 'john.doe@example.com',
    gender: 'male',
    timestamp: new Date().toISOString(),
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'mba_launch',
    utm_term: 'online mba saudi',
    utm_content: 'text_ad_1',
    page_url: 'https://yourdomain.com/coming-soon?utm_source=google&utm_medium=cpc&utm_campaign=mba_launch'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
} 