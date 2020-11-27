import { v4 as uuidv4 } from 'uuid';
import patientData from '../../data/patients';
import { toNewPatient, addEntryToPatient } from './utils';
import { Patient, NewPatient, PublicPatient, Entry } from '../types';

let patients: Patient[] = patientData;

const getNonSensitiveEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findPatient = (id: string): Patient  => {
  const patient: Patient | undefined = patients.find(p => p.id === id);
  if (!patient) {
    throw new Error('incorrect or missing patient');
  }
  return patient;
};

const getPatient = (id: string): Patient => {
  const patient = findPatient(id);

  return {
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    ssn: patient.ssn,
    gender: patient.gender,
    occupation: patient.occupation,
    entries: patient.entries,
  };
};

const addPatient = (patient: NewPatient): Patient => {
  const validatedPatient = toNewPatient(patient);
  const id = uuidv4();
  const newPatient = {
    id,
    ...validatedPatient,
  };
  //console.log(newPatient);
  patients.push(newPatient);
  return newPatient;
};

// 1. fetch patient
// 2. validate provided entry data
// 3. update patient and patients list
// 4. return patient
const addPatientEntry = (id: string, patientEntry: Entry): Patient => {
  // 1.
  const patient = findPatient(id);

  // 2.
  const validatedEntry = addEntryToPatient(patientEntry);

  // 3.
  patient.entries.push(validatedEntry);
  patients = patients.map(p => p.id !== patient.id ? p : patient);

  // 4.
  return patient;
};

export default {
  getNonSensitiveEntries,
  getPatient,
  addPatient,
  addPatientEntry,
};
