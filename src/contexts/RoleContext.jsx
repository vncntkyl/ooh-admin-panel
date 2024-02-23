import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import useSearch from "~/hooks/useSearch";

import axios from "axios";
import { endpoints, headers } from "./endpoints";

const RoleContext = React.createContext();

export function useRoles() {
  return useContext(RoleContext);
}

export function RoleProvider({ children }) {
  const [roles, setRoles] = useState();
  const [role, setRole] = useState(null);
  const [module, setModule] = useState("");
  const { searchTerm, results } = useSearch(roles);
  const [reload, doReload] = useState(0);
  const retrieveRole = async (id) => {
    try {
      const response = await axios.get(endpoints.roles, {
        params: {
          id: id,
        },
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const retrieveRoles = async () => {
    try {
      const response = await axios.get(endpoints.roles, {
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const createRole = async (data) => {
    try {
      const response = await axios.post(endpoints.roles, data, {
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const updateRole = async (id, data) => {
    try {
      const response = await axios.put(endpoints.roles, data, {
        params: {
          id: id,
        },
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const updateRoleStatus = async (id, status) => {
    try {
      const response = await axios.patch(
        endpoints.roles,
        { status: status },
        {
          params: {
            id: id,
          },
          ...headers,
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const values = {
    role,
    roles,
    results,
    module,
    setRole,
    setRoles,
    doReload,
    setModule,
    searchTerm,
    createRole,
    updateRole,
    retrieveRole,
    retrieveRoles,
    updateRoleStatus,
  };

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveRoles();
      setRoles(response.filter((res) => res.status !== "deleted"));
    };
    setup();
  }, [reload]);
  return <RoleContext.Provider value={values}>{children}</RoleContext.Provider>;
}
RoleProvider.propTypes = {
  children: PropTypes.node,
};
