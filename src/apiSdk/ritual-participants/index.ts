import axios from 'axios';
import queryString from 'query-string';
import { RitualParticipantInterface, RitualParticipantGetQueryInterface } from 'interfaces/ritual-participant';
import { GetQueryInterface } from '../../interfaces';

export const getRitualParticipants = async (query?: RitualParticipantGetQueryInterface) => {
  const response = await axios.get(`/api/ritual-participants${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRitualParticipant = async (ritualParticipant: RitualParticipantInterface) => {
  const response = await axios.post('/api/ritual-participants', ritualParticipant);
  return response.data;
};

export const updateRitualParticipantById = async (id: string, ritualParticipant: RitualParticipantInterface) => {
  const response = await axios.put(`/api/ritual-participants/${id}`, ritualParticipant);
  return response.data;
};

export const getRitualParticipantById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/ritual-participants/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRitualParticipantById = async (id: string) => {
  const response = await axios.delete(`/api/ritual-participants/${id}`);
  return response.data;
};
