import { Request, Response } from '../types/expressTypes';

const cookieCheckMiddleware = (req: Request, res: Response, next: any) => {
  if (!req.session || !req.session.isAuthenticated || !req.session.email) {
    res.sendStatus(403);
    return;
  }

  next();
};

module.exports = cookieCheckMiddleware;
