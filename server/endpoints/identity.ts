import { Request, Response } from '../types/expressTypes';
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

const CLIENT_ID =
  '512937522732-eiq6es54jjm5m2tgh5j49rtvce69th1j.apps.googleusercontent.com';

const googleClient = new OAuth2Client(CLIENT_ID);

router.get('/validate-session', async (req: Request, res: Response) => {
  const email = req.session?.email;
  if (!req.session?.isAuthenticated || !email) {
    res.json({ success: false });
  } else {
    res.json({ success: true, email });
  }
});

interface GoogleSigninRequest extends Request {
  body: {
    idToken: string;
  };
}
router.post(
  '/google-signin',
  async (req: GoogleSigninRequest, res: Response) => {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload?.email) {
      req.session.isAuthenticated = true;
      req.session.email = payload.email;

      res.json({
        success: true,
        email: payload.email,
      });
    } else {
      res.sendStatus(403);
    }
  }
);

router.get('/logout', async (req: Request, res: Response) => {
  req.session.destroy();
  res.sendStatus(200);
});

module.exports = router;
