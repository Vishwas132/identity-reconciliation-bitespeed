import { Router } from 'express';
import {
  deleteAllContacts,
  reconcileContacts,
} from '../services/contactReconciliation.js';
import { createResponseBody } from '../utils/utils.js';

export const contactController = Router();

contactController.post('/identify', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ error: 'Either email or phoneNumber must be provided' });
    }

    const reconciledContacts = await reconcileContacts(email, phoneNumber);
    const response = createResponseBody(reconciledContacts);

    return res.status(200).json(response);
  } catch (error) {
    console.log('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

contactController.delete('/all', async (req, res) => {
  try {
    await deleteAllContacts();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
