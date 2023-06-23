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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRitualParticipantById, updateRitualParticipantById } from 'apiSdk/ritual-participants';
import { Error } from 'components/error';
import { ritualParticipantValidationSchema } from 'validationSchema/ritual-participants';
import { RitualParticipantInterface } from 'interfaces/ritual-participant';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RitualInterface } from 'interfaces/ritual';
import { TeamMemberInterface } from 'interfaces/team-member';
import { getRituals } from 'apiSdk/rituals';
import { getTeamMembers } from 'apiSdk/team-members';

function RitualParticipantEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RitualParticipantInterface>(
    () => (id ? `/ritual-participants/${id}` : null),
    () => getRitualParticipantById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RitualParticipantInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRitualParticipantById(id, values);
      mutate(updated);
      resetForm();
      router.push('/ritual-participants');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RitualParticipantInterface>({
    initialValues: data,
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
            Edit Ritual Participant
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'ritual_participant',
  operation: AccessOperationEnum.UPDATE,
})(RitualParticipantEditPage);
