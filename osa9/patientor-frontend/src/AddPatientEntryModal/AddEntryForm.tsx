import React from 'react';

import HealthCheckForm from './Forms/HealthCheckForm';
import HospitalForm from './Forms/HospitalForm';
import OccupationalHealthcareForm from './Forms/OccupationalHealthcareForm';

import { EntryType } from '../types';

interface Props {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  entryType: EntryType | undefined;
}

const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel, entryType }) => {
  switch (entryType) {
    case EntryType.HealthCheck:
      return <HealthCheckForm onSubmit={onSubmit} onCancel={onCancel} />;
    case EntryType.Hospital:
      return <HospitalForm onSubmit={onSubmit} onCancel={onCancel} />
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareForm onSubmit={onSubmit} onCancel={onCancel} />
    default:
      console.log('ERROR');
  }

  return null;
};

export default AddEntryForm;
