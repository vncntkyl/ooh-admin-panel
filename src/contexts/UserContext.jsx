import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import useSearch from "~/hooks/useSearch";

import axios from "axios";
import { endpoints, headers } from "./endpoints";

const UserContext = React.createContext();

export function useUsers() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState();
  const [user, setUser] = useState(null);
  const [module, setModule] = useState("");
  const { searchTerm, results } = useSearch(users);
  const [reload, doReload] = useState(0);
  const retrieveUser = async (id) => {
    try {
      const response = await axios.get(endpoints.users, {
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
  const retrieveUsers = async () => {
    try {
      const response = await axios.get(endpoints.users, {
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const createUser = async (data) => {
    try {
      const response = await axios.post(endpoints.users, data, {
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const updateUser = async (id, data) => {
    try {
      const response = await axios.put(endpoints.users, data, {
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
  const updateUserStatus = async (id, key, status) => {
    try {
      const response = await axios.patch(
        endpoints.users,
        { [key]: status },
        {
          params: {
            id: id,
            key: key,
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
    user,
    users,
    results,
    module,
    setUser,
    setUsers,
    doReload,
    setModule,
    searchTerm,
    createUser,
    updateUser,
    retrieveUser,
    retrieveUsers,
    updateUserStatus,
  };

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveUsers();
      setUsers(response.filter((res) => res.status !== "deleted"));
    };
    setup();
  }, [reload]);
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
UserProvider.propTypes = {
  children: PropTypes.node,
};
