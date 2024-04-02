import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useSearch from "~/hooks/useSearch";
import { endpoints, headers } from "./endpoints";
import axios from "axios";

const SiteContext = React.createContext();

export function useSites() {
  return useContext(SiteContext);
}

export function SiteProvider({ children }) {
  const [sites, setSites] = useState();
  const [site, setSite] = useState(null);
  const [module, setModule] = useState("");
  const { searchTerm, results } = useSearch(sites);
  const [reload, doReload] = useState(0);

  const retrieveSites = async () => {
    try {
      const response = await axios.get(endpoints.sites, {
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const retrieveSite = async (id) => {
    try {
      const response = await axios.get(endpoints.sites, {
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
  const insertSite = async (data) => {};
  const updateSite = async (id, data) => {};
  const deleteSite = async (id) => {};

  const values = {
    site,
    sites,
    results,
    module,
    setSite,
    setSites,
    doReload,
    setModule,
    searchTerm,
    insertSite,
    updateSite,
    deleteSite,
    retrieveSite,
    retrieveSites,
  };

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveSites();
      setSites(response);
    };
    setup();
  }, [reload]);

  return <SiteContext.Provider value={values}>{children}</SiteContext.Provider>;
}

SiteProvider.PropTypes = {
  children: PropTypes.node,
};
