import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Auth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  // Successful authentication
  res.redirect('http://localhost:3000'); // Redirect to frontend
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ message: 'Logout failed', error: err });
    }
    res.redirect('http://localhost:3000'); // Redirect to frontend or home page
  });
  res.redirect('http://localhost:3000'); // Redirect to frontend
});

router.get('/current_user', (req, res) => {
  res.send(req.user);
});

export default router;
