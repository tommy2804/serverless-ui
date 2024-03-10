export enum ExpirationType {
  UNLIMITED = 'unlimited',
  DATE = 'date',
}

export enum EventsLimitType {
  UNLIMITED = 'unlimited',
  NUMBER = 'number',
}

export enum Permission {
  CREATE_EVENTS = 'create-events',
  MANAGE_USERS = 'manage-users',
  MANAGE_EVENTS = 'manage-events',
  MANAGE_ORGANIZATION = 'manage-organization',
  ALL_PERMISSIONS = 'all-permissions',
}

export interface CreateUserDto {
  username: string;
  email: string;
  permissions: Permission[];
  expirationType: ExpirationType;
  expiration?: string;
  eventsLimitType: EventsLimitType;
  eventsLimit?: number;
  role: string;
}

export interface UpdateUserDto {
  username: string;
  permissions?: Permission[];
  expirationType?: ExpirationType;
  expiration?: string;
  eventsLimitType?: EventsLimitType;
  eventsLimit?: number;
  role?: string;
}

export interface GiftEventResponse {
  root: string;
  organization: string;
  user: string;
  tokensUsed: number;
  status: string;
  id: number;
  name: string;
  tokens: number;
  tokensLeft?: number;
}

export interface UserResponse {
  email: string;
  eventsLimit: number;
  eventsLimitType: EventsLimitType;
  expiration: string;
  expirationType: ExpirationType;
  username: string;
  role: string;
  status: string;
  id: string;
  eventsCreated: [];
  permissions: Permission[];
  organization?: string;
  root_user?: string;
  root?: boolean;
  created_on?: string;
}
export interface PostUsersResponse {
  user: UserResponse;
  error: boolean;
  message: string;
  success: boolean;
  reason?: string;
}
export interface GetUsersResponse {
  users: UserResponse[];
  giftEvents: GiftEventResponse[];
}

export interface UsersPageStatistics {
  success: boolean;
  countPhotos: number;
  countEvents: number;
}

export enum Actions {
  CREATE_EVENT = 'CREATE_EVENT',
  DELETE_EVENT = 'DELETE_EVENT',
  CREATE_USER = 'CREATE_USER',
  DELETE_USER = 'DELETE_USER',
  UPDATE_USER = 'UPDATE_USER',
  CREATE_ORGANIZATION = 'CREATE_ORGANIZATION',
  UPDATE_ORGANIZATION_SETTINGS = 'UPDATE_ORGANIZATION_SETTINGS',
}

export interface IActivity {
  id: number;
  username: string;
  organization: string;
  action: Actions;
  resource?: string;
}

export interface ActivitiesResponse {
  activities: IActivity[];
}

export interface CreateOrganizationDto {
  email: string;
  eventName: string;
  tokens: number;
}

export interface ContactDetailsDto {
  message: string;
  subject: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  username?: string;
}
