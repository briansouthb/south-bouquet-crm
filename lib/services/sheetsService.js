// lib/services/sheetsService.js
import { google } from 'googleapis';

const HEADERS = [
  'Client Name', 'Industry', 'Location', 'Contact Person', 'Contact Email',
  'Spouse/Partner', 'Start Date', 'Engagement Type', 'Monthly Revenue',
  'Accounting Method', 'Key Systems', 'Relationship Stage', 'Financial Health',
  'Current Initiatives', 'Past Initiatives', 'Key Goals', 'Notes',
  'Drive Folder Link', 'Last Synced', 'Email Summary', 'Auto Filled Fields'
];

function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: (process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '').replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth;
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

export async function getAllClients() {
  const sheets = getSheets();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Clients!A1:U100',
    });

    const rows = response.data.values || [];
    if (rows.length <= 1) return [];

    const headers = rows[0];
    return rows.slice(1).map(row => {
      const client = {};
      headers.forEach((header, i) => {
        const key = headerToKey(header);
        client[key] = row[i] || '';
      });
      return client;
    });
  } catch (error) {
    console.error('Error reading sheet:', error);
    return [];
  }
}

export async function updateClient(clientName, data) {
  const sheets = getSheets();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const allClients = await getAllClients();
  const rowIndex = allClients.findIndex(c => c.clientName === clientName);

  if (rowIndex === -1) throw new Error('Client not found');

  const rowNumber = rowIndex + 2; // +1 for header, +1 for 1-indexed
  const values = HEADERS.map(header => {
    const key = headerToKey(header);
    return data[key] !== undefined ? data[key] : '';
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Clients!A${rowNumber}:U${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [values] },
  });

  return { success: true };
}

export async function initializeSheet() {
  const sheets = getSheets();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Clients!A1:U1',
    });

    if (!response.data.values || response.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Clients!A1:U1',
        valueInputOption: 'RAW',
        requestBody: { values: [HEADERS] },
      });
    }
  } catch (error) {
    console.error('Error initializing sheet:', error);
  }
}

function headerToKey(header) {
  return header
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toLowerCase());
}
