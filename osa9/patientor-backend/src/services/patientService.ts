import patientData from '../../data/patients.json';
import { NonSensitivePatientEntry } from '../types';

const getNonSensitiveEntries = (): Array<NonSensitivePatientEntry> => {
  const patients: Array<NonSensitivePatientEntry> = patientData;

  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default {
  getNonSensitiveEntries,
};
