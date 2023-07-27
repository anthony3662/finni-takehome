import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useRequest } from '../../utils/useRequest';
import { OrganizationDetailsResponse } from '../../endpoints/organizationEndpointTypes';
import { ORGANIZATION_ENDPOINTS } from '../../endpoints/endpoints';
import { useEffect, useState } from 'react';
import { LoadingBackdrop } from '../../components/LoadingBackdrop';
import { Tab, Tabs, Typography } from '@mui/material';
import { useWindowSize } from '@uidotdev/usehooks';
import { MembersTab } from './members/MembersTab';
import { Overview } from './overview/Overview';
import { Patients } from './patients/Patients';

export const OrganizationDetails = () => {
  const { width } = useWindowSize();
  const { id } = useParams();
  const { get, isLoading, data } = useRequest<OrganizationDetailsResponse>();

  const [activeTab, setActiveTab] = useState(0);

  const fetch = async () => {
    await get(`${ORGANIZATION_ENDPOINTS.organizationDetails}/${id}`);
  };

  const handleTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    fetch();
  }, []);

  if (isLoading || !data) {
    return <LoadingBackdrop />;
  }

  return (
    <>
      <Typography variant={'h4'} color={'primary.dark'} sx={{ padding: 2 }}>
        {data.organization.name}
      </Typography>
      <Tabs variant={width < 576 ? 'fullWidth' : undefined} value={activeTab} onChange={handleTab}>
        <Tab label={'Overview'} />
        <Tab label={'Patients'} />
        <Tab label={'Members'} />
      </Tabs>
      <div style={{ padding: 32 }}>
        {activeTab === 0 ? <Overview orgDetails={data} /> : null}
        {activeTab === 1 ? <Patients orgDetails={data} /> : null}
        {activeTab === 2 ? <MembersTab orgDetails={data} refetch={fetch} /> : null}
      </div>
    </>
  );
};
