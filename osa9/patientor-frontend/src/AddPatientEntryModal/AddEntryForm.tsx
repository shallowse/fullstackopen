import React from 'react';

import HealthCheckForm from './Forms/HealthCheckForm';
import HospitalForm from './Forms/HospitalForm';
import OccupationalHealthcareForm from './Forms/OccupationalHealthcareForm';

import { EntryType } from '../types';

import { useStateValue } from '../state';

interface Props {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  entryType: EntryType | undefined;
}

const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel, entryType }) => {
  const [{ diagnoses }] = useStateValue();
  const diagnosesArray = Object.values(diagnoses);

  switch (entryType) {
    case EntryType.HealthCheck:
      return <HealthCheckForm onSubmit={onSubmit} onCancel={onCancel} diagnoses={diagnosesArray} />;
    case EntryType.Hospital:
      return <HospitalForm onSubmit={onSubmit} onCancel={onCancel} diagnoses={diagnosesArray} />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareForm onSubmit={onSubmit} onCancel={onCancel} diagnoses={diagnosesArray} />;
    default:
      console.log('ERROR');
  }

  return null;
};

export default AddEntryForm;
