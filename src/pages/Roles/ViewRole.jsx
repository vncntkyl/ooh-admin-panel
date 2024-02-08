/* eslint-disable react/prop-types */
import { Checkbox, Table } from "flowbite-react";
import { useParams } from "react-router-dom";
import { useRoles } from "~/contexts/RoleContext";
import NavigateBack from "~components/NavigateBack";

function ViewRole() {
  const { id } = useParams();
  const { retrieveRole } = useRoles();
  const { role_name, role_description, permissions } = retrieveRole(id);

  const Label = ({ children }) => {
    return (
      <p className="text-xs uppercase font-medium xl:font-bold text-main-300">
        {children}
      </p>
    );
  };
  return (
    <>
      <NavigateBack />
      <div className="flex flex-col gap-4 bg-white p-4 rounded-md shadow-md">
        <div>
          <Label>Role Name</Label>
          <p className="font-semibold uppercase text-lg">{role_name}</p>
        </div>
        <div>
          <Label>Role Description</Label>
          <p>{role_description}</p>
        </div>
        <hr />
        <div>
          <Label>Permissions</Label>
          <Table>
            <Table.Head>
              <Table.HeadCell className="w-1/2">Module</Table.HeadCell>
              <Table.HeadCell>View</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {permissions.map((access) => {
                return Object.keys(access).map((type, typeIndex) => {
                  return typeIndex !== 1 ? (
                    <Table.Row key={type + typeIndex}>
                      <Table.Cell className="capitalize font-semibold text-main-500">
                        {type}
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    Object.keys(access[type]).map((module) => {
                      const panel = access[type][module];
                      return (
                        <Table.Row key={module + typeIndex}>
                          <Table.Cell className="capitalize pl-10 font-semibold text-main-500">
                            {module}
                          </Table.Cell>
                          {["view", "edit", "delete"].map((permission) => {
                            return (
                              <Table.Cell key={permission + "_" + typeIndex}>
                                {panel[permission] !== null ? (
                                  <Checkbox
                                    id={`${module}_${permission}`}
                                    checked={panel[permission]}
                                    onChange={(e) =>
                                      console.log(e.target.checked)
                                    }
                                  />
                                ) : (
                                  "--"
                                )}
                              </Table.Cell>
                            );
                          })}
                        </Table.Row>
                      );
                    })
                  );
                });
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}

export default ViewRole;
