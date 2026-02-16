// pages/api/clients.js
import { getServerSession } from 'next-auth';
import { getAllClients } from '../../lib/services/sheetsService';

export default async function handler(req, res) {
  const session = await getServerSession(req, res);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const clients = await getAllClients();
      return res.status(200).json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      return res.status(500).json({ error: 'Failed to fetch clients' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
