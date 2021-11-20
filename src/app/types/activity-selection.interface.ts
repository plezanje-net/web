import { Crag, Route } from 'src/generated/graphql';

export default interface ActivitySelection {
  crag: Crag;
  routes: Route[];
}
