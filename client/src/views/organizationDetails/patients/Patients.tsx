import * as React from 'react';
import { useEffect, useState } from 'react';
import { OrganizationDetailsResponse } from '../../../endpoints/organizationEndpointTypes';
import styled from 'styled-components';
import { AppBar, Button, Dialog, DialogContent, IconButton, Toolbar, Typography } from '@mui/material';
import { PatientForm } from './PatientForm';
import CloseIcon from '@mui/icons-material/Close';
import { Role } from '../../../models/organizationUser';
import { useRequest } from '../../../utils/useRequest';
import { PatientListParams, PatientListResponse } from '../../../endpoints/patientEndpointTypes';
import { PATIENT_ENDPOINTS } from '../../../endpoints/endpoints';
import { LoadingBackdrop } from '../../../components/LoadingBackdrop';
import { Filters, Patient } from '../../../models/patient';
import { PatientsList } from './PatientsList';
import { FilterModal } from './FilterModal';
import { FiltersDisplay } from './FiltersDisplay';

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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null); // Add state for the patient to edit

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [activeFilters, setActiveFilters] = useState<Filters>({});

  const { post: fetchPatients, isLoading, data } = useRequest<PatientListResponse, PatientListParams>();

  const fetch = async () => {
    const res = await fetchPatients({
      endpoint: `${PATIENT_ENDPOINTS.patientList}/${orgDetails.organization._id}`,
      body: {
        filters: activeFilters,
      },
    });
  };

  useEffect(() => {
    // backend does the filtering
    fetch();
  }, [activeFilters]);

  useEffect(() => {}, []);

  const handleOpenAddDialog = () => {
    setIsAddOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddOpen(false);
    setIsEditOpen(false); // Close the edit dialog as well
    setPatientToEdit(null); // Reset the patient to edit
  };

  const handleEditPatient = (patient: Patient) => {
    setPatientToEdit(patient); // Set the patient to edit when the edit button is clicked
    setIsEditOpen(true); // Open the edit dialog
  };

  const isDoctor = orgDetails.myOrgUser.role === Role.doctor;

  if (isLoading || !data) {
    return <LoadingBackdrop />;
  }

  return (
    <Wrapper>
      {isDoctor ? (
        <Button variant={'contained'} color={'success'} fullWidth onClick={handleOpenAddDialog}>
          Add Patient
        </Button>
      ) : null}
      <Button variant={'contained'} onClick={() => setIsFilterOpen(true)}>
        Add Filters
      </Button>
      <FiltersDisplay activeFilters={activeFilters} clearFilters={() => setActiveFilters({})} />
      <PatientsList patients={data.patients} isDoctor={isDoctor} handleEditPatient={handleEditPatient} refetch={fetch} />
      <FilterModal isOpen={isFilterOpen} close={() => setIsFilterOpen(false)} activeFilters={activeFilters} setFilters={setActiveFilters} />
      <Dialog open={isAddOpen} onClose={handleCloseDialog} fullScreen>
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
      </Dialog>
      <Dialog open={isEditOpen} onClose={handleCloseDialog} fullScreen>
        <AppBar sx={{ position: 'relative' }}>
          <DialogTitleWrapper>
            <Typography variant='h6'>Edit Patient</Typography>
            <IconButton edge='end' color='inherit' onClick={handleCloseDialog} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </DialogTitleWrapper>
        </AppBar>
        <DialogContent>
          {patientToEdit ? (
            <PatientForm
              orgDetails={orgDetails}
              patientToEdit={patientToEdit} // Pass the patient to edit to the form
              onSubmit={async () => {
                await fetch();
                handleCloseDialog();
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Wrapper>
  );
};
