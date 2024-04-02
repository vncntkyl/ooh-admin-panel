/* eslint-disable react/prop-types */
import { FileInput, Label, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSites } from "~/contexts/SiteContext";
import { useFunction } from "~/misc/functions";
import Title from "~components/Title";
import MapPicker from "./MapPicker";

function SiteInformation() {
  const { id } = useParams();
  const { retrieveSite } = useSites();
  const [site, setSite] = useState();
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
  });
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [center, setCenter] = useState(null);
  const isEditable = /edit|add/.test(window.location.pathname);
  const details = [
    "segments",
    "type",
    "price",
    "board_facing",
    "facing",
    "access_type",
  ];
  const location = ["area", "city", "region"];

  const handleChange = (e) => {
    setSite((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const onFileChange = (evt) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Access image contents from reader result
      const mediaContent = e.target.result;
      setSite((info) => {
        return {
          ...info,
          imageURL: mediaContent,
        };
      });
      setFile(evt.target.files[0]);
    };
    reader.readAsDataURL(evt.target.files[0]);
  };
  useEffect(() => {
    const setup = async () => {
      if (id) {
        const response = await retrieveSite(id);
        setSite(response);
        let dimensions = response.size;
        dimensions = dimensions.match(/\d+/g);
        setDimensions({
          length: dimensions[0],
          width: dimensions[1],
        });
        setCenter({
          lat: parseFloat(response.latitude),
          lng: parseFloat(response.longitude),
        });
      } else {
        setSite({
          name: "",
          site_owner: "",
          size: "",
          segments: "",
          type: "",
          price: "",
          board_facing: "N/A",
          facing: "N/A",
          access_type: "N/A",
          imageURL: null,
          area: "",
          city: "",
          region: "",
          latitude: "",
          longitude: "",
          ideal_view: "",
        });
      }
    };
    setup();
  }, [id]);
  return (
    site && (
      <div className="bg-white p-4 px-8 flex flex-col gap-4 shadow-lg">
        <Title>{site.name}</Title>
        <form className="flex flex-col gap-4" encType="multipart/form-data">
          <div className="flex flex-col gap-1">
            {site.imageURL && (
              <img src={site.imageURL} alt="" className="w-full xl:w-1/3" />
            )}
            {isEditable && (
              <>
                <Label htmlFor="file" value="Billboard Photo" />
                <FileInput id="file" accept=".webp" onChange={onFileChange} />
              </>
            )}
          </div>
          <p className="font-bold uppercase">Basic Information</p>
          <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-4">
            <FormGroup
              isEditable={isEditable}
              site={site}
              item="name"
              onChange={handleChange}
            />
            <FormGroup
              isEditable={isEditable}
              site={site}
              item="site_owner"
              onChange={handleChange}
            />
            <MultiFieldFormGroup
              isEditable={isEditable}
              site={dimensions}
              items={["length", "width"]}
              name="size"
              onChange={(e) => {
                setDimensions((dim) => {
                  return {
                    ...dim,
                    [e.target.id]: e.target.value,
                  };
                });
              }}
            />
            {details.map((detail) => {
              return (
                <FormGroup
                  key={detail}
                  isEditable={isEditable}
                  site={site}
                  item={detail}
                  onChange={handleChange}
                />
              );
            })}
          </div>
          <p className="font-bold uppercase">Location Information</p>
          <div className="grid grid-cols-2 grid-rows-4 grid-flow-col gap-4">
            {location.map((detail) => {
              return (
                <FormGroup
                  key={detail}
                  isEditable={isEditable}
                  site={site}
                  item={detail}
                  onChange={handleChange}
                />
              );
            })}
            <MultiFieldFormGroup
              isEditable={isEditable}
              site={site}
              items={["latitude", "longitude"]}
              name="coordinates"
              onChange={handleChange}
            />
            {id && center ? (
              <MapPicker
                isEditable={isEditable}
                center={center}
                setCenter={setCenter}
                onChange={setAddress}
                item={address}
              />
            ) : (
              <MapPicker
                isEditable={isEditable}
                center={{
                  lat: 14.556289599266941,
                  lng: 121.00485772896641,
                }}
                setCenter={setCenter}
                onChange={setAddress}
                item={address}
              />
            )}
          </div>
        </form>
      </div>
    )
  );
}
const FormGroup = ({ isEditable, site, item, onChange }) => {
  const { capitalize } = useFunction();
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={item} className="whitespace-nowrap w-1/4">
        {capitalize(item, "_")}
      </Label>
      {isEditable ? (
        <TextInput
          id={item}
          value={site[item]}
          className="w-full"
          required
          onChange={onChange}
        />
      ) : (
        <p className="p-2 w-full">
          {item !== "price"
            ? site[item]
            : Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(site[item])}
        </p>
      )}
    </div>
  );
};

const MultiFieldFormGroup = ({ isEditable, site, name, items, onChange }) => {
  const { capitalize } = useFunction();
  return (
    <div className="flex items-center gap-4">
      <Label className="whitespace-nowrap w-1/4">
        {capitalize(name, "_")} {name === "size" && "(in feet)"}
      </Label>
      {isEditable ? (
        items.map((item) => {
          return (
            <TextInput
              id={item}
              key={item}
              value={site[item]}
              className="w-1/2"
              required
              onChange={onChange}
            />
          );
        })
      ) : (
        <p className="p-2 w-full">
          {name === "size"
            ? [
                ...items.map((item) => {
                  return site[item] + "ft";
                }),
              ].join(" x ")
            : [
                ...items.map((item) => {
                  return site[item];
                }),
              ].join(", ")}
        </p>
      )}
    </div>
  );
};
export default SiteInformation;
