export interface Diagnosis {
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

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: string[];
}
