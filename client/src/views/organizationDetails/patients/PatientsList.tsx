import * as React from 'react';
import { Button, Card, CardActions, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Patient } from '../../../models/patient';
import { useRequest } from '../../../utils/useRequest';
import { DeletePatientResponse } from '../../../endpoints/patientEndpointTypes';
import { LoadingButton } from '@mui/lab';
import { PATIENT_ENDPOINTS } from '../../../endpoints/endpoints';

type Props = {
  patients: Patient[];
  isDoctor: boolean;
  handleEditPatient: (patient: Patient) => void;
  refetch: () => void;
};
export const PatientsList: React.FC<Props> = ({ patients, isDoctor, handleEditPatient, refetch }) => {
  const { get: deletePatient, isLoading: deleteLoading } = useRequest<DeletePatientResponse>();

  const handleDelete = async (patientId: string) => {
    await deletePatient(`${PATIENT_ENDPOINTS.deletePatient}/${patientId}`);
    refetch();
  };

  return (
    <>
      {patients.map(patient => (
        <Card key={patient._id} variant='outlined' style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant='h5' gutterBottom>
              {`${patient.firstName} ${patient.middleName || ''} ${patient.lastName}`}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Status: {patient.status.toUpperCase()}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Date of Birth: {new Date(patient.dateOfBirth).toDateString()}
            </Typography>

            {patient.addresses.length > 0 ? (
              <>
                <Typography variant='h6' gutterBottom>
                  Addresses:
                </Typography>
                <List>
                  {patient.addresses.map((address, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={address.street} secondary={`${address.city}, ${address.state} ${address.zipCode}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : null}

            {patient.customFields.length > 0 ? (
              <>
                <Typography variant='h6' gutterBottom>
                  Custom Fields:
                </Typography>
                <List>
                  {patient.customFields.map((customField, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${customField.name} - Visible to: ${customField.viewPermission.toUpperCase()}`}
                        secondary={customField.value}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : null}
          </CardContent>
          {isDoctor ? (
            <CardActions sx={{ display: 'flex', justifyContent: 'right', gap: 1 }}>
              <Button variant='outlined' color='primary' onClick={() => handleEditPatient(patient)}>
                Edit
              </Button>
              <LoadingButton loading={deleteLoading} variant='outlined' color='error' onClick={() => handleDelete(patient._id)}>
                Delete
              </LoadingButton>
            </CardActions>
          ) : null}
        </Card>
      ))}
    </>
  );
};
