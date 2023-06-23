import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRitualParticipant } from 'apiSdk/ritual-participants';
import { Error } from 'components/error';
import { ritualParticipantValidationSchema } from 'validationSchema/ritual-participants';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RitualInterface } from 'interfaces/ritual';
import { TeamMemberInterface } from 'interfaces/team-member';
import { getRituals } from 'apiSdk/rituals';
import { getTeamMembers } from 'apiSdk/team-members';
import { RitualParticipantInterface } from 'interfaces/ritual-participant';

function RitualParticipantCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RitualParticipantInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRitualParticipant(values);
      resetForm();
      router.push('/ritual-participants');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RitualParticipantInterface>({
    initialValues: {
      ritual_id: (router.query.ritual_id as string) ?? null,
      team_member_id: (router.query.team_member_id as string) ?? null,
    },
    validationSchema: ritualParticipantValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Ritual Participant
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<RitualInterface>
            formik={formik}
            name={'ritual_id'}
            label={'Select Ritual'}
            placeholder={'Select Ritual'}
            fetcher={getRituals}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<TeamMemberInterface>
            formik={formik}
            name={'team_member_id'}
            label={'Select Team Member'}
            placeholder={'Select Team Member'}
            fetcher={getTeamMembers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'ritual_participant',
  operation: AccessOperationEnum.CREATE,
})(RitualParticipantCreatePage);
