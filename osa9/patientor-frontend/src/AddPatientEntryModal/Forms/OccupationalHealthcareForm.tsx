import React from 'react';

import { Grid, Button } from 'semantic-ui-react';
import { Field, Formik, Form } from 'formik';

import { TextField, DiagnosisSelection } from './EntryFormField';

import { Diagnose } from '../../types';

interface SubProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  diagnoses: Diagnose[];
}

const OccupationalHealthcareForm: React.FC<SubProps> = ({ onSubmit, onCancel, diagnoses }) => {
  return (
    <Formik
      initialValues={{
        date: '',
        specialist: '',
        description: '',
        diagnosisCodes: [''],
        employerName: '',
        sickLeaveStartDate: '',
        sickLeaveEndDate: '',
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.employerName) {
          errors.employerName = requiredError;
        }
        if (!values.diagnosisCodes.length) {
          errors.diagnosisCodes = requiredError;
        }

        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className='form ui'>
            <Field
              label='Date'
              placeholder='YYYY-MM-DD'
              name='date'
              component={TextField}
            />
            <Field
              label='Specalist'
              placeholder='Specialist name'
              name='specialist'
              component={TextField}
            />
            <Field
              label='Description'
              placeholder='Descrptions of the visit'
              name='description'
              component={TextField}
            />

            <Field
              //name='diagnosisCodes'
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={diagnoses}
              component={DiagnosisSelection}
            />

            <Field
              label='Empoyer Name'
              placeholder='Employer Name'
              name='employerName'
              component={TextField}
            />

            <Field
              label='Sick Leave Start Date'
              placeholder='YYYY-MM-DD'
              name='sickLeaveStartDate'
              component={TextField}
            />

            <Field
              label='Sick Leave End Date'
              placeholder='YYYY-MM-DD'
              name='sickLeaveEndDate'
              component={TextField}
            />

            <Grid>
              <Grid.Column floated='left' width={5}>
                <Button type='button' onClick={onCancel} color='red'>
                  Cancel
                  </Button>
              </Grid.Column>
              <Grid.Column floated='right' width={5}>
                <Button
                  type='submit'
                  floated='right'
                  color='green'
                  disabled={!dirty || !isValid}
                >
                  Add
                    </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OccupationalHealthcareForm;
