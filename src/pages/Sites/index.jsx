import { Table, Tooltip } from "flowbite-react";
import { FaPen, FaTrash } from "react-icons/fa6";
import { Link, Route, Routes } from "react-router-dom";
import { useServices } from "~/contexts/ServiceContext";
import { useSites } from "~/contexts/SiteContext";
import { useFunction } from "~/misc/functions";
import Loader from "~components/Loader";
import Title from "~components/Title";
import SiteInformation from "./SiteInformation";
import { useEffect } from "react";

function Sites() {
  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <Title>Sites Management</Title>
        <div className="flex flex-col gap-4">
          <Routes>
            <Route path="/*" element={<Main />} />
            <Route path="/:id" element={<SiteInformation />} />
            <Route path="/:id/edit" element={<SiteInformation />} />
            <Route path="/add" element={<SiteInformation />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function Main() {
  const { results: sites, setSite, setModule } = useSites();
  const { capitalize } = useFunction();
  const { tooltipOptions } = useServices();
  const headers = ["image", "name", "location", "price", "actions"];

  useEffect(() => {
    setSite(null);
  }, []);
  return (
    <>
      <Table hoverable>
        <Table.Head>
          {headers.map((header, index) => (
            <Table.HeadCell key={index} className="text-main-300">
              {capitalize(header, "_")}
            </Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body>
          {sites && sites?.length !== 0 ? (
            sites.map((site, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell className="max-w-[200px]">
                    {site.imageURL ? (
                      <img
                        src={site.imageURL}
                        alt={`${site.site_code} image not found`}
                        className="w-full"
                      />
                    ) : (
                      <>---</>
                    )}
                  </Table.Cell>
                  <Table.Cell className="max-w-[250px] font-semibold">
                    <Link to={`./${site.site_code}`}>{site.site}</Link>
                  </Table.Cell>
                  <Table.Cell className="text-xs">
                    <p>
                      <span>Area: </span>
                      <span>{site.area}</span>
                    </p>
                    <p>
                      <span>City: </span>
                      <span>{site.city}</span>
                    </p>
                    <p>
                      <span>Region: </span>
                      <span>{site.region}</span>
                    </p>
                    <p>
                      <span>{site.latitude}</span>,{" "}
                      <span>{site.longitude}</span>
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    {Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(site.price || 0)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-evenly">
                      <Tooltip content="Edit" {...tooltipOptions}>
                        <Link to={`./${site.site_code}/edit`}>
                          <FaPen className="text-lg text-yellow-300" />
                        </Link>
                      </Tooltip>
                      <Tooltip content="Delete" {...tooltipOptions}>
                        <button
                          type="button"
                          onClick={() => {
                            setSite(site);
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
            })
          ) : (
            <Table.Row>
              {new Array(headers.length).fill("1rem").map((item, index) => {
                return (
                  <Table.Cell key={index}>
                    <Loader height={item} />
                  </Table.Cell>
                );
              })}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </>
  );
}

export default Sites;
