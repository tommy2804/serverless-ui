import React from 'react';
import { Formik } from 'formik';
import { loginSchema, initialValuesLogin } from './auth';
import { Box, Button, Grid, IconButton, Link, Typography } from '@mui/material';
import { CustomTextField } from '../../components/input';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SignInUser } from '../../types/auth';

interface SignInProps {
  onSubmit?: (values: SignInUser) => void;
  showPassword: boolean;
  handlePasswordToggle: () => void;
  handleIsLogin: () => void;
  onSignin: (val: SignInUser) => void;
}

const SignInAdmin: React.FC<SignInProps> = ({
  showPassword,
  handlePasswordToggle,
  handleIsLogin,
  onSignin,
}) => {
  return (
    <div className="auth-container">
      <Formik initialValues={initialValuesLogin} validationSchema={loginSchema} onSubmit={() => {}}>
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}>
              <Typography component="h1" variant="h5">
                Log in
              </Typography>
              <Typography paddingTop={'1rem'} color={'GrayText'} component="text" variant="body2">
                Enter Your credentials to access your account
              </Typography>

              <button className="google-contain rmv-default">
                <img className="google-img" src={'/google-logo.png'} alt="drive" />
                <p>Log in with Google</p>
              </button>
              {/* or line */}
              <div className="or-line">
                <div className="or-line__line"></div>
                <span className="or-text">{'OR'}</span>
                <div className="or-line__line"></div>
              </div>

              <Box component="form" noValidate onSubmit={() => {}} sx={{ mt: 1 }}>
                <CustomTextField
                  margin="normal"
                  variant="outlined"
                  placeholder="adminUser@gmail.com"
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
                  type={showPassword ? 'text' : 'password'}
                  iconComponent={
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handlePasswordToggle}
                      edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  }
                />

                <Button
                  onClick={() => onSignin(values)}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 3, backgroundColor: '#6638f0' }}>
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Button onClick={handleIsLogin} sx={{ color: '#6638f0' }} variant="outlined">
                      {"Don't have an account? Sign Up"}
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

export default SignInAdmin;
