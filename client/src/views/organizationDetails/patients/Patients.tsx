import * as React from 'react';
import { useEffect, useState } from 'react';
import { OrganizationDetailsResponse } from '../../../endpoints/organizationEndpointTypes';
import styled from 'styled-components';
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { PatientForm } from './PatientForm';
import CloseIcon from '@mui/icons-material/Close';
import { Role } from '../../../models/organizationUser';
import { useRequest } from '../../../utils/useRequest';
import { PatientListParams, PatientListResponse } from '../../../endpoints/patientEndpointTypes';
import { PATIENT_ENDPOINTS } from '../../../endpoints/endpoints';
import { LoadingBackdrop } from '../../../components/LoadingBackdrop';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DialogTitleWrapper = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

export const Patients: React.FC<{ orgDetails: OrganizationDetailsResponse }> = ({ orgDetails }) => {
  const [openAddPatient, setOpenAddPatient] = useState(false);

  const { post: fetchPatients, isLoading, data } = useRequest<PatientListResponse, PatientListParams>();

  const fetch = async () => {
    const res = await fetchPatients({
      endpoint: `${PATIENT_ENDPOINTS.patientList}/${orgDetails.organization._id}`,
      body: {},
    });
    console.log(res);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleOpenDialog = () => {
    setOpenAddPatient(true);
  };

  const handleCloseDialog = () => {
    setOpenAddPatient(false);
  };

  const isDoctor = orgDetails.myOrgUser.role === Role.doctor;

  if (isLoading || !data) {
    return <LoadingBackdrop />;
  }

  return (
    <Wrapper>
      {isDoctor ? (
        <Button variant={'contained'} fullWidth onClick={handleOpenDialog}>
          Add Patient
        </Button>
      ) : null}
      <Dialog open={openAddPatient} onClose={handleCloseDialog} fullScreen>
        <AppBar sx={{ position: 'relative' }}>
          <DialogTitleWrapper>
            <Typography variant='h6'>Add New Patient</Typography>
            <IconButton edge='end' color='inherit' onClick={handleCloseDialog} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </DialogTitleWrapper>
        </AppBar>
        <DialogContent>
          <PatientForm
            orgDetails={orgDetails}
            onSubmit={async () => {
              await fetch();
              handleCloseDialog();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {data.patients.map(patient => (
        <Card key={patient._id} variant='outlined' style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant='h5' gutterBottom>
              {`${patient.firstName} ${patient.middleName || ''} ${patient.lastName}`}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Status: {patient.status}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Organization ID: {patient.organizationId}
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
        </Card>
      ))}
    </Wrapper>
  );
};
