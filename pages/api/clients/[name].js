// pages/api/clients/[name].js
import { getServerSession } from 'next-auth';
import { getAllClients, updateClient } from '../../../lib/services/sheetsService';

export default async function handler(req, res) {
  const session = await getServerSession(req, res);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { name } = req.query;
  const clientName = decodeURIComponent(name);

  if (req.method === 'GET') {
    const clients = await getAllClients();
    const client = clients.find(c => c.clientName === clientName);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    return res.status(200).json(client);
  }

  if (req.method === 'PUT') {
    try {
      await updateClient(clientName, req.body);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating client:', error);
      return res.status(500).json({ error: 'Failed to update client' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
