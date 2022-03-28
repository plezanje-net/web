import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';
import * as Sentry from '@sentry/angular';
import { GraphQLError } from 'graphql';

const uri = environment.apiUrl;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error: GraphQLError) => {
      if (error.message != 'Unauthorized Exception') {
        Sentry.captureMessage(error.message);
      }
    });
  }
  if (networkError) {
    Sentry.captureMessage(networkError.message);
  }
});

const retryLink = new RetryLink({
  delay: {
    initial: 500,
  },
});

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: ApolloLink.from([errorLink, retryLink, httpLink.create({ uri })]),
    cache: new InMemoryCache({
      typePolicies: {
        Crag: {
          fields: {
            comments: {
              merge(existing, incoming) {
                return incoming;
              },
            },
            nrRoutes: {
              keyArgs: ['$input'],
            },
          },
        },
        Club: {
          fields: {
            members: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
        Query: {
          fields: {
            myClubs: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'none',
      },
      query: {
        errorPolicy: 'none',
      },
      mutate: {
        errorPolicy: 'none',
        update: (cache) => cache.evict({}),
      },
    },
  };
}

@NgModule({
  imports: [ApolloModule],
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
