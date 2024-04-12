import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

// Create a context for services
const ServiceContext = React.createContext();

// Custom hook to access services from the context
export function useServices() {
  return useContext(ServiceContext);
}

// Service provider component
export function ServiceProvider({ children }) {
  // State for alert
  const [alert, setAlert] = useState({
    isOn: false,
    type: "info",
    message: "Sample only",
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Array of conjunction words
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

  // Get role from cookies
  const role = JSON.parse(Cookies.get("role"));

  // Get permissions from role
  const permissions = role.permissions.admin.modules;

  // Function to capitalize text
  const capitalize = (text = "", sep = " ") => {
    const tempText = text.split(sep);
    tempText.forEach((text, index) => {
      if (!conjunctionWords.includes(text)) {
        tempText[index] = text.charAt(0).toUpperCase() + text.slice(1);
      }
    });
    return tempText.join(" ");
  };

  // Function to split text
  const split = (text) => {
    return text.split(" ").join("_");
  };

  // Function to join text
  const join = (text, sep = " ") => {
    return text.split("_").join(sep);
  };

  // Tooltip options
  const tooltipOptions = {
    placement: "top",
    animation: "duration-500",
    arrow: false,
  };

  // Component to check permission
  function CheckPermission({ path, children }) {
    return permissions && permissions[path].view && <>{children}</>;
  }

  // Function to check if any link is viewable
  function isViewable(array) {
    return array.some((link) => {
      return permissions[link]?.view;
    });
  }

  // Function to sort items
  function sortItems(array, key, direction) {
    return array.sort((a, b) => {
      if (direction === "ASC") {
        return a[key].toLowerCase().localeCompare(b[key].toLowerCase());
      } else {
        return b[key].toLowerCase().localeCompare(a[key].toLowerCase());
      }
    });
  }

  // Function to sort by status
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

  // Function to sort by role
  function sortByRole(array, roles, direction) {
    return array.sort((a, b) => {
      const a_role = roles?.find((role) => role.id === a.role)?.role_name;
      const b_role = roles?.find((role) => role.id === b.role)?.role_name;
      return direction === "ASC"
        ? a_role.localeCompare(b_role)
        : b_role.localeCompare(a_role);
    });
  }

  function getInitials(str) {
    if (!str) {
      return "";
    }

    // Split the string into words
    const words = str.split(" ");

    // Get the first letter of each word and convert to uppercase
    const initials = words.map((word) => word.charAt(0).toUpperCase());

    // Join the initials together
    return initials.join("");
  }

  // Values to be provided by the context
  const values = {
    alert,
    loading,
    setLoading,
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
    getInitials,
    progress,
    setProgress,
  };

  // Provide the values to the children components
  return (
    <ServiceContext.Provider value={values}>{children}</ServiceContext.Provider>
  );
}

// PropTypes for ServiceProvider component
ServiceProvider.propTypes = {
  path: PropTypes.string,
  children: PropTypes.node,
};
