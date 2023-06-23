import axios from 'axios';
import queryString from 'query-string';
import { RitualInterface, RitualGetQueryInterface } from 'interfaces/ritual';
import { GetQueryInterface } from '../../interfaces';

export const getRituals = async (query?: RitualGetQueryInterface) => {
  const response = await axios.get(`/api/rituals${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRitual = async (ritual: RitualInterface) => {
  const response = await axios.post('/api/rituals', ritual);
  return response.data;
};

export const updateRitualById = async (id: string, ritual: RitualInterface) => {
  const response = await axios.put(`/api/rituals/${id}`, ritual);
  return response.data;
};

export const getRitualById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/rituals/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRitualById = async (id: string) => {
  const response = await axios.delete(`/api/rituals/${id}`);
  return response.data;
};
