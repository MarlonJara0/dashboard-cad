import { google } from 'googleapis';

// Configure Google Sheets API
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SHEET_ID = 'AKfycbyy802PCnvZqg5-i2nznzUXhJsgIMUNPLqLu6PBF1-kFyyOjQFDWx7A_gjs64uN5Fc';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzyS3-1SOWjt0CaG8oV-MFhcpKhxp3XEyvgNfQaCW0yvfWBpGW4U_qeXqcH45USXKKp/exec';

export interface SheetData {
  over30Data: {
    month: string;
    target: number;
    actual: number;
  }[];
  over90Data: {
    month: string;
    target: number;
    actual: number;
  }[];
  performanceData: {
    customer: string;
    amount: string;
    status: string;
    daysOverdue: string;
  }[];
}

export async function fetchSheetData(): Promise<SheetData> {
  try {
    console.log('Starting fetch request to:', SCRIPT_URL);
    
    const response = await fetch(SCRIPT_URL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'omit'
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Fetched data:', data);
    
    // Validate the data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response: Expected an object but got ' + typeof data);
    }
    
    if (!data.over30Data || !Array.isArray(data.over30Data)) {
      throw new Error('Missing or invalid over30Data array');
    }
    
    return {
      over30Data: data.over30Data,
      over90Data: data.over90Data || [],
      performanceData: data.performanceData || []
    };
  } catch (error: any) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
} 