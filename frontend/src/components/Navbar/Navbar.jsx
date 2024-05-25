import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Logo from '../Logo/Logo';
import { useAuth } from '../../AuthContext';
import { Divider } from '@mui/material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar 
      position='static' 
      elevation={0} 
      sx={{ backgroundColor: 'white', padding: '0 20px' }}
    >
      <Toolbar>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item xs={6} sm={3}>
            <Logo />
          </Grid>
          <Grid item xs={6} sm={9}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
              <Button sx={{ color: 'black' }} onClick={() => navigate('/')}>
                Home
              </Button>
              <Button sx={{ color: 'black' }}>About</Button>
              <Divider orientation='vertical' flexItem />
              {user ? (
                <>
                <Button 
                  sx={{ color: 'black' }}
                  onClick={() => navigate('/my-links')}
                >
                  My Links
                </Button>
                <Button 
                  sx={{ color: 'black' }} 
                  onClick={logout}
                >
                   Log out
                </Button>
                </>
              ) : (
                <>
                <Button 
                  sx={{ color: 'black' }}
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
                <Button 
                  sx={{ color: 'black' }} 
                  onClick={() => navigate('/signup')}>
                   Sign up
                </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
