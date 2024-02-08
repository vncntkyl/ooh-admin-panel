import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import useSearch from "~/hooks/useSearch";

import { sampleRoles } from "./__tests__/testRoles";

const RoleContext = React.createContext();

export function useRoles() {
  return useContext(RoleContext);
}

export function RoleProvider({ children }) {
  const [roles, setRoles] = useState(sampleRoles);
  const { searchTerm, results } = useSearch(roles);

  const retrieveRole = (id) => {
    return roles.find((role) => role.role_name === id);
  };
  const updateRolePermission = () => {
    
  }

  const values = {
    roles,
    results,
    setRoles,
    searchTerm,
    retrieveRole,
  };

  return <RoleContext.Provider value={values}>{children}</RoleContext.Provider>;
}
RoleProvider.propTypes = {
  children: PropTypes.node,
};
