import { Ability, AbilityBuilder } from '@casl/ability';
import { useAuth } from '../../context/AuthContext';

type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Subjects = 'Publication' | 'Category' | 'User' | 'all';
export type AppAbility = Ability<[Actions, Subjects]>;

/** Returns a memoized CASL Ability for the current user based on their role. */
export function useAbility(): AppAbility {
  const { user } = useAuth();
  const { can, build } = new AbilityBuilder<AppAbility>(Ability);

  if (!user) {
    can('read', 'Publication');
    can('read', 'Category');
    return build();
  }

  switch (user.role) {
    case 'SUPER_ADMIN':
      can('manage', 'all');
      break;
    case 'EDITOR':
      can('create', 'Publication');
      can('read', 'Publication');
      can('update', 'Publication');
      can('delete', 'Publication');
      can('read', 'Category');
      can('read', 'User');
      can('update', 'User');
      break;
    default:
      can('read', 'Publication');
      can('read', 'Category');
  }

  return build();
}
