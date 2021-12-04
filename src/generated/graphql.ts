import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Activity = {
  __typename?: 'Activity';
  crag?: Maybe<Crag>;
  date: Scalars['DateTime'];
  duration?: Maybe<Scalars['Int']>;
  iceFall?: Maybe<IceFall>;
  id: Scalars['String'];
  name: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  partners?: Maybe<Scalars['String']>;
  peak?: Maybe<Peak>;
  routes: Array<ActivityRoute>;
  type: Scalars['String'];
  user: User;
};

export type ActivityRoute = {
  __typename?: 'ActivityRoute';
  activity?: Maybe<Activity>;
  ascentType: Scalars['String'];
  date?: Maybe<Scalars['DateTime']>;
  difficulty?: Maybe<Scalars['String']>;
  grade?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  name: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  partner?: Maybe<Scalars['String']>;
  publish: Scalars['String'];
  route: Route;
  stars?: Maybe<Scalars['Float']>;
  user: User;
};

export type Area = {
  __typename?: 'Area';
  country: Country;
  crags: Array<Crag>;
  iceFalls: Array<IceFall>;
  id: Scalars['String'];
  images: Array<Image>;
  name: Scalars['String'];
  nrCrags: Scalars['Int'];
  peaks: Array<Peak>;
};

export type Club = {
  __typename?: 'Club';
  created: Scalars['DateTime'];
  id: Scalars['String'];
  legacy: Scalars['String'];
  members: Array<ClubMember>;
  name: Scalars['String'];
  nrMembers: Scalars['Float'];
  slug: Scalars['String'];
  updated: Scalars['DateTime'];
};

export type ClubMember = {
  __typename?: 'ClubMember';
  admin: Scalars['Boolean'];
  club: Club;
  created: Scalars['DateTime'];
  id: Scalars['String'];
  legacy: Scalars['String'];
  updated: Scalars['DateTime'];
  user: User;
};

