import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { Container, Header, Icon, Button } from 'semantic-ui-react';

import EntryDetails from './EntryDetails';
import { apiBaseUrl } from '../constants';
import { Patient, EntryType } from '../types';
import { useStateValue, updatePatient, updatePatientWithNewEntry } from '../state';

import AddPatientEntryModal from '../AddPatientEntryModal';

// https://www.pluralsight.com/guides/react-router-typescript
type TParams = { id: string };

const PatientDetailPage = ({ match }: RouteComponentProps<TParams>) => {
  const id = match.params.id;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [{ patients, diagnoses }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [entryType, setEntryType] = useState<EntryType | undefined>();

  useEffect(() => {
    // 9.17.
    // ...Fetch the data from the enpoint created in the previous exercise.
    // ...After fetching the patient information from the backend,
    // ...add the fetched information to the application's state.
    // ...Do not fetch the information if it already is in the app state,
    // ...i.e. if the user is visiting the same patient's information many times.
    //
    // I use the 'ssn' field to check whether the patient's information has been
    // already accessed and updated
    if (patients[id] && patients[id].ssn) {
      setLoaded(true);
      return;
    }

    if (!loaded) {
      const fetchPatient = async () => {
        try {
          const { data: singlePatientFromApi } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          setLoaded(true);
          dispatch(updatePatient(singlePatientFromApi));
        } catch (e) {
          setError(e.response.data);
          console.error(e);
        }
      };
      fetchPatient();
    }
  }, [id, loaded, dispatch, patients]);


  const openModal = (entryType: EntryType): void => {
    setEntryType(entryType);
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
    setEntryType(undefined);
  };

  const submitNewEntry = async (values: any) => {
    let newEntry = {
      type: entryType,
    };

    switch (entryType) {
      case EntryType.HealthCheck:
        newEntry = {
          ...newEntry,
          ...values,
        };
        break;
      case EntryType.Hospital:
        // Note: The backend implementation discards the received and submitted extra values
        // dischargeDate and dischargeCriteria
        newEntry = {
          ...newEntry,
          ...values,
          discharge: {
            date: values.dischargeDate,
            criteria: values.dischargeCriteria
          },
        };
        break;
      case EntryType.OccupationalHealthcare:
        if (values.sickLeaveStartDate && values.sickLeaveEndDate) {
          newEntry = {
            ...newEntry,
            ...values,
            sickLeave: {
              startDate: values.sickLeaveStartDate,
              endDate: values.sickLeaveEndDate,
            },
          };
        } else {
          newEntry = {
            ...newEntry,
            ...values,
          };
        }
        break;
      default:
        setError('Incorrect type received');
        return;
    }
    console.log('Submit New Entry:', newEntry);

    try {
      const { data: updatedPatientWithNewEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        newEntry
      );

      dispatch(updatePatientWithNewEntry(updatedPatientWithNewEntry));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data);
    }
  };

  if (!loaded || Object.keys(patients).length === 0 || Object.keys(diagnoses).length === 0) {
    return <p>Loading patient data...</p>;
  }

  const patient = patients[id];
  if (!patient.entries) {
    return <p>Waiting for patient data update...</p>;
  }

  //console.log('patient', patient);
  return (
    <Container>
      <Header as='h2'>{patient.name}&nbsp;&nbsp;<small>{patient.gender}</small></Header>
      <p><Icon name='address card' />ssn: {patient.ssn}</p>
      <p><Icon name='building' />occupation: {patient.occupation}</p>

      <Header as='h3'>entries</Header>
      {
        patient.entries.map((entry, idx) => <EntryDetails key={idx} entry={entry} />)
      }

      <AddPatientEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        entryType={entryType}
      />

      <Button onClick={() => openModal(EntryType.HealthCheck)}>Add <u>{EntryType.HealthCheck}</u> Entry</Button>
      <Button onClick={() => openModal(EntryType.Hospital)}>Add <u>{EntryType.Hospital}</u> Entry</Button>
      <Button onClick={() => openModal(EntryType.OccupationalHealthcare)}>Add <u>{EntryType.OccupationalHealthcare}</u> Entry</Button>
    </Container>
  );

};

export default PatientDetailPage;
