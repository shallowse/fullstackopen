/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// ^ caused by accessing error.message
import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../services/utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientService.addEntry(newPatientEntry);
    res.json(addedEntry);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
