import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Field, Formik, Form } from 'formik';

import { TextField, NumberField, DiagnosisSelection } from './EntryFormField';

import { Diagnose } from '../../types';

interface SubProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  diagnoses: Diagnose[];
}

const HealthCheckForm: React.FC<SubProps> = ({ onSubmit, onCancel, diagnoses }) => {
  //console.log('DIAGNOSES', Object.values(diagnoses));
  return (
    <Formik
      initialValues={{
        date: '',
        specialist: '',
        description: '',
        diagnosisCodes: [],
        healthCheckRating: 0,
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
        if (values.healthCheckRating < 0 || values.healthCheckRating > 3) {
          errors.healtCheckRating = requiredError;
        }
        // TODO: add check for values.dia
        // if (values.diagnosiscodes)

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
              label='Health Check Rating'
              name='healthCheckRating'
              min={0}
              max={3}
              component={NumberField}
            />

            <Field
              //name='diagnosisCodes'
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              //diagnoses={Object.values(diagnoses)}
              diagnoses={diagnoses}
              component={DiagnosisSelection}
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

export default HealthCheckForm;
