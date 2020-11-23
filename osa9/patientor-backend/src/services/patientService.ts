import { v4 as uuidv4 } from 'uuid';
import patientData from '../../data/patients';
import { Patient, NewPatient, PublicPatient } from '../types';

const patients: Array<Patient> = patientData;

const getNonSensitiveEntries = (): Array<PublicPatient> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (id: string): Patient => {
  const patient: Patient | undefined = patients.find(p => p.id === id);
  if (!patient) {
     throw new Error('Incorrect or missing patient');
  }
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

const addEntry = (entry: NewPatient): Patient => {
  const id = uuidv4();
  const newPatientEntry = {
    id,
    ...entry,
  };
  //console.log(newPatientEntry);
  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getNonSensitiveEntries,
  getPatient,
  addEntry,
};
