import React from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import Logo from "../Logo/Logo";
import NavButton from "../Buttons/NavButton";
import { useAuth } from "../../AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ backgroundColor: "white", 
            padding: "0 20px" 
          }}
    >
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={3}>
          <Logo size={{ xs: "2rem", md: "3rem" }} isRedirect={true} />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "14px" }}>
              <NavButton to="/">Home</NavButton>
              <Divider orientation="vertical" flexItem />
              {user && user.active ? (
                <>
                   <NavButton to="/mylinks">My Links</NavButton>
                   <NavButton onClick={logout}>Log out</NavButton>
                </>
              ) : (
                <>
                  <NavButton to="/login">Log in</NavButton>
                  <NavButton to="/signup">Sign up</NavButton>
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
