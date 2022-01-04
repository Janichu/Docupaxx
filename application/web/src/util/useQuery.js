import { useLocation } from "react-router";

/**
 * useQuery
 * 
 * Creates a query dictionary object from the query in the user's url
 */
export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}
