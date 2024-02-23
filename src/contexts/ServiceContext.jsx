import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

const ServiceContext = React.createContext();

export function useServices() {
  return useContext(ServiceContext);
}

export function ServiceProvider({ children }) {
  const [alert, setAlert] = useState({
    isOn: false,
    type: "info",
    message: "Sample only",
  });
  const conjunctionWords = [
    "and",
    "but",
    "or",
    "nor",
    "for",
    "so",
    "yet",
    "although",
    "because",
    "since",
    "unless",
    "while",
    "to",
    "at",
    "on",
    "off",
    "in",
    "of",
  ];
  const role = JSON.parse(Cookies.get("role"));
  const permissions = role.permissions.admin.modules;
  const capitalize = (text = "", sep = " ") => {
    const tempText = text.split(sep);
    tempText.forEach((text, index) => {
      if (!conjunctionWords.includes(text)) {
        tempText[index] = text.charAt(0).toUpperCase() + text.slice(1);
      }
    });
    return tempText.join(" ");
  };
  const split = (text) => {
    return text.split(" ").join("_");
  };
  const join = (text, sep = " ") => {
    return text.split("_").join(sep);
  };
  const tooltipOptions = {
    placement: "top",
    animation: "duration-500",
    arrow: false,
  };

  function CheckPermission({ path, children }) {
    return permissions && permissions[path].view && <>{children}</>;
  }

  function isViewable(array) {
    return array.some((link) => {
      return permissions[link]?.view;
    });
  }
  function sortItems(array, key, direction) {
    return array.sort((a, b) => {
      if (direction === "ASC") {
        return a[key].toLowerCase().localeCompare(b[key].toLowerCase());
      } else {
        return b[key].toLowerCase().localeCompare(a[key].toLowerCase());
      }
    });
  }
  function sortByStatus(array, direction) {
    return array.sort((a, b) => {
      if (a.status === "active" && b.status === "inactive") {
        return direction === "ASC" ? -1 : 1;
      }
      if (a.status === "inactive" && b.status === "active") {
        return direction === "ASC" ? 1 : -1;
      }
      return 0;
    });
  }

  function sortByRole(array, roles, direction) {
    return array.sort((a, b) => {
      const a_role = roles?.find((role) => role.id === a.role)?.role_name;
      const b_role = roles?.find((role) => role.id === b.role)?.role_name;
      return direction === "ASC"
        ? a_role.localeCompare(b_role)
        : b_role.localeCompare(a_role);
    });
  }

  const values = {
    alert,
    setAlert,
    capitalize,
    split,
    join,
    tooltipOptions,
    CheckPermission,
    isViewable,
    sortItems,
    sortByStatus,
    sortByRole,
  };
  return (
    <ServiceContext.Provider value={values}>{children}</ServiceContext.Provider>
  );
}
ServiceProvider.propTypes = {
  path: PropTypes.string,
  children: PropTypes.node,
};
