import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

const uri = environment.apiUrl;

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
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
