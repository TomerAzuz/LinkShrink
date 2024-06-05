import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from "@mui/icons-material/Clear";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LinkIcon from '@mui/icons-material/Link';

import "./LinkDetailsItem.css";
import { qrCodeToBase64 } from "../../utils/qrCodeToBase64";
import CustomDialog from "../../components/CustomDialog/CustomDialog";
import QrCodeCard from "../../components/QrCodeCard/QrCodeCard";
import FaviconDisplay from "./FaviconDisplay/FaviconDisplay";
import DateDisplay from "./DateDisplay/DateDisplay";
import LinkDetails from "./LinkDetails/LinkDetails";
import CopyLink from "../CopyLink/CopyLink";

const LinkDetailsItem = ({ link, deleteLink }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewQrCode, setViewQrCode] = useState(false);
  const { id, longUrl, shortUrl, qrCodeData, createdAt, title } = link;

  const toggleQrCode = () => setViewQrCode(!viewQrCode);
  const base64QrCode = qrCodeToBase64(qrCodeData);

  return (
    <Grid item xs={12} m={2}>
      <Grid container spacing={2} 
        sx={{ display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: 1, 
              borderRadius: 4, 
              borderColor: "grey.300", 
              p: 2, 
              maxWidth: "800px" 
        }}
      >
        <FaviconDisplay url={longUrl} />
        <LinkDetails url={longUrl} title={title} />
        <Grid item sm={12} md={4}>
          {viewQrCode ? <QrCodeCard imageUrl={base64QrCode} size="small" /> : 
                        <CopyLink url={shortUrl} variant="body1" />}
        </Grid>
        <Grid item sm={4} md={1} justifyContent="center">
          <Tooltip title={viewQrCode ? "View Link " : "View QR Code"}>
            <IconButton onClick={toggleQrCode}>
              {viewQrCode ? <LinkIcon sx={{ fontSize: 30 }} /> : <QrCodeIcon sx={{ fontSize: 30 }} />}
            </IconButton>
          </Tooltip>
        </Grid>
        <DateDisplay createdAt={createdAt} />
        <Grid item sm={4} md={1} justifyContent="flex-end">
          <Tooltip title="Remove link">
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
        buttonText={"Delete"}
      />
    </Grid>
  );
};

export default LinkDetailsItem;
