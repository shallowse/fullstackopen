export interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

// https://www.ons.gov.uk/economy/environmentalaccounts/articles/whatisthedifferencebetweensexandgender/2019-02-21
// https://business.linkedin.com/talent-solutions/blog/diversity/2019/15-gender-identity-terms-for-inclusive-workplace
export enum Gender {
  male                = 'male',
  female              = 'female',
  queer               = 'queer',
  cisgender           = 'cisgender',
  cishet              = 'cishet',
  nonbinary           = 'nonbinary',
  genderqueer         = 'genderqueer',
  transgender         = 'transgender',
  gendernonconforming = 'gendernonconforming',
  genderfluid         = 'genderfluid',
  intersex            = 'intersex',
  agender             = 'agender',
  genderquestioning   = 'genderquestioning',
  gendertransition    = 'gendertransition',
  other               = 'other',
}

// TODO: add check for utils.ts !!!
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {

}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn'>;
export type NewPatient = Omit<Patient, 'id'>;
export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;
