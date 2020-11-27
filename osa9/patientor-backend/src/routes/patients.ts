/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// ^ caused by accessing error.message (https://nodejs.org/api/errors.html#errors_new_error_message)
import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  try {
    const patient = patientService.getPatient(req.params.id);
    res.json(patient);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', (req, res) => {
  try {
    const patient = patientService.addPatient(req.body);
    res.json(patient);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const patient = patientService.addPatientEntry(req.params.id, req.body);
    res.json(patient);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
