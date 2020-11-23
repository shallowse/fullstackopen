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
  const [person, setPerson] = useState<Patient | null>(null);
  const [, dispatch] = useStateValue();

  useEffect(() => {
    if (!person) {
      const fetchPatient = async () => {
        try {
          const { data: singlePatientFromApi } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          setPerson(singlePatientFromApi);
          dispatch({ type: 'UPDATE_PATIENT', payload: singlePatientFromApi });
        } catch (e) {
          console.error(e);
        }
      };
      fetchPatient();
    }

  }, [id, person, dispatch]);

  if (person === null) {
    return <p>Loading patient data...</p>;
  }

  //console.log(person);
  return (
    <Container>
      <Header as='h2'>{person.name}&nbsp;&nbsp;<small>{person.gender}</small></Header>
      <p><Icon name='address card' />ssn: {person.ssn}</p>
      <p><Icon name='building' />occupation: {person.occupation}</p>
    </Container>


  );
};

export default PatientDetailPage;
