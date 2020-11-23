/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NewPatient, Gender, Entry, EntryType } from '../types';

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

const parseEntries = (entries: Entry[]): Entry[] => {
  if (!entries) {
    throw new Error('Entries missing');
  }

  entries.forEach(entry => {
    const types = Object.values(EntryType);
    if (!types.includes(entry.type)) {
      throw new Error(`Incorrect type: ${entry.type}`);
    }
  });

  return entries;
};

const toNewPatientEntry = (object: any): NewPatient => {
  const newEntry: NewPatient = {
    name: parseString('name', object.name),
    dateOfBirth: parseDob(object.dateOfBirth),
    ssn: parseString('ssn', object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString('occupation', object.occupation),
    entries: parseEntries(object.entries),
  };

  return newEntry;
};

export default toNewPatientEntry;
