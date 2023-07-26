import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useRequest } from '../../utils/useRequest';
import { OrganizationDetailsResponse } from '../../endpoints/endpointTypes';
import { ENDPOINTS } from '../../endpoints/endpoints';
import { useEffect } from 'react';
import { LoadingBackdrop } from '../../components/LoadingBackdrop';

export const OrganizationDetails = () => {
  const { id } = useParams();
  const { get, isLoading, data } = useRequest<OrganizationDetailsResponse>();

  const fetch = async () => {
    await get(`${ENDPOINTS.organizationDetails}/${id}`);
  };

  useEffect(() => {
    fetch();
  }, []);

  if (isLoading || !data) {
    return <LoadingBackdrop />;
  }

  return (
    <div style={{ padding: 32 }}>
      Details
      {JSON.stringify(data)}
    </div>
  );
};
