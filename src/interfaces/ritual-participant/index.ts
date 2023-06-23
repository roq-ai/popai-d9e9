import { RitualInterface } from 'interfaces/ritual';
import { TeamMemberInterface } from 'interfaces/team-member';
import { GetQueryInterface } from 'interfaces';

export interface RitualParticipantInterface {
  id?: string;
  ritual_id: string;
  team_member_id: string;
  created_at?: any;
  updated_at?: any;

  ritual?: RitualInterface;
  team_member?: TeamMemberInterface;
  _count?: {};
}

export interface RitualParticipantGetQueryInterface extends GetQueryInterface {
  id?: string;
  ritual_id?: string;
  team_member_id?: string;
}
