import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LinkIcon from '@mui/icons-material/Link';

import "./LinkDetailsItem.css";
import { qrCodeToBase64 } from "../../utils/qrCodeToBase64";
import CustomDialog from "../../components/CustomDialog/CustomDialog";
import QrCodeCard from "../../components/QrCodeCard/QrCodeCard";

const LinkDetailsItem = ({ link, deleteLink }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewQrCode, setViewQrCode] = useState(false);
  const { id, longUrl, shortUrl, qrCodeData, createdAt, title } = link;

  const toggleQrCode = () => setViewQrCode(!viewQrCode);
  const favicon = `https://www.google.com/s2/favicons?domain=${longUrl}&sz=128`;
  const base64QrCode = qrCodeToBase64(qrCodeData);

  return (
    <Grid item xs={12} m={2}>
      <Grid 
        container 
        alignItems="center" 
        spacing={2} 
        sx={{ border: 1, 
              borderRadius: 4, 
              borderColor: "grey.300", 
              p: 2, 
              maxWidth: "800px" 
            }}
      >
        <Grid item xs={2} sm={2} md={1}>
          <img src={favicon} width={50} height={50} alt="favicon"/>
        </Grid>
        <Grid 
          item xs={10} sm={10} md={2} 
          display="flex" 
          flexDirection="column" 
          maxWidth="200px"
        >
          <Tooltip title={title}>
            <Typography 
              variant="body1" 
              component={RouterLink} 
              to={longUrl} 
              color="inherit" 
              underline="always" 
              ml={2}
              sx={{ 
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "noWrap"
              }}
            >
              {title}
            </Typography>
          </Tooltip>
          <Typography 
            variant="body1" 
            component={RouterLink} 
            to={longUrl} 
            color="inherit" 
            underline="always" 
            ml={2}
            sx={{ 
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "noWrap"
            }}
          >
            {longUrl}
          </Typography>
        </Grid>
        <Grid item xs={8} sm={8} md={4}>
          <Box>
          {viewQrCode ? (
            <Box display="flex" justifyContent="center" position="relative">
              <Tooltip title="View QR Code">
                <QrCodeCard imageUrl={base64QrCode}/>
              </Tooltip>
            </Box>
          ) : (
            <Typography 
              variant="body1" 
              component={RouterLink} 
              to={shortUrl} 
              color="inherit" 
              underline="always"
              sx={{ 
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "noWrap"
              }}
            >
              {shortUrl}
            </Typography>
          )}
          </Box>
        </Grid>
        <Grid item xs={4} sm={1} md={1}>
          <Tooltip title={viewQrCode ? <Typography>View Link</Typography> : <Typography>View QR Code</Typography>}>
            <IconButton onClick={toggleQrCode}>
              {viewQrCode ? <LinkIcon /> : <QrCodeIcon />}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={6} md={3} display="flex" justifyContent="center" position="relative">
          <Typography variant="body1" align="center" component="span" ml={1}>
            {new Date(createdAt).toLocaleString(undefined, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" })}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={1} display="flex" justifyContent="flex-end">
          <Tooltip title={<Typography>Remove link</Typography>}>
            <IconButton onClick={() => setIsDialogOpen(true)}>
              <ClearIcon sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <CustomDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onClick={() => deleteLink(id)}
        title={"Delete Link"}
        text={"Are you sure you want to permanently delete this link?"}
      />
    </Grid>
  );
};

export default LinkDetailsItem;
