import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Logo from "../Logo/Logo";
import { useAuth } from "../../AuthContext";
import { Divider } from "@mui/material";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ backgroundColor: "white", padding: "0 20px" }}
    >
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={3}>
          <Logo size={{ xs: "2rem", md: "3rem" }} isRedirect={true} />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "14px" }}>
              <Button sx={{ color: "black" }} component={Link} to="/">
                Home
              </Button>
              <Button sx={{ color: "black" }} component={Link} to="/about">
                About
              </Button>
              <Divider orientation="vertical" flexItem />
              {user && user.active ? (
                <>
                  <Button sx={{ color: "black" }} component={Link} to="/mylinks">
                      My Links
                    </Button>
                  <Button sx={{ color: "black" }} onClick={logout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button sx={{ color: "black" }} component={Link} to="/login">
                      Log in
                    </Button>
                  <Button sx={{ color: "black" }} component={Link} to="/signup">
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
