import { v4 as uuidv4 } from 'uuid';
import patientData from '../../data/patients';
import { PatientEntry, NewPatientEntry, NonSensitivePatientEntry } from '../types';

const patients: Array<PatientEntry> = patientData;

const getNonSensitiveEntries = (): Array<NonSensitivePatientEntry> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addEntry = (entry: NewPatientEntry): PatientEntry => {
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
  addEntry,
};
