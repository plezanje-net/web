import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
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
  id: Scalars['String'];
  crag: Crag;
  iceFall: IceFall;
  peak: Peak;
  type: Scalars['String'];
  name: Scalars['String'];
  date: Scalars['DateTime'];
  duration?: Maybe<Scalars['Int']>;
  notes: Scalars['String'];
  partners: Scalars['String'];
  routes: Array<ActivityRoute>;
  user: User;
};

export type ActivityRoute = {
  __typename?: 'ActivityRoute';
  route: Route;
  ascentType: Scalars['String'];
  name: Scalars['String'];
  difficulty?: Maybe<Scalars['String']>;
  grade?: Maybe<Scalars['Float']>;
  date?: Maybe<Scalars['DateTime']>;
  notes?: Maybe<Scalars['String']>;
  user: User;
};

export type Area = {
  __typename?: 'Area';
  id: Scalars['String'];
  name: Scalars['String'];
  crags: Array<Crag>;
  peaks: Array<Peak>;
  iceFalls: Array<IceFall>;
  country: Country;
  images: Array<Image>;
  nrCrags: Scalars['Int'];
};

export type ClubMember = {
  __typename?: 'ClubMember';
  admin: Scalars['Boolean'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['String'];
  type: Scalars['String'];
  user?: Maybe<User>;
  content?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  crag: Crag;
  route: Route;
  iceFall: IceFall;
  peak: Peak;
  images: Array<Image>;
};

export type ConfirmInput = {
  id: Scalars['String'];
  token: Scalars['String'];
};

export type Country = {
  __typename?: 'Country';
  id: Scalars['String'];
  code: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  crags: Array<Crag>;
  areas: Array<Area>;
  peaks: Array<Peak>;
  iceFalls: Array<IceFall>;
  nrCrags: Scalars['Int'];
};


export type CountryCragsArgs = {
  area?: Maybe<Scalars['String']>;
};

export type Crag = {
  __typename?: 'Crag';
  id: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  status: Scalars['Int'];
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  orientation?: Maybe<Scalars['String']>;
  access?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  area?: Maybe<Area>;
  peak?: Maybe<Peak>;
  country: Country;
  sectors: Array<Sector>;
  routes: Array<Route>;
  nrRoutes: Scalars['Int'];
  minGrade?: Maybe<Scalars['String']>;
  maxGrade?: Maybe<Scalars['String']>;
  comments: Array<Comment>;
  images: Array<Image>;
  warnings: Array<Comment>;
  conditions: Array<Comment>;
};

export type CreateActivityInput = {
  date: Scalars['DateTime'];
  name: Scalars['String'];
  type: Scalars['String'];
  duration?: Maybe<Scalars['Int']>;
  notes?: Maybe<Scalars['String']>;
  partners?: Maybe<Scalars['String']>;
  iceFallId?: Maybe<Scalars['String']>;
  cragId?: Maybe<Scalars['String']>;
  peakId?: Maybe<Scalars['String']>;
};

export type CreateActivityRouteInput = {
  name: Scalars['String'];
  ascentType: Scalars['String'];
  publish: Scalars['String'];
  date: Scalars['DateTime'];
  notes?: Maybe<Scalars['String']>;
  partner?: Maybe<Scalars['String']>;
  routeId?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  grade?: Maybe<Scalars['Float']>;
  difficulty?: Maybe<Scalars['String']>;
};

export type CreateAreaInput = {
  name: Scalars['String'];
  countryId: Scalars['String'];
};

export type CreateCommentInput = {
  type: Scalars['String'];
  content: Scalars['String'];
  iceFallId?: Maybe<Scalars['String']>;
  routeId?: Maybe<Scalars['String']>;
  cragId?: Maybe<Scalars['String']>;
  peakId?: Maybe<Scalars['String']>;
};

export type CreateCountryInput = {
  code: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type CreateCragInput = {
  name: Scalars['String'];
  slug: Scalars['String'];
  status: Scalars['Float'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  countryId: Scalars['String'];
  areaId?: Maybe<Scalars['String']>;
};

export type CreateRouteInput = {
  name: Scalars['String'];
  length: Scalars['String'];
  author: Scalars['String'];
  position: Scalars['Float'];
  status: Scalars['Float'];
  sectorId: Scalars['String'];
};

export type CreateSectorInput = {
  name: Scalars['String'];
  label: Scalars['String'];
  position: Scalars['Float'];
  status: Scalars['Float'];
  cragId: Scalars['String'];
};


export type FindActivitiesInput = {
  userId?: Maybe<Scalars['String']>;
  orderBy?: Maybe<OrderByInput>;
  pageNumber?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type FindActivityRoutesInput = {
  userId?: Maybe<Scalars['String']>;
  ascentType?: Maybe<Scalars['String']>;
  orderBy?: Maybe<OrderByInput>;
  pageNumber?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type FindCountriesInput = {
  hasCrags?: Maybe<Scalars['Boolean']>;
  orderBy: OrderByInput;
};

export type Grade = {
  __typename?: 'Grade';
  id: Scalars['String'];
  grade: Scalars['Float'];
  user: User;
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
  route: Route;
};

export type IceFall = {
  __typename?: 'IceFall';
  id: Scalars['String'];
  name: Scalars['String'];
  difficulty: Scalars['String'];
  height: Scalars['Float'];
  access?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  country: Country;
  area?: Maybe<Area>;
  comments: Array<Comment>;
  images: Array<Image>;
};

export type Image = {
  __typename?: 'Image';
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  path: Scalars['String'];
  extension: Scalars['String'];
  area?: Maybe<Area>;
  crag?: Maybe<Crag>;
  route?: Maybe<Route>;
  iceFall?: Maybe<IceFall>;
  comment?: Maybe<Comment>;
  peak?: Maybe<Peak>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCountry: Country;
  updateCountry: Country;
  deleteCountry: Scalars['Boolean'];
  createCrag: Crag;
  updateCrag: Crag;
  deleteCrag: Scalars['Boolean'];
  createSector: Sector;
  updateSector: Sector;
  deleteSector: Scalars['Boolean'];
  createRoute: Route;
  updateRoute: Route;
  deleteRoute: Scalars['Boolean'];
  createArea: Area;
  updateArea: Area;
  deleteArea: Scalars['Boolean'];
  createComment: Comment;
  updateComment: Comment;
  deleteComment: Scalars['Boolean'];
  register: Scalars['Boolean'];
  confirm: Scalars['Boolean'];
  recover: Scalars['Boolean'];
  setPassword: Scalars['Boolean'];
  login: TokenResponse;
  createActivity: Activity;
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput;
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput;
};


export type MutationDeleteCountryArgs = {
  id: Scalars['String'];
};


export type MutationCreateCragArgs = {
  input: CreateCragInput;
};


export type MutationUpdateCragArgs = {
  input: UpdateCragInput;
};


export type MutationDeleteCragArgs = {
  id: Scalars['String'];
};


export type MutationCreateSectorArgs = {
  input: CreateSectorInput;
};


export type MutationUpdateSectorArgs = {
  input: UpdateSectorInput;
};


export type MutationDeleteSectorArgs = {
  id: Scalars['String'];
};


export type MutationCreateRouteArgs = {
  input: CreateRouteInput;
};


export type MutationUpdateRouteArgs = {
  input: UpdateRouteInput;
};


export type MutationDeleteRouteArgs = {
  id: Scalars['String'];
};


export type MutationCreateAreaArgs = {
  input: CreateAreaInput;
};


export type MutationUpdateAreaArgs = {
  input: UpdateAreaInput;
};


export type MutationDeleteAreaArgs = {
  id: Scalars['String'];
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationDeleteCommentArgs = {
  id: Scalars['String'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationConfirmArgs = {
  input: ConfirmInput;
};


export type MutationRecoverArgs = {
  email: Scalars['String'];
};


export type MutationSetPasswordArgs = {
  input: PasswordInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationCreateActivityArgs = {
  routes: Array<CreateActivityRouteInput>;
  input: CreateActivityInput;
};

export type OrderByInput = {
  field: Scalars['String'];
  direction: Scalars['String'];
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
  pageSize: Scalars['Float'];
  pageNumber: Scalars['Float'];
};

export type PasswordInput = {
  id: Scalars['String'];
  token: Scalars['String'];
  password: Scalars['String'];
};

export type Peak = {
  __typename?: 'Peak';
  id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Float']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  area?: Maybe<Area>;
  country: Country;
  crags: Array<Crag>;
  comments: Array<Comment>;
  images: Array<Image>;
};

export type Pitch = {
  __typename?: 'Pitch';
  id: Scalars['String'];
  route: Route;
  number: Scalars['Float'];
  difficulty: Scalars['String'];
  height: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  countryBySlug: Country;
  countries: Array<Country>;
  crag: Crag;
  cragBySlug: Crag;
  crags: Array<Crag>;
  route: Route;
  profile: User;
  users: Array<User>;
  myActivities: PaginatedActivities;
  myActivityRoutes: PaginatedActivityRoutes;
};


export type QueryCountryBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryCountriesArgs = {
  input?: Maybe<FindCountriesInput>;
};


export type QueryCragArgs = {
  id: Scalars['String'];
};


export type QueryCragBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryCragsArgs = {
  country?: Maybe<Scalars['String']>;
};


export type QueryRouteArgs = {
  id: Scalars['String'];
};


export type QueryMyActivitiesArgs = {
  input?: Maybe<FindActivitiesInput>;
};


export type QueryMyActivityRoutesArgs = {
  input?: Maybe<FindActivityRoutesInput>;
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
};

export type Role = {
  __typename?: 'Role';
  role: Scalars['String'];
};

export type Route = {
  __typename?: 'Route';
  id: Scalars['String'];
  name: Scalars['String'];
  difficulty: Scalars['String'];
  grade?: Maybe<Scalars['Float']>;
  length: Scalars['String'];
  author?: Maybe<Scalars['String']>;
  status: Scalars['Int'];
  crag: Crag;
  sector: Sector;
  grades: Array<Grade>;
  pitches: Array<Pitch>;
  comments: Array<Comment>;
  images: Array<Image>;
  warnings: Array<Comment>;
  conditions: Array<Comment>;
};

export type Sector = {
  __typename?: 'Sector';
  id: Scalars['String'];
  name: Scalars['String'];
  label: Scalars['String'];
  status: Scalars['Int'];
  crag: Crag;
  routes: Array<Route>;
};

export type TokenResponse = {
  __typename?: 'TokenResponse';
  token: Scalars['String'];
};

export type UpdateAreaInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  countryId: Scalars['String'];
};

export type UpdateCommentInput = {
  id: Scalars['String'];
  content: Scalars['String'];
};

export type UpdateCountryInput = {
  id: Scalars['String'];
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type UpdateCragInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Float']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  areaId?: Maybe<Scalars['String']>;
};

export type UpdateRouteInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Float']>;
  status?: Maybe<Scalars['Float']>;
  sectorId?: Maybe<Scalars['String']>;
};

export type UpdateSectorInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Float']>;
  status?: Maybe<Scalars['Float']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  www?: Maybe<Scalars['String']>;
  roles: Array<Scalars['String']>;
  clubs: Array<ClubMember>;
  fullName: Scalars['String'];
};

export type CreateActivityMutationVariables = Exact<{
  input: CreateActivityInput;
  routes: Array<CreateActivityRouteInput> | CreateActivityRouteInput;
}>;


export type CreateActivityMutation = (
  { __typename?: 'Mutation' }
  & { createActivity: (
    { __typename?: 'Activity' }
    & Pick<Activity, 'id'>
  ) }
);

export type MyActivitiesQueryVariables = Exact<{
  pageNumber?: Maybe<Scalars['Int']>;
}>;


export type MyActivitiesQuery = (
  { __typename?: 'Query' }
  & { myActivities: (
    { __typename?: 'PaginatedActivities' }
    & { items: Array<(
      { __typename?: 'Activity' }
      & Pick<Activity, 'name' | 'date' | 'type'>
      & { routes: Array<(
        { __typename?: 'ActivityRoute' }
        & Pick<ActivityRoute, 'grade'>
      )> }
    )>, meta: (
      { __typename?: 'PaginationMeta' }
      & Pick<PaginationMeta, 'itemCount' | 'pageCount' | 'pageNumber' | 'pageSize'>
    ) }
  ) }
);

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = (
  { __typename?: 'Query' }
  & { profile: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'roles'>
  ) }
);

export type CreateCommentMutationVariables = Exact<{
  input: CreateCommentInput;
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment: (
    { __typename?: 'Comment' }
    & Pick<Comment, 'id'>
  ) }
);

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteComment'>
);

export type UpdateCommentMutationVariables = Exact<{
  input: UpdateCommentInput;
}>;


export type UpdateCommentMutation = (
  { __typename?: 'Mutation' }
  & { updateComment: (
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'content'>
  ) }
);

export type CountriesTocQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesTocQuery = (
  { __typename?: 'Query' }
  & { countries: Array<(
    { __typename?: 'Country' }
    & Pick<Country, 'name' | 'slug' | 'nrCrags'>
  )> }
);

export type CragBySlugQueryVariables = Exact<{
  crag: Scalars['String'];
}>;


export type CragBySlugQuery = (
  { __typename?: 'Query' }
  & { cragBySlug: (
    { __typename?: 'Crag' }
    & Pick<Crag, 'id' | 'slug' | 'name' | 'lat' | 'lon' | 'access' | 'description'>
    & { area?: Maybe<(
      { __typename?: 'Area' }
      & Pick<Area, 'id' | 'name'>
    )>, country: (
      { __typename?: 'Country' }
      & Pick<Country, 'id' | 'name' | 'slug'>
    ), sectors: Array<(
      { __typename?: 'Sector' }
      & Pick<Sector, 'id' | 'name' | 'label'>
      & { routes: Array<(
        { __typename?: 'Route' }
        & Pick<Route, 'id' | 'name' | 'grade' | 'length'>
      )> }
    )>, comments: Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'content' | 'created'>
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'fullName'>
      )> }
    )>, conditions: Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'content' | 'created'>
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'fullName'>
      )> }
    )>, warnings: Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'content' | 'created'>
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'fullName'>
      )> }
    )>, images: Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'title' | 'path'>
    )> }
  ) }
);

