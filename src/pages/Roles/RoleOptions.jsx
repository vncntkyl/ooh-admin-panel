import { Button, TextInput } from "flowbite-react";
import { defaultTextTheme, mainButtonTheme } from "~/misc/themes";
import { useRoles } from "~/contexts/RoleContext";
import { Link } from "react-router-dom";

function RoleOptions() {
  const { searchTerm } = useRoles();
  return (
    <div className="w-full flex items-center justify-between">
      <TextInput
        type="search"
        placeholder="Search"
        className="min-w-[300px]"
        theme={defaultTextTheme}
        onChange={(e) => {
          searchTerm(e.target.value);
        }}
      />
      <Button
        as={Link}
        to="./add"
        color="transparent"
        className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all"
        theme={mainButtonTheme}
      >
        Add Role
      </Button>
    </div>
  );
}

export default RoleOptions;
