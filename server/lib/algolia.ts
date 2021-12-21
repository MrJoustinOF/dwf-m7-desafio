import algoliasearch from "algoliasearch";
import { ALGOLIA_APP_ID, ALGOLIA_API_KEY } from "../config";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const algoliaIndex = client.initIndex("pets");

export { algoliaIndex };
