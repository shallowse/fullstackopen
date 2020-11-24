export interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

// https://www.ons.gov.uk/economy/environmentalaccounts/articles/whatisthedifferencebetweensexandgender/2019-02-21
// https://business.linkedin.com/talent-solutions/blog/diversity/2019/15-gender-identity-terms-for-inclusive-workplace
export enum Gender {
  male = 'male',
  female = 'female',
  queer = 'queer',
  cisgender = 'cisgender',
  cishet = 'cishet',
  nonbinary = 'nonbinary',
  genderqueer = 'genderqueer',
  transgender = 'transgender',
  gendernonconforming = 'gendernonconforming',
  genderfluid = 'genderfluid',
  intersex = 'intersex',
  agender = 'agender',
  genderquestioning = 'genderquestioning',
  gendertransition = 'gendertransition',
  other = 'other',
}

export interface BaseEntry {
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

export interface HealthCheckEntry extends BaseEntry {
  //type: 'HealthCheck';
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
  //type: 'Hospital';
  type: EntryType.Hospital;
  discharge:  {
    date: string;
    criteria: string;
  }
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  //type: 'OccupationalHealthcare';
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

export type NewPatient = Omit<Patient, 'id'>;
export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;
