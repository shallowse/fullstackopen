export interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male                = 'male',
  Female              = 'female',
  Queer               = 'queer',
  Cisgender           = 'cisgender',
  Cishet              = 'cishet',
  Nonbinary           = 'nonbinary',
  Genderqueer         = 'genderqueer',
  Transgender         = 'transgender',
  Gendernonconforming = 'gendernonconforming',
  Genderfluid         = 'genderfluid',
  Intersex            = 'intersex',
  Agender             = 'agender',
  Genderquestioning   = 'genderquestioning',
  Gendertransition    = 'gendertransition',
  Other               = 'other',
}

interface BaseEntry {
  id: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnose['code']>;
  description: string;
}

export enum HealthCheckRating {
  'Healthy'       = 0,
  'LowRisk'       = 1,
  'HighRisk'      = 2,
  'CriticalRisk'  = 3
}

export enum EntryType {
  'HealthCheck'             = 'HealthCheck',
  'Hospital'                = 'Hospital',
  'OccupationalHealthcare'  = 'OccupationalHealthcare'
}

interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge:  {
    date: string;
    criteria: string;
  }
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  }
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}
