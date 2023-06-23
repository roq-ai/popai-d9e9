import * as yup from 'yup';

export const ritualParticipantValidationSchema = yup.object().shape({
  ritual_id: yup.string().nullable().required(),
  team_member_id: yup.string().nullable().required(),
});
