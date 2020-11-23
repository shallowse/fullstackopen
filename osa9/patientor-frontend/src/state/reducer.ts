import { State } from './state';
import { Patient } from '../types';

export type Action =
  | {
    type: 'SET_PATIENT_LIST';
    payload: Patient[];
  }
  | {
    type: 'ADD_PATIENT';
    payload: Patient;
  }
  | {
    type: 'UPDATE_PATIENT';
    payload: Patient;
  };

export const reducer = (state: State, action: Action): State => {
  let retState: State;

  switch (action.type) {
    case 'SET_PATIENT_LIST':
      retState = {
        ...state,
        patients: {
          ...action.payload.reduce((memo, patient) => ({ ...memo, [patient.id]: patient }), {}),
          ...state.patients
        }
      };
      console.log('SET_PATIENT_LIST\n', retState);
      return retState;
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case 'UPDATE_PATIENT':
      // There are two cases for this:
      //
      // The first case is encountered when the user browsed directly to
      // the url "localhost:3000/patiens/:id" and thus there are no patients in the state.
      //
      // The second case in encountered when the user first accesses the main page
      // "localhost:3000" and then clicks the link "localhost:3000/patients/:id".
      // Now the state has been set by 'SET_PATIENT_LIST' and there are patients in the state

      // (1) If there are already patients in the list
      //     Let's update the 'ssn' to an existing patient
      if (Object.keys(state.patients).length > 0) {
        const patient = state.patients[action.payload.id];
        patient.ssn = action.payload.ssn;
        retState = {
          ...state,
          patients: {
            ...state.patients,
            patient,
          }
        }
        console.log('UPDATE_PATIENT, case', patient.name, '\n', retState);
      } else {
        // (2) If the user directly accessed /patients/:id there aren't
        //     any patients loaded yet in to the state. The state 'SET_PATIENT_LIST'
        //     will happen right after this case.
        const patient = action.payload;
        retState = {
          ...state,
          patients: {
            ...state.patients,
            [patient.id]: patient,
          }
        };
        console.log('UPDATE_PATIENT, case 2\n', retState);
      }
      return retState;
    default:
      return state;
  }
};
