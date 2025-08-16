// background.js

console.log('LinkedIn to Sheets - Background vFinal');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'exportToSheets') {
        exportToSheets(request.data)
            .then(result => sendResponse({ success: true, result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Indicates async response
    }
});

async function exportToSheets(data) {
    if (!data || data.length === 0) {
        throw new Error('No data to export.');
    }
    const token = await getAuthToken();
    const spreadsheetId = await createSpreadsheet(token);
    await addData(spreadsheetId, token, data);
    await formatSheet(spreadsheetId, token);

    return {
        url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
        rowsAdded: data.length,
    };
}

function getAuthToken() {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError || !token) {
                return reject(new Error('Could not get auth token. ' + chrome.runtime.lastError?.message));
            }
            resolve(token);
        });
    });
}

async function createSpreadsheet(token) {
    const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            properties: { title: `LinkedIn Saved Posts - ${new Date().toLocaleString()}` },
        }),
    });
    if (!res.ok) throw new Error('Failed to create spreadsheet.');
    const { spreadsheetId } = await res.json();
    return spreadsheetId;
}

async function addData(spreadsheetId, token, data) {
    const headers = ['Author', 'Content', 'Timestamp', 'URL'];
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // CORRECTED: The property names now match the extracted data.
    const rows = data.map(p => [p.actorName, p.postText, p.timestamp, p.postUrl]);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [headers, ...rows] }),
    });

    const responseText = await res.text();
    if (!res.ok) {
        console.error('Google Sheets API Error:', responseText);
        throw new Error('Failed to add data to sheet.');
    }
}

async function formatSheet(spreadsheetId, token) {
    const requests = [
        { repeatCell: { range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 }, cell: { userEnteredFormat: { textFormat: { bold: true } } }, fields: 'userEnteredFormat.textFormat.bold' } },
        { updateSheetProperties: { properties: { sheetId: 0, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } }
    ];
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
    });
}