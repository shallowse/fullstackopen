import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { Container, Header, Icon } from 'semantic-ui-react';

import { apiBaseUrl } from '../constants';
import { Patient } from '../types';
import { useStateValue, updatePatient } from '../state';

// https://www.pluralsight.com/guides/react-router-typescript
type TParams = { id: string };

const PatientDetailPage = ({ match }: RouteComponentProps<TParams>) => {
  const id = match.params.id;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [{ patients }, dispatch] = useStateValue();

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
          console.error(e);
        }
      };
      fetchPatient();
    }
  }, [id, loaded, dispatch, patients]);

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
