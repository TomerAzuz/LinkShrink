import { Container } from "@mui/material";

import TextSection from './TextSection';
import URLInput from "./URLInput";

const Home = () => {
  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      <TextSection />
      <URLInput />
    </Container>
  );
};

export default Home;
