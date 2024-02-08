import { Link, Route, Routes } from "react-router-dom";
import { RoleProvider, useRoles } from "~/contexts/RoleContext";
import Title from "~components/Title";
import RoleOptions from "./RoleOptions";
import { Table, Tooltip } from "flowbite-react";
import { FaUserMinus, FaUserPen } from "react-icons/fa6";
import { FaUserCog } from "react-icons/fa";
import ViewRole from "./ViewRole";

function Roles() {
  return (
    <RoleProvider>
      <div className="w-full flex flex-col gap-2">
        <Title>Roles Management</Title>
        <div className="flex flex-col gap-4">
          <Routes>
            <Route path="/*" element={<Main />} />
            <Route path="/:id" element={<ViewRole />} />
            <Route path="/:id/edit" element={<>Edit Role</>} />
            <Route path="/add" element={<>Add Role</>} />
          </Routes>
        </div>
      </div>
    </RoleProvider>
  );
}

function Main() {
  const { results: roles } = useRoles();
  const headers = ["role name", "role description", "actions"];
  const tooltipOptions = {
    placement: "left",
    animation: "duration-500",
    arrow: false,
  };
  return (
    <>
      <RoleOptions />
      <Table hoverable>
        <Table.Head>
          {headers.map((header, index) => (
            <Table.HeadCell
              key={index}
              align="center"
              className="text-main-300"
            >
              {header}
            </Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body>
          {roles.map((role, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell className="font-semibold capitalize">
                  <Link to={`./${role.role_name}`}>{role.role_name}</Link>
                </Table.Cell>
                <Table.Cell className="text-xs xl:text-sm text-slate-500">
                  {role.role_description}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-evenly">
                    <Tooltip content="Permissions" {...tooltipOptions}>
                      <Link to={`./${role.role_name}`}>
                        <FaUserCog className="text-lg" />
                      </Link>
                    </Tooltip>
                    <Tooltip content="Edit" {...tooltipOptions}>
                      <Link to={`./${role.role_name}/edit`}>
                        <FaUserPen className="text-lg text-yellow-300" />
                      </Link>
                    </Tooltip>
                    <Tooltip content="Delete" {...tooltipOptions}>
                      <button>
                        <FaUserMinus className="text-lg text-red-500" />
                      </button>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}

export default Roles;