export type Comment = {
  __typename?: 'Comment';
  content?: Maybe<Scalars['String']>;
  crag?: Maybe<Crag>;
  created: Scalars['DateTime'];
  iceFall: IceFall;
  id: Scalars['String'];
  images: Array<Image>;
  peak: Peak;
  route?: Maybe<Route>;
  type: Scalars['String'];
  updated: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type ConfirmInput = {
  id: Scalars['String'];
  token: Scalars['String'];
};

export type Country = {
  __typename?: 'Country';
  areas: Array<Area>;
  code: Scalars['String'];
  crags: Array<Crag>;
  iceFalls: Array<IceFall>;
  id: Scalars['String'];
  name: Scalars['String'];
  nrCrags: Scalars['Int'];
  peaks: Array<Peak>;
  slug: Scalars['String'];
};


export type CountryCragsArgs = {
  input?: InputMaybe<FindCragsInput>;
};

export type Crag = {
  __typename?: 'Crag';
  access?: Maybe<Scalars['String']>;
  activities: Array<Activity>;
  area?: Maybe<Area>;
  comments: Array<Comment>;
  country: Country;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  images: Array<Image>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  maxGrade?: Maybe<Scalars['String']>;
  minGrade?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  nrRoutes: Scalars['Int'];
  orientation?: Maybe<Scalars['String']>;
  peak?: Maybe<Peak>;
  routes: Array<Route>;
  sectors: Array<Sector>;
  slug: Scalars['String'];
  status: Scalars['String'];
};

export type CreateActivityInput = {
  cragId?: InputMaybe<Scalars['String']>;
  date: Scalars['DateTime'];
  duration?: InputMaybe<Scalars['Int']>;
  iceFallId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  partners?: InputMaybe<Scalars['String']>;
  peakId?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};

export type CreateActivityRouteInput = {
  ascentType: Scalars['String'];
  date: Scalars['DateTime'];
  difficulty?: InputMaybe<Scalars['String']>;
  grade?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  partner?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  publish: Scalars['String'];
  routeId?: InputMaybe<Scalars['String']>;
  stars?: InputMaybe<Scalars['Float']>;
};

export type CreateAreaInput = {
  countryId: Scalars['String'];
  name: Scalars['String'];
};

export type CreateClubInput = {
  name: Scalars['String'];
};

export type CreateClubMemberByEmailInput = {
  admin: Scalars['Boolean'];
  clubId: Scalars['String'];
  userEmail: Scalars['String'];
};

export type CreateClubMemberInput = {
  admin: Scalars['Boolean'];
  clubId: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateCommentInput = {
  content: Scalars['String'];
  cragId?: InputMaybe<Scalars['String']>;
  iceFallId?: InputMaybe<Scalars['String']>;
  peakId?: InputMaybe<Scalars['String']>;
  routeId?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};

export type CreateCountryInput = {
  code: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type CreateCragInput = {
  access?: InputMaybe<Scalars['String']>;
  areaId?: InputMaybe<Scalars['String']>;
  countryId: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  lon?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  orientation?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  status: Scalars['String'];
};

export type CreateRouteInput = {
  author: Scalars['String'];
  length: Scalars['String'];
  name: Scalars['String'];
  position: Scalars['Float'];
  sectorId: Scalars['String'];
  status: Scalars['String'];
};

export type CreateSectorInput = {
  cragId: Scalars['String'];
  label: Scalars['String'];
  name: Scalars['String'];
  position: Scalars['Float'];
  status: Scalars['String'];
};

export type FindActivitiesInput = {
  cragId?: InputMaybe<Scalars['String']>;
  dateFrom?: InputMaybe<Scalars['DateTime']>;
  dateTo?: InputMaybe<Scalars['DateTime']>;
  orderBy?: InputMaybe<OrderByInput>;
  pageNumber?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Array<Scalars['String']>>;
  userId?: InputMaybe<Scalars['String']>;
};

export type FindActivityRoutesInput = {
  ascentType?: InputMaybe<Array<Scalars['String']>>;
  clubId?: InputMaybe<Scalars['String']>;
  cragId?: InputMaybe<Scalars['String']>;
  dateFrom?: InputMaybe<Scalars['DateTime']>;
  dateTo?: InputMaybe<Scalars['DateTime']>;
  orderBy?: InputMaybe<OrderByInput>;
  pageNumber?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  publish?: InputMaybe<Array<Scalars['String']>>;
  routeId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type FindCountriesInput = {
  hasCrags?: InputMaybe<Scalars['Boolean']>;
  orderBy: OrderByInput;
};

export type FindCragsInput = {
  area?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  minStatus?: InputMaybe<Scalars['String']>;
  routeType?: InputMaybe<Scalars['String']>;
};

export type Grade = {
  __typename?: 'Grade';
  created: Scalars['DateTime'];
  grade: Scalars['Float'];
  id: Scalars['String'];
  includedInCalculation: Scalars['Boolean'];
  isBase: Scalars['Boolean'];
  route: Route;
  updated: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type IceFall = {
  __typename?: 'IceFall';
  access?: Maybe<Scalars['String']>;
  area?: Maybe<Area>;
  comments: Array<Comment>;
  country: Country;
  description?: Maybe<Scalars['String']>;
  difficulty: Scalars['String'];
  height: Scalars['Float'];
  id: Scalars['String'];
  images: Array<Image>;
  name: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  area?: Maybe<Area>;
  comment?: Maybe<Comment>;
  crag?: Maybe<Crag>;
  description?: Maybe<Scalars['String']>;
  extension: Scalars['String'];
  iceFall?: Maybe<IceFall>;
  id: Scalars['String'];
  path: Scalars['String'];
  peak?: Maybe<Peak>;
  route?: Maybe<Route>;
  title?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  confirm: Scalars['Boolean'];
  createActivity: Activity;
  createArea: Area;
  createClub: Club;
  createClubMember: ClubMember;
  createClubMemberByEmail: ClubMember;
  createComment: Comment;
  createCountry: Country;
  createCrag: Crag;
  createRoute: Route;
  createSector: Sector;
  deleteArea: Scalars['Boolean'];
  deleteClub: Scalars['Boolean'];
  deleteClubMember: Scalars['Boolean'];
  deleteComment: Scalars['Boolean'];
  deleteCountry: Scalars['Boolean'];
  deleteCrag: Scalars['Boolean'];
  deleteRoute: Scalars['Boolean'];
  deleteSector: Scalars['Boolean'];
  login: TokenResponse;
  recover: Scalars['Boolean'];
  register: Scalars['Boolean'];
  setPassword: Scalars['Boolean'];
  updateArea: Area;
  updateClub: Club;
  updateComment: Comment;
  updateCountry: Country;
  updateCrag: Crag;
  updateRoute: Route;
  updateSector: Sector;
};


export type MutationConfirmArgs = {
  input: ConfirmInput;
};


export type MutationCreateActivityArgs = {
  input: CreateActivityInput;
  routes: Array<CreateActivityRouteInput>;
};


export type MutationCreateAreaArgs = {
  input: CreateAreaInput;
};


export type MutationCreateClubArgs = {
  createClubInput: CreateClubInput;
};


export type MutationCreateClubMemberArgs = {
  input: CreateClubMemberInput;
};


export type MutationCreateClubMemberByEmailArgs = {
  input: CreateClubMemberByEmailInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput;
};


export type MutationCreateCragArgs = {
  input: CreateCragInput;
};


export type MutationCreateRouteArgs = {
  input: CreateRouteInput;
};


export type MutationCreateSectorArgs = {
  input: CreateSectorInput;
};


export type MutationDeleteAreaArgs = {
  id: Scalars['String'];
};


export type MutationDeleteClubArgs = {
  id: Scalars['String'];
};


export type MutationDeleteClubMemberArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCountryArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCragArgs = {
  id: Scalars['String'];
};


export type MutationDeleteRouteArgs = {
  id: Scalars['String'];
};


export type MutationDeleteSectorArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRecoverArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSetPasswordArgs = {
  input: PasswordInput;
};


export type MutationUpdateAreaArgs = {
  input: UpdateAreaInput;
};


export type MutationUpdateClubArgs = {
  updateClubInput: UpdateClubInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput;
};


export type MutationUpdateCragArgs = {
  input: UpdateCragInput;
};


export type MutationUpdateRouteArgs = {
  input: UpdateRouteInput;
};


export type MutationUpdateSectorArgs = {
  input: UpdateSectorInput;
};

export type OrderByInput = {
  direction: Scalars['String'];
  field: Scalars['String'];
};

export type PaginatedActivities = {
  __typename?: 'PaginatedActivities';
  items: Array<Activity>;
  meta: PaginationMeta;
};

export type PaginatedActivityRoutes = {
  __typename?: 'PaginatedActivityRoutes';
  items: Array<ActivityRoute>;
  meta: PaginationMeta;
};

export type PaginationMeta = {
  __typename?: 'PaginationMeta';
  itemCount: Scalars['Float'];
  pageCount: Scalars['Float'];
  pageNumber: Scalars['Float'];
  pageSize: Scalars['Float'];
};

export type PasswordInput = {
  id: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};

export type Peak = {
  __typename?: 'Peak';
  area?: Maybe<Area>;
  comments: Array<Comment>;
  country: Country;
  crags: Array<Crag>;
  description?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  images: Array<Image>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type Pitch = {
  __typename?: 'Pitch';
  difficulty: Scalars['String'];
  height: Scalars['Float'];
  id: Scalars['String'];
  number: Scalars['Float'];
  route: Route;
};

export type PopularCrag = {
  __typename?: 'PopularCrag';
  crag: Crag;
  nrVisits: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  activity: Activity;
  activityRoutesByClubSlug: PaginatedActivityRoutes;
  club: Club;
  clubBySlug: Club;
  clubs: Array<Club>;
  countries: Array<Country>;
  countryBySlug: Country;
  crag: Crag;
  cragBySlug: Crag;
  crags: Array<Crag>;
  latestImages: Array<Image>;
  latestTicks: Array<ActivityRoute>;
  myActivities: PaginatedActivities;
  myActivityRoutes: PaginatedActivityRoutes;
  myClubs: Array<Club>;
  myCragSummary: Array<ActivityRoute>;
  popularCrags: Array<PopularCrag>;
  profile: User;
  route: Route;
  search: SearchResults;
  user: User;
  users: Array<User>;
};


export type QueryActivityArgs = {
  id: Scalars['String'];
};


export type QueryActivityRoutesByClubSlugArgs = {
  clubSlug: Scalars['String'];
  input?: InputMaybe<FindActivityRoutesInput>;
};


export type QueryClubArgs = {
  id: Scalars['String'];
};


export type QueryClubBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryClubsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryCountriesArgs = {
  input?: InputMaybe<FindCountriesInput>;
};


export type QueryCountryBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryCragArgs = {
  id: Scalars['String'];
};


export type QueryCragBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryCragsArgs = {
  country?: InputMaybe<Scalars['String']>;
};


export type QueryLatestImagesArgs = {
  latest: Scalars['Int'];
};


export type QueryLatestTicksArgs = {
  latest: Scalars['Int'];
};


export type QueryMyActivitiesArgs = {
  input?: InputMaybe<FindActivitiesInput>;
};


export type QueryMyActivityRoutesArgs = {
  input?: InputMaybe<FindActivityRoutesInput>;
};


export type QueryMyCragSummaryArgs = {
  input?: InputMaybe<FindActivityRoutesInput>;
};


export type QueryPopularCragsArgs = {
  dateFrom?: InputMaybe<Scalars['String']>;
  top?: InputMaybe<Scalars['Int']>;
};


export type QueryRouteArgs = {
  id: Scalars['String'];
};


export type QuerySearchArgs = {
  input?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  email: Scalars['String'];
  id?: InputMaybe<Scalars['String']>;
};

export type Rating = {
  __typename?: 'Rating';
  created: Scalars['DateTime'];
  id: Scalars['String'];
  route: Route;
  stars: Scalars['Float'];
  updated: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type RegisterInput = {
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  password: Scalars['String'];
};

export type Role = {
  __typename?: 'Role';
  role: Scalars['String'];
};

export type Route = {
  __typename?: 'Route';
  author?: Maybe<Scalars['String']>;
  comments: Array<Comment>;
  crag: Crag;
  difficulty: Scalars['String'];
  grade?: Maybe<Scalars['Float']>;
  grades: Array<Grade>;
  id: Scalars['String'];
  images: Array<Image>;
  length: Scalars['String'];
  name: Scalars['String'];
  pitches: Array<Pitch>;
  ratings: Array<Rating>;
  sector: Sector;
  status: Scalars['String'];
  type: Scalars['String'];
};

export type SearchResults = {
  __typename?: 'SearchResults';
  comments: Array<Comment>;
  crags: Array<Crag>;
  routes: Array<Route>;
  sectors: Array<Sector>;
  users: Array<User>;
};

export type Sector = {
  __typename?: 'Sector';
  crag: Crag;
  id: Scalars['String'];
  label: Scalars['String'];
  name: Scalars['String'];
  routes: Array<Route>;
  status: Scalars['String'];
};

export type TokenResponse = {
  __typename?: 'TokenResponse';
  token: Scalars['String'];
};

export type UpdateAreaInput = {
  countryId: Scalars['String'];
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateClubInput = {
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateCommentInput = {
  content: Scalars['String'];
  id: Scalars['String'];
};

export type UpdateCountryInput = {
  code?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type UpdateCragInput = {
  access?: InputMaybe<Scalars['String']>;
  areaId?: InputMaybe<Scalars['String']>;
  countryId?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  lat?: InputMaybe<Scalars['Float']>;
  lon?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  orientation?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type UpdateRouteInput = {
  author?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Float']>;
  sectorId?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type UpdateSectorInput = {
  id: Scalars['String'];
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Float']>;
  status?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  clubs: Array<ClubMember>;
  email?: Maybe<Scalars['String']>;
  firstname: Scalars['String'];
  fullName: Scalars['String'];
  gender?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  images: Array<Image>;
  lastname: Scalars['String'];
  roles: Array<Scalars['String']>;
  www?: Maybe<Scalars['String']>;
};

export type CreateClubMutationVariables = Exact<{
  input: CreateClubInput;
}>;


export type CreateClubMutation = { __typename?: 'Mutation', createClub: { __typename?: 'Club', id: string } };

export type UpdateClubMutationVariables = Exact<{
  input: UpdateClubInput;
}>;


export type UpdateClubMutation = { __typename?: 'Mutation', updateClub: { __typename?: 'Club', id: string } };

export type CreateClubMemberByEmailMutationVariables = Exact<{
  input: CreateClubMemberByEmailInput;
}>;


export type CreateClubMemberByEmailMutation = { __typename?: 'Mutation', createClubMemberByEmail: { __typename?: 'ClubMember', id: string } };

export type ActivityEntryQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ActivityEntryQuery = { __typename?: 'Query', activity: { __typename?: 'Activity', id: string, name: string, date: any, type: string, notes?: string | null | undefined, partners?: string | null | undefined, duration?: number | null | undefined, routes: Array<{ __typename?: 'ActivityRoute', difficulty?: string | null | undefined, date?: any | null | undefined, ascentType: string, grade?: number | null | undefined, notes?: string | null | undefined, partner?: string | null | undefined, publish: string, activity?: { __typename?: 'Activity', id: string } | null | undefined, route: { __typename?: 'Route', name: string, id: string, crag: { __typename?: 'Crag', id: string, name: string, slug: string, country: { __typename?: 'Country', slug: string } } } }>, crag?: { __typename?: 'Crag', id: string, name: string, slug: string, country: { __typename?: 'Country', slug: string } } | null | undefined } };

export type ActivityFiltersCragQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ActivityFiltersCragQuery = { __typename?: 'Query', crag: { __typename?: 'Crag', id: string, name: string } };

export type ActivityFiltersRouteQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ActivityFiltersRouteQuery = { __typename?: 'Query', route: { __typename?: 'Route', id: string, name: string } };

export type CreateActivityMutationVariables = Exact<{
  input: CreateActivityInput;
  routes: Array<CreateActivityRouteInput> | CreateActivityRouteInput;
}>;


export type CreateActivityMutation = { __typename?: 'Mutation', createActivity: { __typename?: 'Activity', id: string } };

export type MyActivitiesQueryVariables = Exact<{
  input?: InputMaybe<FindActivitiesInput>;
}>;


export type MyActivitiesQuery = { __typename?: 'Query', myActivities: { __typename?: 'PaginatedActivities', items: Array<{ __typename?: 'Activity', id: string, name: string, date: any, type: string, routes: Array<{ __typename?: 'ActivityRoute', grade?: number | null | undefined }>, crag?: { __typename?: 'Crag', id: string, name: string, slug: string, country: { __typename?: 'Country', slug: string } } | null | undefined }>, meta: { __typename?: 'PaginationMeta', itemCount: number, pageCount: number, pageNumber: number, pageSize: number } } };

export type MyActivityRoutesQueryVariables = Exact<{
  input?: InputMaybe<FindActivityRoutesInput>;
}>;


export type MyActivityRoutesQuery = { __typename?: 'Query', myActivityRoutes: { __typename?: 'PaginatedActivityRoutes', items: Array<{ __typename?: 'ActivityRoute', difficulty?: string | null | undefined, date?: any | null | undefined, ascentType: string, grade?: number | null | undefined, notes?: string | null | undefined, partner?: string | null | undefined, publish: string, activity?: { __typename?: 'Activity', id: string } | null | undefined, route: { __typename?: 'Route', name: string, id: string, crag: { __typename?: 'Crag', id: string, name: string, slug: string, country: { __typename?: 'Country', slug: string } } } }>, meta: { __typename?: 'PaginationMeta', itemCount: number, pageCount: number, pageNumber: number, pageSize: number } } };

export type MyCragSummaryQueryVariables = Exact<{
  input?: InputMaybe<FindActivityRoutesInput>;
}>;


export type MyCragSummaryQuery = { __typename?: 'Query', myCragSummary: Array<{ __typename?: 'ActivityRoute', ascentType: string, route: { __typename?: 'Route', id: string } }> };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { __typename?: 'Query', profile: { __typename?: 'User', id: string, email?: string | null | undefined, roles: Array<string> } };

export type CreateCommentMutationVariables = Exact<{
  input: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'Comment', id: string } };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: boolean };

export type UpdateCommentMutationVariables = Exact<{
  input: UpdateCommentInput;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'Comment', id: string, content?: string | null | undefined } };

export type CountriesTocQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesTocQuery = { __typename?: 'Query', countries: Array<{ __typename?: 'Country', name: string, slug: string, nrCrags: number }> };

export type CragManagementQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type CragManagementQuery = { __typename?: 'Query', crag: { __typename?: 'Crag', slug: string, status: string, orientation?: string | null | undefined, name: string, lon?: number | null | undefined, lat?: number | null | undefined, id: string, description?: string | null | undefined, access?: string | null | undefined, sectors: Array<{ __typename?: 'Sector', id: string, label: string, name: string, status: string }>, area?: { __typename?: 'Area', id: string, name: string } | null | undefined, country: { __typename?: 'Country', name: string, id: string } } };

export type CragsQueryVariables = Exact<{
  country: Scalars['String'];
  input?: InputMaybe<FindCragsInput>;
}>;


export type CragsQuery = { __typename?: 'Query', countryBySlug: { __typename?: 'Country', id: string, name: string, slug: string, code: string, crags: Array<{ __typename?: 'Crag', id: string, slug: string, name: string, nrRoutes: number, orientation?: string | null | undefined, lon?: number | null | undefined, lat?: number | null | undefined, minGrade?: string | null | undefined, maxGrade?: string | null | undefined, country: { __typename?: 'Country', id: string, name: string, slug: string } }>, areas: Array<{ __typename?: 'Area', id: string, name: string }> } };

export type RouteCommentsQueryVariables = Exact<{
  routeId: Scalars['String'];
}>;


export type RouteCommentsQuery = { __typename?: 'Query', route: { __typename?: 'Route', comments: Array<{ __typename?: 'Comment', id: string, type: string, content?: string | null | undefined, updated: any, created: any, user?: { __typename?: 'User', firstname: string, lastname: string } | null | undefined }> } };

export type RouteGradesQueryVariables = Exact<{
  routeId: Scalars['String'];
}>;


export type RouteGradesQuery = { __typename?: 'Query', route: { __typename?: 'Route', id: string, difficulty: string, name: string, grade?: number | null | undefined, length: string, grades: Array<{ __typename?: 'Grade', id: string, grade: number, created: any, updated: any, isBase: boolean, includedInCalculation: boolean, user?: { __typename?: 'User', firstname: string, lastname: string } | null | undefined }> } };

export type RouteQueryVariables = Exact<{
  routeId: Scalars['String'];
}>;


export type RouteQuery = { __typename?: 'Query', route: { __typename?: 'Route', id: string, difficulty: string, name: string, grade?: number | null | undefined, length: string, author?: string | null | undefined, status: string, sector: { __typename?: 'Sector', id: string, name: string, crag: { __typename?: 'Crag', name: string, slug: string, country: { __typename?: 'Country', slug: string, name: string } } }, pitches: Array<{ __typename?: 'Pitch', difficulty: string, number: number, height: number }>, grades: Array<{ __typename?: 'Grade', grade: number, created: any, updated: any, isBase: boolean, includedInCalculation: boolean, user?: { __typename?: 'User', firstname: string, lastname: string } | null | undefined }>, comments: Array<{ __typename?: 'Comment', type: string, content?: string | null | undefined, created: any, updated: any, user?: { __typename?: 'User', fullName: string } | null | undefined }>, images: Array<{ __typename?: 'Image', path: string }> } };

export type ManagementCragFormGetCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type ManagementCragFormGetCountriesQuery = { __typename?: 'Query', countries: Array<{ __typename?: 'Country', id: string, name: string, areas: Array<{ __typename?: 'Area', id: string, name: string }> }> };

export type ManagementCreateCragMutationVariables = Exact<{
  input: CreateCragInput;
}>;


export type ManagementCreateCragMutation = { __typename?: 'Mutation', createCrag: { __typename?: 'Crag', id: string } };

export type ManagementUpdateCragMutationVariables = Exact<{
  input: UpdateCragInput;
}>;


export type ManagementUpdateCragMutation = { __typename?: 'Mutation', updateCrag: { __typename?: 'Crag', id: string } };

export type ManagementGetCragQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ManagementGetCragQuery = { __typename?: 'Query', crag: { __typename?: 'Crag', slug: string, status: string, orientation?: string | null | undefined, name: string, lon?: number | null | undefined, lat?: number | null | undefined, id: string, description?: string | null | undefined, access?: string | null | undefined, sectors: Array<{ __typename?: 'Sector', id: string, label: string, name: string, status: string, routes: Array<{ __typename?: 'Route', type: string, author?: string | null | undefined, difficulty: string, grade?: number | null | undefined, id: string, length: string, name: string, status: string, pitches: Array<{ __typename?: 'Pitch', difficulty: string, height: number, id: string, number: number }> }> }>, area?: { __typename?: 'Area', id: string, name: string } | null | undefined, country: { __typename?: 'Country', name: string, id: string, slug: string } } };

export type ActivityRoutesByClubSlugQueryVariables = Exact<{
  clubSlug: Scalars['String'];
  input?: InputMaybe<FindActivityRoutesInput>;
}>;


export type ActivityRoutesByClubSlugQuery = { __typename?: 'Query', activityRoutesByClubSlug: { __typename?: 'PaginatedActivityRoutes', items: Array<{ __typename?: 'ActivityRoute', date?: any | null | undefined, grade?: number | null | undefined, name: string, ascentType: string, difficulty?: string | null | undefined, id: string, publish: string, user: { __typename?: 'User', id: string, fullName: string }, route: { __typename?: 'Route', id: string, crag: { __typename?: 'Crag', slug: string, name: string, id: string, country: { __typename?: 'Country', slug: string } } } }>, meta: { __typename?: 'PaginationMeta', itemCount: number, pageCount: number, pageNumber: number, pageSize: number } } };

export type UserFullNameQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type UserFullNameQuery = { __typename?: 'Query', user: { __typename?: 'User', fullName: string } };

export type ClubByIdQueryVariables = Exact<{
  clubId: Scalars['String'];
}>;


export type ClubByIdQuery = { __typename?: 'Query', club: { __typename?: 'Club', id: string, slug: string, name: string, members: Array<{ __typename?: 'ClubMember', id: string, admin: boolean, user: { __typename?: 'User', id: string, fullName: string } }> } };

export type ClubBySlugQueryVariables = Exact<{
  clubSlug: Scalars['String'];
}>;


export type ClubBySlugQuery = { __typename?: 'Query', clubBySlug: { __typename?: 'Club', id: string, slug: string, name: string, members: Array<{ __typename?: 'ClubMember', id: string, admin: boolean, user: { __typename?: 'User', id: string, fullName: string } }> } };

export type DeleteClubMemberMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteClubMemberMutation = { __typename?: 'Mutation', deleteClubMember: boolean };

export type DeleteClubMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteClubMutation = { __typename?: 'Mutation', deleteClub: boolean };

export type MyClubsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyClubsQuery = { __typename?: 'Query', myClubs: Array<{ __typename?: 'Club', id: string, slug: string, name: string, nrMembers: number }> };

export type CragBySlugQueryVariables = Exact<{
  crag: Scalars['String'];
}>;


export type CragBySlugQuery = { __typename?: 'Query', cragBySlug: { __typename?: 'Crag', id: string, slug: string, name: string, orientation?: string | null | undefined, lat?: number | null | undefined, lon?: number | null | undefined, access?: string | null | undefined, description?: string | null | undefined, area?: { __typename?: 'Area', id: string, name: string } | null | undefined, country: { __typename?: 'Country', id: string, name: string, slug: string }, sectors: Array<{ __typename?: 'Sector', id: string, name: string, label: string, routes: Array<{ __typename?: 'Route', id: string, name: string, grade?: number | null | undefined, length: string, comments: Array<{ __typename?: 'Comment', id: string }>, pitches: Array<{ __typename?: 'Pitch', difficulty: string, number: number, height: number }> }> }>, comments: Array<{ __typename?: 'Comment', id: string, content?: string | null | undefined, created: any, updated: any, type: string, user?: { __typename?: 'User', id: string, fullName: string } | null | undefined }>, images: Array<{ __typename?: 'Image', id: string, title?: string | null | undefined, path: string }> } };

export type LatestImagesQueryVariables = Exact<{
  latest: Scalars['Int'];
}>;


export type LatestImagesQuery = { __typename?: 'Query', latestImages: Array<{ __typename?: 'Image', path: string, title?: string | null | undefined, user?: { __typename?: 'User', fullName: string } | null | undefined, crag?: { __typename?: 'Crag', name: string, slug: string, country: { __typename?: 'Country', slug: string } } | null | undefined, route?: { __typename?: 'Route', id: string, name: string, crag: { __typename?: 'Crag', name: string, slug: string, country: { __typename?: 'Country', slug: string } } } | null | undefined }> };

export type LatestTicksQueryVariables = Exact<{
  latest: Scalars['Int'];
}>;


export type LatestTicksQuery = { __typename?: 'Query', latestTicks: Array<{ __typename?: 'ActivityRoute', ascentType: string, activity?: { __typename?: 'Activity', date: any, type: string } | null | undefined, route: { __typename?: 'Route', grade?: number | null | undefined, name: string, id: string, crag: { __typename?: 'Crag', name: string, slug: string, country: { __typename?: 'Country', slug: string, name: string } } }, user: { __typename?: 'User', fullName: string, gender?: string | null | undefined } }> };

export type PopularCragsQueryVariables = Exact<{
  dateFrom?: InputMaybe<Scalars['String']>;
  top?: InputMaybe<Scalars['Int']>;
}>;


export type PopularCragsQuery = { __typename?: 'Query', popularCrags: Array<{ __typename?: 'PopularCrag', nrVisits: number, crag: { __typename?: 'Crag', name: string, slug: string, country: { __typename?: 'Country', slug: string } } }> };

export type SearchQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
}>;


export type SearchQuery = { __typename?: 'Query', search: { __typename?: 'SearchResults', crags: Array<{ __typename: 'Crag', name: string, slug: string, nrRoutes: number, orientation?: string | null | undefined, minGrade?: string | null | undefined, maxGrade?: string | null | undefined, country: { __typename?: 'Country', slug: string } }>, routes: Array<{ __typename: 'Route', id: string, name: string, difficulty: string, grade?: number | null | undefined, length: string, crag: { __typename?: 'Crag', name: string, slug: string, country: { __typename?: 'Country', slug: string } } }>, sectors: Array<{ __typename: 'Sector', name: string, crag: { __typename?: 'Crag', name: string, slug: string, country: { __typename?: 'Country', slug: string } } }>, comments: Array<{ __typename: 'Comment', content?: string | null | undefined, created: any, crag?: { __typename?: 'Crag', name: string, slug: string, country: { __typename?: 'Country', slug: string } } | null | undefined, route?: { __typename: 'Route', id: string, name: string, crag: { __typename?: 'Crag', name: string, slug: string, country: { __typename?: 'Country', slug: string } } } | null | undefined, user?: { __typename?: 'User', fullName: string } | null | undefined }>, users: Array<{ __typename: 'User', fullName: string }> } };

export const CreateClubDocument = gql`
    mutation CreateClub($input: CreateClubInput!) {
  createClub(createClubInput: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateClubGQL extends Apollo.Mutation<CreateClubMutation, CreateClubMutationVariables> {
    document = CreateClubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateClubDocument = gql`
    mutation UpdateClub($input: UpdateClubInput!) {
  updateClub(updateClubInput: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateClubGQL extends Apollo.Mutation<UpdateClubMutation, UpdateClubMutationVariables> {
    document = UpdateClubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateClubMemberByEmailDocument = gql`
    mutation CreateClubMemberByEmail($input: CreateClubMemberByEmailInput!) {
  createClubMemberByEmail(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateClubMemberByEmailGQL extends Apollo.Mutation<CreateClubMemberByEmailMutation, CreateClubMemberByEmailMutationVariables> {
    document = CreateClubMemberByEmailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ActivityEntryDocument = gql`
    query ActivityEntry($id: String!) {
  activity(id: $id) {
    id
    name
    date
    type
    notes
    partners
    duration
    routes {
      difficulty
      date
      ascentType
      grade
      notes
      partner
      publish
      activity {
        id
      }
      route {
        crag {
          id
          name
          slug
          country {
            slug
          }
        }
        name
        id
      }
    }
    crag {
      id
      name
      slug
      country {
        slug
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ActivityEntryGQL extends Apollo.Query<ActivityEntryQuery, ActivityEntryQueryVariables> {
    document = ActivityEntryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ActivityFiltersCragDocument = gql`
    query ActivityFiltersCrag($id: String!) {
  crag(id: $id) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ActivityFiltersCragGQL extends Apollo.Query<ActivityFiltersCragQuery, ActivityFiltersCragQueryVariables> {
    document = ActivityFiltersCragDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ActivityFiltersRouteDocument = gql`
    query ActivityFiltersRoute($id: String!) {
  route(id: $id) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ActivityFiltersRouteGQL extends Apollo.Query<ActivityFiltersRouteQuery, ActivityFiltersRouteQueryVariables> {
    document = ActivityFiltersRouteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateActivityDocument = gql`
    mutation CreateActivity($input: CreateActivityInput!, $routes: [CreateActivityRouteInput!]!) {
  createActivity(input: $input, routes: $routes) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateActivityGQL extends Apollo.Mutation<CreateActivityMutation, CreateActivityMutationVariables> {
    document = CreateActivityDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MyActivitiesDocument = gql`
    query MyActivities($input: FindActivitiesInput) {
  myActivities(input: $input) {
    items {
      id
      name
      date
      type
      routes {
        grade
      }
      crag {
        id
        name
        slug
        country {
          slug
        }
      }
    }
    meta {
      itemCount
      pageCount
      pageNumber
      pageSize
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyActivitiesGQL extends Apollo.Query<MyActivitiesQuery, MyActivitiesQueryVariables> {
    document = MyActivitiesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MyActivityRoutesDocument = gql`
    query MyActivityRoutes($input: FindActivityRoutesInput) {
  myActivityRoutes(input: $input) {
    items {
      difficulty
      date
      ascentType
      grade
      notes
      partner
      publish
      activity {
        id
      }
      route {
        crag {
          id
          name
          slug
          country {
            slug
          }
        }
        name
        id
      }
    }
    meta {
      itemCount
      pageCount
      pageNumber
      pageSize
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyActivityRoutesGQL extends Apollo.Query<MyActivityRoutesQuery, MyActivityRoutesQueryVariables> {
    document = MyActivityRoutesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MyCragSummaryDocument = gql`
    query MyCragSummary($input: FindActivityRoutesInput) {
  myCragSummary(input: $input) {
    ascentType
    route {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyCragSummaryGQL extends Apollo.Query<MyCragSummaryQuery, MyCragSummaryQueryVariables> {
    document = MyCragSummaryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ProfileDocument = gql`
    query Profile {
  profile {
    id
    email
    roles
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ProfileGQL extends Apollo.Query<ProfileQuery, ProfileQueryVariables> {
    document = ProfileDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateCommentDocument = gql`
    mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCommentGQL extends Apollo.Mutation<CreateCommentMutation, CreateCommentMutationVariables> {
    document = CreateCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteCommentDocument = gql`
    mutation DeleteComment($id: String!) {
  deleteComment(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteCommentGQL extends Apollo.Mutation<DeleteCommentMutation, DeleteCommentMutationVariables> {
    document = DeleteCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateCommentDocument = gql`
    mutation UpdateComment($input: UpdateCommentInput!) {
  updateComment(input: $input) {
    id
    content
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCommentGQL extends Apollo.Mutation<UpdateCommentMutation, UpdateCommentMutationVariables> {
    document = UpdateCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CountriesTocDocument = gql`
    query CountriesToc {
  countries(
    input: {hasCrags: true, orderBy: {field: "nrCrags", direction: "DESC"}}
  ) {
    name
    slug
    nrCrags
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CountriesTocGQL extends Apollo.Query<CountriesTocQuery, CountriesTocQueryVariables> {
    document = CountriesTocDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CragManagementDocument = gql`
    query CragManagement($id: String!) {
  crag(id: $id) {
    sectors {
      id
      label
      name
      status
    }
    slug
    status
    orientation
    name
    lon
    lat
    id
    description
    access
    area {
      id
      name
    }
    country {
      name
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CragManagementGQL extends Apollo.Query<CragManagementQuery, CragManagementQueryVariables> {
    document = CragManagementDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CragsDocument = gql`
    query Crags($country: String!, $input: FindCragsInput) {
  countryBySlug(slug: $country) {
    id
    name
    slug
    code
    crags(input: $input) {
      id
      slug
      name
      nrRoutes
      orientation
      lon
      lat
      country {
        id
        name
        slug
      }
      minGrade
      maxGrade
    }
    areas {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CragsGQL extends Apollo.Query<CragsQuery, CragsQueryVariables> {
    document = CragsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RouteCommentsDocument = gql`
    query RouteComments($routeId: String!) {
  route(id: $routeId) {
    comments {
      id
      type
      user {
        firstname
        lastname
      }
      content
      updated
      created
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RouteCommentsGQL extends Apollo.Query<RouteCommentsQuery, RouteCommentsQueryVariables> {
    document = RouteCommentsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RouteGradesDocument = gql`
    query RouteGrades($routeId: String!) {
  route(id: $routeId) {
    id
    difficulty
    name
    grade
    length
    grades {
      id
      grade
      user {
        firstname
        lastname
      }
      created
      updated
      isBase
      includedInCalculation
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RouteGradesGQL extends Apollo.Query<RouteGradesQuery, RouteGradesQueryVariables> {
    document = RouteGradesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RouteDocument = gql`
    query Route($routeId: String!) {
  route(id: $routeId) {
    id
    difficulty
    name
    grade
    length
    author
    status
    sector {
      id
      name
    }
    pitches {
      difficulty
      number
      height
    }
    grades {
      grade
      user {
        firstname
        lastname
      }
      created
      updated
      isBase
      includedInCalculation
    }
    comments {
      type
      user {
        fullName
      }
      content
      created
      updated
    }
    images {
      path
    }
    sector {
      name
      crag {
        name
        slug
        country {
          slug
          name
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RouteGQL extends Apollo.Query<RouteQuery, RouteQueryVariables> {
    document = RouteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ManagementCragFormGetCountriesDocument = gql`
    query ManagementCragFormGetCountries {
  countries {
    id
    name
    areas {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ManagementCragFormGetCountriesGQL extends Apollo.Query<ManagementCragFormGetCountriesQuery, ManagementCragFormGetCountriesQueryVariables> {
    document = ManagementCragFormGetCountriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ManagementCreateCragDocument = gql`
    mutation ManagementCreateCrag($input: CreateCragInput!) {
  createCrag(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ManagementCreateCragGQL extends Apollo.Mutation<ManagementCreateCragMutation, ManagementCreateCragMutationVariables> {
    document = ManagementCreateCragDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ManagementUpdateCragDocument = gql`
    mutation ManagementUpdateCrag($input: UpdateCragInput!) {
  updateCrag(input: $input) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ManagementUpdateCragGQL extends Apollo.Mutation<ManagementUpdateCragMutation, ManagementUpdateCragMutationVariables> {
    document = ManagementUpdateCragDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ManagementGetCragDocument = gql`
    query ManagementGetCrag($id: String!) {
  crag(id: $id) {
    sectors {
      id
      label
      name
      status
      routes {
        type
        author
        difficulty
        grade
        id
        length
        name
        status
        pitches {
          difficulty
          height
          id
          number
        }
      }
    }
    slug
    status
    orientation
    name
    lon
    lat
    id
    description
    access
    area {
      id
      name
    }
    country {
      name
      id
      slug
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ManagementGetCragGQL extends Apollo.Query<ManagementGetCragQuery, ManagementGetCragQueryVariables> {
    document = ManagementGetCragDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ActivityRoutesByClubSlugDocument = gql`
    query ActivityRoutesByClubSlug($clubSlug: String!, $input: FindActivityRoutesInput) {
  activityRoutesByClubSlug(clubSlug: $clubSlug, input: $input) {
    items {
      date
      user {
        id
        fullName
      }
      grade
      name
      ascentType
      difficulty
      id
      publish
      route {
        crag {
          country {
            slug
          }
          slug
          name
          id
        }
        id
      }
    }
    meta {
      itemCount
      pageCount
      pageNumber
      pageSize
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ActivityRoutesByClubSlugGQL extends Apollo.Query<ActivityRoutesByClubSlugQuery, ActivityRoutesByClubSlugQueryVariables> {
    document = ActivityRoutesByClubSlugDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserFullNameDocument = gql`
    query UserFullName($userId: String!) {
  user(email: "", id: $userId) {
    fullName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserFullNameGQL extends Apollo.Query<UserFullNameQuery, UserFullNameQueryVariables> {
    document = UserFullNameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ClubByIdDocument = gql`
    query ClubById($clubId: String!) {
  club(id: $clubId) {
    id
    slug
    name
    members {
      id
      admin
      user {
        id
        fullName
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ClubByIdGQL extends Apollo.Query<ClubByIdQuery, ClubByIdQueryVariables> {
    document = ClubByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ClubBySlugDocument = gql`
    query ClubBySlug($clubSlug: String!) {
  clubBySlug(slug: $clubSlug) {
    id
    slug
    name
    members {
      id
      admin
      user {
        id
        fullName
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ClubBySlugGQL extends Apollo.Query<ClubBySlugQuery, ClubBySlugQueryVariables> {
    document = ClubBySlugDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteClubMemberDocument = gql`
    mutation DeleteClubMember($id: String!) {
  deleteClubMember(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteClubMemberGQL extends Apollo.Mutation<DeleteClubMemberMutation, DeleteClubMemberMutationVariables> {
    document = DeleteClubMemberDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteClubDocument = gql`
    mutation DeleteClub($id: String!) {
  deleteClub(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteClubGQL extends Apollo.Mutation<DeleteClubMutation, DeleteClubMutationVariables> {
    document = DeleteClubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MyClubsDocument = gql`
    query MyClubs {
  myClubs {
    id
    slug
    name
    nrMembers
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyClubsGQL extends Apollo.Query<MyClubsQuery, MyClubsQueryVariables> {
    document = MyClubsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CragBySlugDocument = gql`
    query CragBySlug($crag: String!) {
  cragBySlug(slug: $crag) {
    id
    slug
    name
    orientation
    lat
    lon
    access
    description
    area {
      id
      name
    }
    country {
      id
      name
      slug
    }
    sectors {
      id
      name
      label
      routes {
        id
        name
        grade
        length
        comments {
          id
        }
        pitches {
          difficulty
          number
          height
        }
      }
    }
    comments {
      id
      content
      created
      updated
      type
      user {
        id
        fullName
      }
    }
    images {
      id
      title
      path
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CragBySlugGQL extends Apollo.Query<CragBySlugQuery, CragBySlugQueryVariables> {
    document = CragBySlugDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LatestImagesDocument = gql`
    query LatestImages($latest: Int!) {
  latestImages(latest: $latest) {
    path
    title
    user {
      fullName
    }
    crag {
      name
      slug
      country {
        slug
      }
    }
    route {
      id
      name
      crag {
        name
        slug
        country {
          slug
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LatestImagesGQL extends Apollo.Query<LatestImagesQuery, LatestImagesQueryVariables> {
    document = LatestImagesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LatestTicksDocument = gql`
    query LatestTicks($latest: Int!) {
  latestTicks(latest: $latest) {
    activity {
      date
      type
    }
    ascentType
    route {
      grade
      name
      crag {
        name
        country {
          slug
          name
        }
        slug
      }
      id
    }
    user {
      fullName
      gender
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LatestTicksGQL extends Apollo.Query<LatestTicksQuery, LatestTicksQueryVariables> {
    document = LatestTicksDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PopularCragsDocument = gql`
    query PopularCrags($dateFrom: String, $top: Int) {
  popularCrags(dateFrom: $dateFrom, top: $top) {
    nrVisits
    crag {
      name
      slug
      country {
        slug
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PopularCragsGQL extends Apollo.Query<PopularCragsQuery, PopularCragsQueryVariables> {
    document = PopularCragsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SearchDocument = gql`
    query Search($query: String) {
  search(input: $query) {
    crags {
      __typename
      name
      slug
      nrRoutes
      orientation
      minGrade
      maxGrade
      country {
        slug
      }
    }
    routes {
      __typename
      id
      name
      difficulty
      grade
      length
      crag {
        name
        slug
        country {
          slug
        }
      }
    }
    sectors {
      __typename
      name
      crag {
        name
        slug
        country {
          slug
        }
      }
    }
    comments {
      __typename
      content
      crag {
        name
        slug
        country {
          slug
        }
      }
      route {
        __typename
        id
        name
        crag {
          name
          slug
          country {
            slug
          }
        }
      }
      user {
        fullName
      }
      created
    }
    users {
      __typename
      fullName
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SearchGQL extends Apollo.Query<SearchQuery, SearchQueryVariables> {
    document = SearchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const namedOperations = {
  Query: {
    ActivityEntry: 'ActivityEntry',
    ActivityFiltersCrag: 'ActivityFiltersCrag',
    ActivityFiltersRoute: 'ActivityFiltersRoute',
    MyActivities: 'MyActivities',
    MyActivityRoutes: 'MyActivityRoutes',
    MyCragSummary: 'MyCragSummary',
    Profile: 'Profile',
    CountriesToc: 'CountriesToc',
    CragManagement: 'CragManagement',
    Crags: 'Crags',
    RouteComments: 'RouteComments',
    RouteGrades: 'RouteGrades',
    Route: 'Route',
    ManagementCragFormGetCountries: 'ManagementCragFormGetCountries',
    ManagementGetCrag: 'ManagementGetCrag',
    ActivityRoutesByClubSlug: 'ActivityRoutesByClubSlug',
    UserFullName: 'UserFullName',
    ClubById: 'ClubById',
    ClubBySlug: 'ClubBySlug',
    MyClubs: 'MyClubs',
    CragBySlug: 'CragBySlug',
    LatestImages: 'LatestImages',
    LatestTicks: 'LatestTicks',
    PopularCrags: 'PopularCrags',
    Search: 'Search'
  },
  Mutation: {
    CreateClub: 'CreateClub',
    UpdateClub: 'UpdateClub',
    CreateClubMemberByEmail: 'CreateClubMemberByEmail',
    CreateActivity: 'CreateActivity',
    CreateComment: 'CreateComment',
    DeleteComment: 'DeleteComment',
    UpdateComment: 'UpdateComment',
    ManagementCreateCrag: 'ManagementCreateCrag',
    ManagementUpdateCrag: 'ManagementUpdateCrag',
    DeleteClubMember: 'DeleteClubMember',
    DeleteClub: 'DeleteClub'
  }
}