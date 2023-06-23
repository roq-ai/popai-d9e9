import { RitualParticipantInterface } from 'interfaces/ritual-participant';
import { TeamInterface } from 'interfaces/team';
import { GetQueryInterface } from 'interfaces';

export interface RitualInterface {
  id?: string;
  name: string;
  type: string;
  team_id: string;
  created_at?: any;
  updated_at?: any;
  ritual_participant?: RitualParticipantInterface[];
  team?: TeamInterface;
  _count?: {
    ritual_participant?: number;
  };
}

export interface RitualGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  type?: string;
  team_id?: string;
}
