const mapping: Record<string, string> = {
  companies: 'company',
  rituals: 'ritual',
  'ritual-participants': 'ritual_participant',
  teams: 'team',
  'team-members': 'team_member',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
