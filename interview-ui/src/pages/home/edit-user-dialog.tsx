import Swal from 'sweetalert2/dist/sweetalert2.js';
import withReactContent from 'sweetalert2-react-content';
import { Formik, Form, FormikProps, FormikErrors } from 'formik';
import { SignUpUser } from '../../types/auth';
import { initialValuesRegister } from '../auth/auth';
import { CustomTextField } from '../../components/input';

interface editUserDialogProps {
  name?: string;
}

const editUserDialog = async (props: editUserDialogProps) => {
  const ReactSwal = withReactContent(Swal);

  let formikRef!: FormikProps<SignUpUser>;

  const result = await ReactSwal.fire({
    title: `do you want to edit ${props.name}?`,
    html: (
      <Formik<SignUpUser>
        innerRef={(ref) => (formikRef = ref)}
        initialValues={initialValuesRegister}
        validate={(values) => {
          const errors: FormikErrors<SignUpUser> = {};
          if (!values.email || !values.firstName || !values.lastName) {
            errors.email = 'Required';
            errors.firstName = 'Required';
            errors.lastName = 'Required';
          }
          return errors;
        }}
        onSubmit={() => {}}>
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
          </Form>
        )}
      </Formik>
    ),
    didOpen: () => {
      Swal.getPopup()!.querySelector('input')?.focus();
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

export default editUserDialog;
