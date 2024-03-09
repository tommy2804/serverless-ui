/* eslint-disable react/function-component-definition */
import { CircularProgress } from "@mui/material";

export default function CircularLoading() {
  return (
    <CircularProgress
      sx={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        top: "40%",
        width: "120px !important",
        height: "120px !important",
        marginInlineStart: "250px",
        "@media (max-width: 960px)": {
          marginInlineStart: "0",
        },
      }}
    />
  );
}
