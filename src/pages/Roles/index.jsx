import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useRoles } from "~/contexts/RoleContext";
import Title from "~components/Title";
import RoleOptions from "./RoleOptions";
import { Badge, Button, Modal, Table, Tooltip } from "flowbite-react";
import { FaPen, FaTrash } from "react-icons/fa6";
import ViewRole from "./ViewRole";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useServices } from "~/contexts/ServiceContext";
import { MdOutlineRestore, MdPersonOff } from "react-icons/md";
import { useEffect, useState } from "react";

function Roles() {
  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <Title>Roles Management</Title>
        <div className="flex flex-col gap-4">
          <Routes>
            <Route path="/*" element={<Main />} />
            <Route path="/:id" element={<ViewRole />} />
            <Route path="/:id/edit" element={<ViewRole />} />
            <Route path="/add" element={<ViewRole />} />
          </Routes>
        </div>
      </div>
      <RoleModals />
    </>
  );
}

function Main() {
  const { results: roles, setRole, setModule } = useRoles();
  const headers = ["role name", "role description", "status", "actions"];
  const { tooltipOptions, sortItems, sortByStatus } = useServices();

  const [sortedItems, setSortedItems] = useState(null);
  const [key, setKey] = useState("status");
  const [direction, setDirection] = useState("ASC");

  useEffect(() => {
    if (roles) {
      if (roles) {
        const items = [...roles];

        if (key === "status") {
          setSortedItems(sortByStatus(items, direction));
        } else {
          setSortedItems(sortItems(items, key, direction));
        }
      }
    }
  }, [roles, key, direction, roles]);
  return (
    <>
      <RoleOptions
        role_key={key}
        setKey={setKey}
        direction={direction}
        setDirection={setDirection}
      />
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
          {sortedItems &&
            sortedItems?.length !== 0 &&
            sortedItems.map((role, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell className="font-semibold capitalize">
                    {role.status !== "active" ? (
                      <p>{role.role_name}</p>
                    ) : (
                      <Link to={`./${role.id}`}>{role.role_name}</Link>
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-xs xl:text-sm text-slate-500">
                    {role.role_description}
                  </Table.Cell>
                  <Table.Cell align="center">
                    <Badge
                      color={role.status === "active" ? "success" : "failure"}
                      className="w-fit uppercase"
                    >
                      {role.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-evenly">
                      {role.status !== "active" ? (
                        <FaPen className="text-lg text-yellow-200" />
                      ) : (
                        <Tooltip content="Edit" {...tooltipOptions}>
                          <Link to={`./${role.id}/edit`}>
                            <FaPen className="text-lg text-yellow-300" />
                          </Link>
                        </Tooltip>
                      )}
                      {role.status === "active" ? (
                        <Tooltip content="Deactivate" {...tooltipOptions}>
                          <button
                            type="button"
                            onClick={() => {
                              setRole(role);
                              setModule("deactivate");
                            }}
                          >
                            <MdPersonOff className="text-xl text-red-400" />
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Reactivate" {...tooltipOptions}>
                          <button
                            type="button"
                            onClick={() => {
                              setRole(role);
                              setModule("reactivate");
                            }}
                          >
                            <MdOutlineRestore className="text-xl text-green-400" />
                          </button>
                        </Tooltip>
                      )}
                      <Tooltip content="Delete" {...tooltipOptions}>
                        <button
                          type="button"
                          onClick={() => {
                            setRole(role);
                            setModule("delete");
                          }}
                        >
                          <FaTrash className="text-gray-400" />
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

function RoleModals() {
  const { role, setRole, module, updateRoleStatus, doReload } = useRoles();
  const { setAlert } = useServices();
  const navigate = useNavigate();
  const handleStatusUpdate = async (status) => {
    const response = await updateRoleStatus(role.id, status);
    if (response?.success) {
      setRole(null);
      setAlert({
        isOn: true,
        type: "success",
        message: `Role has been successfully ${
          status !== "deleted"
            ? status === "active"
              ? "reactivated"
              : "deactivated"
            : "deleted"
        }`,
      });
      doReload((prevState) => (prevState += 1));
      navigate("/roles");
    } else {
      setAlert({
        isOn: true,
        type: "failure",
        message: `An error occurred. Please try again.`,
      });
    }
  };
  return (
    <Modal
      show={role !== null}
      size={module !== "deactivate" ? "md" : "lg"}
      popup
      dismissible
      onClose={() => setRole(null)}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center flex flex-col items-center gap-2 px-2">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200" />
          {module === "deactivate" ? (
            <>
              <h3 className="mb-1 text-main-500 text-center">
                Are you sure you want to deactivate this role? There are
                currently [X] members assigned to this role.*
              </h3>
              <span className="mb-4 text-red-400 dark:text-red-400 text-sm text-center">
                *Deactivating it will restrict these users&lsquo; access unless
                you assign them a new role.
              </span>
            </>
          ) : module === "reactivate" ? (
            <h3 className="mb-4 text-main-500 text-center">
              Are you sure you want to reactivate this role?
            </h3>
          ) : (
            <h3 className="mb-4 text-main-500 text-center">
              Are you sure you want to delete this role?
            </h3>
          )}
          <div className="flex justify-center gap-4 w-full">
            <Button
              color={/deactivate|delete/.test(module) ? "failure" : "success"}
              onClick={() =>
                handleStatusUpdate(
                  module === "deactivate"
                    ? "inactive"
                    : module === "reactivate"
                    ? "active"
                    : "deleted"
                )
              }
            >
              Yes, proceed
            </Button>
            <Button color="gray" onClick={() => setRole(null)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Roles;
