import React from "react";
import { initialValuesRegister, registerSchema } from "./auth";
import { Formik } from "formik";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CustomTextField } from "../../components/input";
import { SignUpUser } from "../../types/auth";
interface SignUpProps {
  showPassword: boolean;
  handlePasswordToggle: () => void;
  handleIsLogin: () => void;
  onRegister: (val: SignUpUser) => void;
}
const SignUpAdmin: React.FC<SignUpProps> = ({
  showPassword,
  handlePasswordToggle,
  handleIsLogin,
  onRegister,
}) => {
  return (
    <div className="register-container">
      <Formik
        initialValues={initialValuesRegister}
        validationSchema={registerSchema}
        onSubmit={() => {}}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Typography
                paddingTop={"1rem"}
                color={"GrayText"}
                component="p"
                variant="body2"
              >
                Enter Your credentials and create a new admin account
              </Typography>
              <button className="google-contain rmv-default">
                <img
                  className="google-img"
                  src={"/google-logo.png"}
                  alt="drive"
                />
                <p>Sign Up with Google</p>
              </button>
              {/* or line */}
              <div className="or-line">
                <div className="or-line__line"></div>
                <span className="or-text">{"OR"}</span>
                <div className="or-line__line"></div>
              </div>

              <Box>
                <CustomTextField
                  margin="normal"
                  variant="outlined"
                  name="firstName"
                  label="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
                <CustomTextField
                  margin="normal"
                  variant="outlined"
                  name="lastName"
                  label="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
                <CustomTextField
                  margin="normal"
                  variant="outlined"
                  name="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <CustomTextField
                  margin="normal"
                  variant="outlined"
                  name="password"
                  label="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.password}
                  helperText={errors.password}
                  type={showPassword ? "text" : "password"}
                  iconComponent={
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handlePasswordToggle}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  }
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onRegister(values)}
                  sx={{ mt: 3, mb: 2, backgroundColor: "#6638f0" }}
                >
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item xs></Grid>
                  <Grid item>
                    <Button
                      onClick={handleIsLogin}
                      sx={{ color: "#6638f0" }}
                      variant="outlined"
                    >
                      {"have an account? Sign In"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default SignUpAdmin;
