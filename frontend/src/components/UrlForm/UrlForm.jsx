import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormField from '../FormField/FormField';

import { validateUrl } from '../../utils/UrlValidator';
import { Typography } from '@mui/material';

const UrlInputSchema = Yup.object().shape({
  url: Yup.string()
    .required('URL is required')
    .test('is-valid-url', 'Invalid URL', value => {
      try {
        validateUrl(value);
        return true;
      } catch {
        return false;
      }
    })
});

const UrlForm = ({ handleSubmit, buttonLabel, endpoint }) => (
  <Formik
    initialValues={{ url: '' }}
    validationSchema={UrlInputSchema}
    onSubmit={(values, actions) => handleSubmit(values, actions, endpoint)}
  >
    {({ isSubmitting }) => (
      <Form>
        <Field
          name="url"
          label="Insert URL"
          type="text"
          component={FormField}
          autoComplete="off"
        />
        <Box display='flex' justifyContent='center' m={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              color: 'white',
              backgroundColor: '#3f51b5',
              padding: '10px 20px',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#303f9f',
              }
            }}
          >
            <Typography variant="button">{buttonLabel}</Typography>
          </Button>
        </Box>
      </Form>
    )}
  </Formik>
);

export default UrlForm;
