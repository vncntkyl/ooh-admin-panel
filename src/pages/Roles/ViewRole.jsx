/* eslint-disable react/prop-types */
import { Button, Checkbox, Table, TextInput, Textarea } from "flowbite-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useRoles } from "~/contexts/RoleContext";
import NavigateBack from "~components/NavigateBack";
import {
  MdIndeterminateCheckBox,
  MdDisabledByDefault,
  MdModeEdit,
} from "react-icons/md";
import { RiCheckboxFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useServices } from "~/contexts/ServiceContext";
import { roleTemplate } from "~/misc/templates";

function ViewRole() {
  const { id } = useParams();
  const {
    retrieveRole,
    setRole: toggleRole,
    updateRole,
    doReload,
    createRole,
  } = useRoles();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const actions = ["view", "add", "edit", "delete"];
  const isEditing = /edit|add/.test(location.pathname);
  const navigate = useNavigate();
  const { setAlert } = useServices();

  useEffect(() => {
    const setup = async () => {
      let response = roleTemplate;
      if (id) {
        response = await retrieveRole(id);
      }
      setRole(response);
    };
    setup();
  }, [id, retrieveRole]);

  const handleChange = (e) => {
    setRole((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const handleUpdateRole = async () => {
    const tempRole = { ...role };
    const ID = tempRole.id;
    delete tempRole.id;
    const response = await updateRole(ID, tempRole);

    if (response?.success) {
      setAlert({
        isOn: true,
        type: "success",
        message: "Role information updated successfully",
      });
      doReload((prevState) => (prevState += 1));

      navigate(`/roles/${role.id}`);
    }
  };
  const handleAddRole = async () => {
    const response = await createRole(role);
    if (response?.success) {
      setAlert({
        isOn: true,
        type: "success",
        message: "New role has been created successfully",
      });
      doReload((prevState) => (prevState += 1));

      navigate(`/roles/${response.role_id}`);
    }
  };

  const Label = ({ children }) => {
    return (
      <p className="text-xs uppercase font-medium xl:font-bold text-main-300">
        {children}
      </p>
    );
  };
  return (
    role && (
      <>
        <NavigateBack to={"/roles"} />
        <div className="relative flex flex-col gap-4 bg-white p-4 rounded-md shadow-md">
          <div className="flex flex-col gap-2">
            {isEditing ? (
              <>
                <Label>Role Name</Label>
                <TextInput
                  id="role_name"
                  value={role.role_name}
                  className="w-fit"
                  onChange={handleChange}
                />
              </>
            ) : (
              <p className="font-semibold uppercase text-lg">
                {role.role_name}
              </p>
            )}
            {isEditing ? (
              <>
                <Label>Description</Label>
                <Textarea
                  id="role_description"
                  className="w-full max-w-sm lg:max-w-lg resize-none"
                  value={role.role_description}
                  onChange={handleChange}
                  color="gray"
                />
              </>
            ) : (
              <p className="indent-6">{role.role_description}</p>
            )}
          </div>
          <div className="absolute top-0 right-0 p-4 flex items-center gap-4">
            {!isEditing ? (
              <>
                <Link
                  to={`/roles/${role.id}/edit`}
                  className="flex items-center gap-2 text-sm bg-yellow-100 text-yellow-600 p-2.5 px-4 rounded-lg font-semibold"
                >
                  <MdModeEdit />
                  Edit Role
                </Link>
                {role.role_name !== "superadmin" && (
                  <Button
                    color="transparent"
                    className="bg-red-100 text-red-600"
                    onClick={() => toggleRole(role)}
                  >
                    Deactivate Role
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  color="transparent"
                  className="bg-green-200 text-green-600"
                  onClick={() =>
                    location.pathname.includes("edit")
                      ? handleUpdateRole()
                      : handleAddRole()
                  }
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
          <hr />
          <div className="flex flex-col gap-4">
            <Label>Permissions</Label>
            <Table>
              <Table.Head>
                <Table.HeadCell className="w-1/2">Module</Table.HeadCell>
                <Table.HeadCell align="center">View</Table.HeadCell>
                <Table.HeadCell align="center">Add</Table.HeadCell>
                <Table.HeadCell align="center">Edit</Table.HeadCell>
                <Table.HeadCell align="center">Delete</Table.HeadCell>
                {isEditing && (
                  <Table.HeadCell align="center">All</Table.HeadCell>
                )}
              </Table.Head>
              <Table.Body className="divide-y">
                {Object.keys(role.permissions).map((acc) => {
                  const accesses = role.permissions[acc];
                  return Object.keys(accesses).map((type, typeIndex) => {
                    if (type === "access") {
                      return (
                        <Table.Row key={typeIndex}>
                          <Table.Cell className="capitalize font-bold text-main-500">
                            {acc}
                          </Table.Cell>
                          <Table.Cell align="center">
                            {isEditing ? (
                              <Checkbox
                                value={acc}
                                checked={accesses.access}
                                onChange={(e) => {
                                  const updatedRole = { ...role };
                                  const { permissions } = updatedRole;
                                  permissions[acc].access = e.target.checked;

                                  setRole(updatedRole);
                                }}
                              />
                            ) : accesses.access ? (
                              <RiCheckboxFill className="text-lg text-green-400" />
                            ) : (
                              <MdDisabledByDefault className="text-lg text-red-400" />
                            )}
                          </Table.Cell>
                        </Table.Row>
                      );
                    } else {
                      const { access, modules } = accesses;
                      return Object.keys(modules).map((module, modIndex) => {
                        return (
                          <Table.Row key={modIndex}>
                            <Table.Cell className="capitalize pl-14 font-semibold text-main-500">
                              {module}
                            </Table.Cell>
                            {actions.map((action) => {
                              const panel = modules[module];
                              return (
                                <Table.Cell
                                  align="center"
                                  key={action + "_" + modIndex}
                                >
                                  {panel?.[action] !== undefined ? (
                                    isEditing ? (
                                      <Checkbox
                                        value={module}
                                        checked={
                                          !access ? false : panel[action]
                                        }
                                        disabled={!access}
                                        className="disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        onChange={(e) => {
                                          const updatedRole = { ...role };
                                          const { permissions } = updatedRole;
                                          const { modules } = permissions[acc];
                                          modules[module][action] =
                                            e.target.checked;

                                          setRole(updatedRole);
                                        }}
                                      />
                                    ) : access ? (
                                      panel[action] ? (
                                        <RiCheckboxFill className="text-lg text-green-400" />
                                      ) : (
                                        <MdDisabledByDefault className="text-lg text-red-400" />
                                      )
                                    ) : (
                                      <MdDisabledByDefault className="text-lg text-red-400" />
                                    )
                                  ) : (
                                    <MdIndeterminateCheckBox className="text-lg text-gray-400 cursor-not-allowed" />
                                  )}
                                </Table.Cell>
                              );
                            })}
                            {isEditing && acc === "admin" && (
                              <Table.Cell align="center">
                                <Checkbox
                                  value={module}
                                  checked={Object.values(modules[module]).every(
                                    (perm) => perm === true
                                  )}
                                  disabled={!access}
                                  className="disabled:bg-gray-300 disabled:cursor-not-allowed"
                                  onChange={(e) => {
                                    const module = e.target.value;
                                    const isChecked = e.target.checked;
                                    const updatedRole = { ...role };
                                    const { permissions } = updatedRole;
                                    const { modules } = permissions[acc];
                                    modules[module] = {
                                      view: isChecked,
                                      add: isChecked,
                                      edit: isChecked,
                                      delete: isChecked,
                                    };

                                    setRole(updatedRole);
                                  }}
                                />
                              </Table.Cell>
                            )}
                          </Table.Row>
                        );
                      });
                    }
                  });
                })}
              </Table.Body>
            </Table>
          </div>
        </div>
      </>
    )
  );
}

export default ViewRole;
