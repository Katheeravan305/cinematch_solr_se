import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

type Props = {
  result: {
    Certificate: string;
    Director: string;
    Genre: string;
    Gross: number;
    IMDB_Rating: number;
    Meta_score: number;
    No_of_Votes: number;
    Overview: string;
    Poster_Link: string;
    Released_Year: number;
    Runtime: string;
    Series_Title: string;
    Movie_Cast: string;
    "[features]": string;
    score: string;
  };
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, fontWeight: "bold" }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const SearchResult: React.FC<Props> = ({ result }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let sum = "0.0000";
  if (result["[features]"]) {
    const regex = /(\d+\.\d+)/g;
    const matches = result["[features]"].match(regex);

    // Convert the values to numbers
    let number1 = 0,
      number2 = 0;
    if (matches) {
      number1 = parseFloat(matches[0]);
      number2 = parseFloat(matches[1]);
    }
    // Perform the addition
    sum = (number1 + number2).toFixed(4);
  } else {
    sum = result.score;
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          backgroundColor: "#E0E7E9",
          marginBottom: "20px",
          width: "100%",
          cursor: "pointer",
          "&:hover": {
            border: "2px #354649 solid",
          },
        }}
        onClick={handleClickOpen}
      >
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    color: "#000000",
                  }}
                >
                  {result.Series_Title}
                </Typography>
                <div>
                  <Chip
                    icon={<StarIcon style={{ color: "#E0E7E9" }} />}
                    label={result.IMDB_Rating}
                    style={{
                      borderRadius: "5px",
                      backgroundColor: "#354649",
                      color: "#E0E7E9",
                      width: "70px",
                    }}
                  />
                  <Chip
                    label={sum}
                    icon={<DoneAllIcon style={{ color: "#E0E7E9" }} />}
                    style={{
                      marginLeft: "10px",
                      borderRadius: "5px",
                      backgroundColor: "#354649",
                      color: "#E0E7E9",
                    }}
                  />
                </div>
              </div>

              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Arial",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                {result.Overview}
              </Typography>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  backgroundColor: "#A3C6C4",
                  fontFamily: "Arial",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "5px",
                  borderRadius: "10px",
                  marginTop: "5px",
                }}
              >
                Genre: {result.Genre}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {result.Series_Title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <img
            src={result.Poster_Link}
            style={{
              marginLeft: "30%",
              width: "40%",
              borderRadius: "5px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
            }}
          />
          <Typography
            variant="body2"
            color="#000000"
            sx={{
              fontFamily: "Arial",
              fontSize: "16px",
              fontWeight: "bold",
              padding: "5px",
              marginTop: "5px",
            }}
          >
            Overview
          </Typography>
          <Typography
            variant="body2"
            color="#000000"
            sx={{
              backgroundColor: "#E0E7E9",
              fontFamily: "Arial",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              textAlign: "justify",
            }}
          >
            {result.Overview}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  fontFamily: "Arial",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "5px",
                  marginTop: "15px",
                }}
              >
                Director
              </Typography>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  backgroundColor: "#E0E7E9",
                  fontFamily: "Arial",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                {result.Director}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  fontFamily: "Arial",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "5px",
                  marginTop: "15px",
                }}
              >
                Certificate
              </Typography>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  backgroundColor: "#E0E7E9",
                  fontFamily: "Arial",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                {result.Certificate}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  fontFamily: "Arial",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "5px",
                  marginTop: "15px",
                }}
              >
                Runtime
              </Typography>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  backgroundColor: "#E0E7E9",
                  fontFamily: "Arial",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                {result.Runtime}
              </Typography>
            </Grid>
          </Grid>
          <Typography
            variant="body2"
            color="#000000"
            sx={{
              fontFamily: "Arial",
              fontSize: "16px",
              fontWeight: "bold",
              padding: "5px",
              marginTop: "15px",
            }}
          >
            Genre
          </Typography>
          <Typography
            variant="body2"
            color="#000000"
            sx={{
              backgroundColor: "#E0E7E9",
              fontFamily: "Arial",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              textAlign: "justify",
            }}
          >
            {result.Genre}
          </Typography>
          <Typography
            variant="body2"
            color="#000000"
            sx={{
              fontFamily: "Arial",
              fontSize: "16px",
              fontWeight: "bold",
              padding: "5px",
              marginTop: "15px",
            }}
          >
            Movie Cast
          </Typography>
          <Typography
            variant="body2"
            color="#000000"
            sx={{
              backgroundColor: "#E0E7E9",
              fontFamily: "Arial",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              textAlign: "justify",
            }}
          >
            {result.Movie_Cast}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  fontFamily: "Arial",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "5px",
                  marginTop: "15px",
                }}
              >
                IMDB Rating
              </Typography>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  backgroundColor: "#E0E7E9",
                  fontFamily: "Arial",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "5px",
                  borderRadius: "5px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                  textAlign: "center",
                }}
              >
                {result.IMDB_Rating}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  fontFamily: "Arial",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "5px",
                  marginTop: "15px",
                }}
              >
                No of Votes
              </Typography>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  backgroundColor: "#E0E7E9",
                  fontFamily: "Arial",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                {result.No_of_Votes}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  fontFamily: "Arial",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "5px",
                  marginTop: "15px",
                }}
              >
                Gross ($)
              </Typography>
              <Typography
                variant="body2"
                color="#000000"
                sx={{
                  backgroundColor: "#E0E7E9",
                  fontFamily: "Arial",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                {result.Gross}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default SearchResult;
