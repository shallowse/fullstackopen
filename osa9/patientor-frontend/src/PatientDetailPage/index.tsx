import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { Container, Header, Icon } from 'semantic-ui-react';

import { apiBaseUrl } from '../constants';
import { Patient } from '../types';
import { useStateValue } from '../state';

// https://www.pluralsight.com/guides/react-router-typescript
type TParams = { id: string };

const PatientDetailPage = ({ match }: RouteComponentProps<TParams>) => {
  const id = match.params.id;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [{ patients }, dispatch] = useStateValue();

  useEffect(() => {
    if (!loaded) {
      const fetchPatient = async () => {
        try {
          const { data: singlePatientFromApi } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          setLoaded(true);
          dispatch({ type: 'UPDATE_PATIENT', payload: singlePatientFromApi });
        } catch (e) {
          console.error(e);
        }
      };
      fetchPatient();
    }
  }, [id, loaded, dispatch]);

  if (!loaded || Object.keys(patients).length === 0) {
    return <p>Loading patient data...</p>;
  }

  const patient = patients[id];
  return (
    <Container>
      <Header as='h2'>{patient.name}&nbsp;&nbsp;<small>{patient.gender}</small></Header>
      <p><Icon name='address card' />ssn: {patient.ssn}</p>
      <p><Icon name='building' />occupation: {patient.occupation}</p>
    </Container>
  );
};

export default PatientDetailPage;
