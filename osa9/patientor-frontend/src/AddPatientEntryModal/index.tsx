import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import { EntryType } from '../types';
import AddEntryForm from './AddEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  error?: string;
  entryType: EntryType | undefined;
}

const AddPatientEntryModal = ({ modalOpen, onClose, onSubmit, error, entryType }: Props) => {
  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>Add new <u>{entryType}</u> entry</Modal.Header>
      <Modal.Content>
        {error && <Segment inverted color='red'>{`Error: ${error}`}</Segment>}
        <AddEntryForm onSubmit={onSubmit} onCancel={onClose} entryType={entryType} />
      </Modal.Content>
    </Modal>
  );
};

export default AddPatientEntryModal;
