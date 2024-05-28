import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea } from '@mui/material';
import { motion } from 'framer-motion';

const CardComponent = () => {
  const cardVariants = {
    offscreen: {
      x: 300
    },
    onscreen: {
      x: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <Box
      component={motion.div}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
    >
      <Card 
        sx={{ maxWidth: 345 }}
        component={motion.div}
        variants={cardVariants}
        elevation={2}
      >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5">
              Shrink your URL
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default CardComponent;