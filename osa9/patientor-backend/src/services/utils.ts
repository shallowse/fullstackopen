/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { v4 as uuidv4 } from 'uuid';
import {
  NewPatient,
  Gender,
  Entry,
  EntryType,
  BaseEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalEntry,
  HealthCheckRating,
} from '../types';

import diagnoses from '../../data/diagnoses';

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
};

const parseString = (fieldName: string, text: any): string => {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing "${fieldName}"`);
  }
  return text;
};

const parseDob = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing "dateOfBirth"');
  }
  return date;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing "gender"');
  }

  return gender;
};

export const toNewPatient = (object: any): NewPatient => {
  const newEntry: NewPatient = {
    name: parseString('name', object.name),
    dateOfBirth: parseDob(object.dateOfBirth),
    ssn: parseString('ssn', object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString('occupation', object.occupation),
    entries: [],
  };

  return newEntry;
};

//
// Validations for POST /api/patients/:id/entry
//
const validateBaseEntry = (entry: BaseEntry): void => {
  // date: string;
  if (!entry.date || !isString(entry.date) || !isDate(entry.date)) {
    throw new Error('Incorrect or missing date');
  }

  // specialist: string;
  if (!entry.specialist || !isString(entry.specialist)) {
    throw new Error('Incorrect or missing specialist');
  }

  // diagnosisCodes?: Array<Diagnose['code']>
  if (entry.diagnosisCodes && entry.diagnosisCodes.length === 0) {
    throw new Error('Incorrect - empty diagnosisCodes received');
  }

  if (entry.diagnosisCodes) {
    for (let i = 0; i < entry.diagnosisCodes.length; i++) {
      let found = false;
      for (let j = 0; j < diagnoses.length; j++) {
        if (entry.diagnosisCodes[i] === diagnoses[j].code) {
          found = true;
          break;
        }
      }
      if (found === false) {
        throw new Error(`Incorrect diagnosisCode received: ${entry.diagnosisCodes[i]}`);
      }
    }
  }

  // description: string;
  if (!entry.description || !isString(entry.description)) {
    throw new Error('Incorrect or missing description');
  }
};

const validateEntryHealthCheck = (entry: HealthCheckEntry): void => {
  // BaseEntry
  validateBaseEntry(entry);

  // healthCheckRating: HealthCheckRating;
  const ratings = Object.values(HealthCheckRating);
  if (!ratings.includes(entry.healthCheckRating)) {
    throw new Error(`Incorrect or missing healthCheckRating: ${entry.healthCheckRating}`);
  }
};

const validateEntryHospital = (entry: HospitalEntry): void => {
  // BaseEntry
  validateBaseEntry(entry);

  // discharge: { date: string; criteria: string;}
  if (!entry.discharge || Object.keys(entry.discharge).length === 0) {
    throw new Error('Missing discharge');
  }

  if (!entry.discharge.date || !isString(entry.discharge.date) || !isDate(entry.discharge.date)) {
    throw new Error('Incorrect or missing discharge.date');
  }

  if (!entry.discharge.criteria || !isString(entry.discharge.criteria)) {
    throw new Error('Incorrect or missing discharge.criteria');
  }
};

const validateOccupationalHealthcare = (entry: OccupationalHealthcareEntry): void => {
  // BaseEntry
  validateBaseEntry(entry);

  // employerName: string;
  if (!entry.employerName || !isString(entry.employerName)) {
    throw new Error('Incorrect or missing employerName');
  }

  // sickLeave?: { startDate: string; endDate: string; }
  if (entry.sickLeave) {
    if (!entry.sickLeave.startDate || !isString(entry.sickLeave.startDate) || !isDate(entry.sickLeave.startDate)) {
      throw new Error('Incorrect or missing sickLeave.startDate');
    }

    if (!entry.sickLeave.endDate || !isString(entry.sickLeave.endDate) || !isDate(entry.sickLeave.endDate)) {
      throw new Error('Incorrect or missing sickLeave.endDate');
    }
  }
};

const validateEntry = (object: Entry): void => {
  switch (object.type) {
    case EntryType.HealthCheck:
      validateEntryHealthCheck(object);
      break;
    case EntryType.Hospital:
      validateEntryHospital(object);
      break;
    case EntryType.OccupationalHealthcare:
      validateOccupationalHealthcare(object);
      break;
    default:
      throw new Error('Incorrect or missing \'type\' for entry');
  }
};

export const addEntryToPatient = (object: Entry): Entry => {
  if (!object || Object.keys(object).length === 0) {
    throw new Error('Missing entry');
  }

  try {
    validateEntry(object);
  } catch (error) {
    throw new Error(`Validation failed for entry data: ${String(error.message)}`);
  }

  // Motivation to add this: the user may have submitted some extra fields in req.body
  // so let's select only the right fields to the entry object
  switch (object.type) {
    case EntryType.HealthCheck:
      return {
        id: uuidv4(),
        date: object.date,
        specialist: object.specialist,
        diagnosisCodes: object.diagnosisCodes || [],
        description: object.description,
        type: object.type,
        healthCheckRating: object.healthCheckRating,
      };
    case EntryType.Hospital:
      return {
        id: uuidv4(),
        date: object.date,
        specialist: object.specialist,
        diagnosisCodes: object.diagnosisCodes || [],
        description: object.description,
        type: object.type,
        discharge: object.discharge || {},
      };
    case EntryType.OccupationalHealthcare:
      return {
        id: uuidv4(),
        date: object.date,
        specialist: object.specialist,
        diagnosisCodes: object.diagnosisCodes || [],
        description: object.description,
        type: object.type,
        employerName: object.employerName,
        sickLeave: object.sickLeave || { startDate: '', endDate: ''},
      };
    default:
      throw new Error('Oops, Incorrect or missing \'type\' for entry');
  }
};