export type CragsQueryVariables = Exact<{
  country: Scalars['String'];
  area?: Maybe<Scalars['String']>;
}>;


export type CragsQuery = (
  { __typename?: 'Query' }
  & { countryBySlug: (
    { __typename?: 'Country' }
    & Pick<Country, 'id' | 'name' | 'slug' | 'code'>
    & { crags: Array<(
      { __typename?: 'Crag' }
      & Pick<Crag, 'id' | 'slug' | 'name' | 'nrRoutes' | 'orientation' | 'lon' | 'lat' | 'minGrade' | 'maxGrade'>
      & { country: (
        { __typename?: 'Country' }
        & Pick<Country, 'id' | 'name' | 'slug'>
      ) }
    )>, areas: Array<(
      { __typename?: 'Area' }
      & Pick<Area, 'id' | 'name'>
    )> }
  ) }
);

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
    query MyActivities($pageNumber: Int) {
  myActivities(input: {pageNumber: $pageNumber}) {
    items {
      name
      date
      type
      routes {
        grade
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
  countries(input: {hasCrags: true, orderBy: {field: "nrCrags", direction: "DESC"}}) {
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
export const CragBySlugDocument = gql`
    query CragBySlug($crag: String!) {
  cragBySlug(slug: $crag) {
    id
    slug
    name
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
      }
    }
    comments {
      id
      content
      created
      user {
        id
        fullName
      }
    }
    conditions {
      id
      content
      created
      user {
        id
        fullName
      }
    }
    warnings {
      id
      content
      created
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
export const CragsDocument = gql`
    query Crags($country: String!, $area: String) {
  countryBySlug(slug: $country) {
    id
    name
    slug
    code
    crags(area: $area) {
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
export const namedOperations = {
  Query: {
    MyActivities: 'MyActivities',
    Profile: 'Profile',
    CountriesToc: 'CountriesToc',
    CragBySlug: 'CragBySlug',
    Crags: 'Crags'
  },
  Mutation: {
    CreateActivity: 'CreateActivity',
    CreateComment: 'CreateComment',
    DeleteComment: 'DeleteComment',
    UpdateComment: 'UpdateComment'
  }
}