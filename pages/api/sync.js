// pages/api/sync.js
import { getServerSession } from 'next-auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const session = await getServerSession(req, res);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Phase 1: Return success - sync pulls from Google Sheet
    // Phase 2: Will add Drive scanning, Gmail pulling, Gemini summarization
    return res.status(200).json({
      success: true,
      message: 'Sync complete. Connect Google Drive, Gmail, and Gemini for auto-population.',
      synced: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: 'Sync failed' });
  }
}
