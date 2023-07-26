import { Request as BaseRequest, Response as BaseResponse } from 'express';

export interface Request extends BaseRequest {
  session: {
    email?: string;
    isAuthenticated?: boolean;
    destroy: () => any;
  };
}

export interface Response extends BaseResponse {}
