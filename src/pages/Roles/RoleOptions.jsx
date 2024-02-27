import { Button, Dropdown, TextInput, Tooltip } from "flowbite-react";
import { defaultTextTheme, mainButtonTheme } from "~/misc/themes";
import { useRoles } from "~/contexts/RoleContext";
import { Link } from "react-router-dom";
import { useFunction } from "~/misc/functions";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import PropTypes from "prop-types";
import classNames from "classnames";

function RoleOptions({ role_key, setKey, direction, setDirection }) {
  const headers = ["role_name", "status"];
  const { searchTerm } = useRoles();
  const { capitalize } = useFunction();
  return (
    <div className="w-full flex items-center gap-4">
      <TextInput
        type="search"
        placeholder="Search"
        className="min-w-[300px]"
        theme={defaultTextTheme}
        onChange={(e) => {
          searchTerm(e.target.value);
        }}
      />
      <Dropdown color="light" label={`Sort by: ${capitalize(role_key, "_")}`}>
        {headers.map((header) => (
          <Dropdown.Item key={header} onClick={() => setKey(header)}>
            {capitalize(header, "_")}
          </Dropdown.Item>
        ))}
      </Dropdown>
      <div className="flex">
        {[
          { to: "ASC", label: "Ascending", Icon: FaArrowUpLong },
          { to: "DESC", label: "Descending", Icon: FaArrowDownLong },
        ].map((dir) => {
          const { to, label, Icon } = dir;

          return (
            <Tooltip content={label} key={dir.to} arrow={false}>
              <button
                className={classNames(
                  "transition-all",
                  direction === to ? "text-main text-xl" : "text-gray-400"
                )}
                onClick={() => setDirection(to)}
              >
                <Icon />
              </button>
            </Tooltip>
          );
        })}
      </div>
      <Button
        as={Link}
        to="./add"
        color="transparent"
        className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all ml-auto"
        theme={mainButtonTheme}
      >
        Add Role
      </Button>
    </div>
  );
}
RoleOptions.propTypes = {
  role_key: PropTypes.string,
  setKey: PropTypes.func,
  direction: PropTypes.string,
  setDirection: PropTypes.func,
};

export default RoleOptions;
