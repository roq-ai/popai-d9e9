import * as yup from 'yup';

export const ritualValidationSchema = yup.object().shape({
  name: yup.string().required(),
  type: yup.string().required(),
  team_id: yup.string().nullable().required(),
});
