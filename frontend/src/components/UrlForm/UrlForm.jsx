import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import FormField from '../FormField/FormField';
import { validateUrl } from '../../utils/UrlValidator';

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
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            type="submit"
            variant="outlined"
            disabled={isSubmitting}
            sx={{ color: 'black', border: '1px solid black' }}
          >
            {buttonLabel}
          </Button>
        </Box>
      </Form>
    )}
  </Formik>
);

export default UrlForm;