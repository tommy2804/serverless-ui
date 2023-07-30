import Swal from "sweetalert2/dist/sweetalert2.js";
import withReactContent from "sweetalert2-react-content";
import { Formik, Form, FormikProps, FormikErrors } from "formik";
import { SignUpUser } from "../../types/auth";
import { initialValuesRegister } from "../auth/auth";
import { CustomTextField } from "../../components/input";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface createUserDialogProps {
  showPassword?: boolean;
  handlePasswordToggle: () => void;
}

const createUserDialog = async (props: createUserDialogProps) => {
  const { showPassword, handlePasswordToggle } = props;
  const ReactSwal = withReactContent(Swal);

  let formikRef!: FormikProps<SignUpUser>;

  const result = await ReactSwal.fire({
    title: "Create New User",
    html: (
      <Formik<SignUpUser>
        innerRef={(ref) => (formikRef = ref)}
        initialValues={initialValuesRegister}
        validate={(values) => {
          const errors: FormikErrors<SignUpUser> = {};
          if (
            !values.email ||
            !values.password ||
            !values.firstName ||
            !values.lastName
          ) {
            errors.email = "Required";
            errors.password = "Required";
            errors.firstName = "Required";
            errors.lastName = "Required";
          }
          return errors;
        }}
        onSubmit={() => {}}
      >
        {({ values, errors, handleChange, handleBlur }) => (
          <Form>
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
                  onClick={handlePasswordToggle} // Use the handlePasswordToggle prop here
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              }
            />
          </Form>
        )}
      </Formik>
    ),
    didOpen: () => {
      Swal.getPopup()!.querySelector("input")?.focus();
    },
    preConfirm: async () => {
      await formikRef.submitForm();
      if (formikRef.isValid) {
        return formikRef.values;
      } else {
        Swal.showValidationMessage(JSON.stringify(formikRef.errors));
        return false;
      }
    },
  });

  return result;
};

export default createUserDialog;
