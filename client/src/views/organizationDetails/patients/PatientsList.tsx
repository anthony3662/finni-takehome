import * as React from 'react';
import { Button, Card, CardActions, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Patient } from '../../../models/patient';

export const PatientsList: React.FC<{ patients: Patient[]; isDoctor: boolean; handleEditPatient: (patient: Patient) => void }> = ({
  patients,
  isDoctor,
  handleEditPatient,
}) => {
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

            {patient.addresses.length > 0 && (
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
            )}
          </CardContent>
          <CardActions>
            {isDoctor && (
              <Button sx={{ marginLeft: 'auto' }} variant='outlined' color='primary' onClick={() => handleEditPatient(patient)}>
                Edit
              </Button>
            )}
          </CardActions>
        </Card>
      ))}
    </>
  );
};
