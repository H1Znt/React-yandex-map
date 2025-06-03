import { Map, useYMaps, Placemark } from "@pbe/react-yandex-maps";
import { useState } from "react";
import { type IGeocodeResult } from "yandex-maps";
import styled from "styled-components";

type CoordinatesType = Array<number>;

interface IMapClickEvent {
  get: (key: string) => CoordinatesType;
}

interface IAddress {
  location: string;
  route: string;
}

const MapStyled = styled(Map)`
  width: 100%;
  height: 700px;
`;

const center = [55.739172009448396, 52.395032611328105];
const zoom = 12;

const GeocodeMap = () => {
  const [coordinates, setCoordinates] = useState<CoordinatesType | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);

  const ymaps = useYMaps(["geocode"]);

  const handleClickMap = (e: IMapClickEvent) => {
    const coords = e.get("coords");

    if (coords) {
      setCoordinates(coords);
    }

    ymaps
      ?.geocode(coords)
      .then((result) => {
        const foundAddress = handleGeoResult(result);
        console.log("handleGeoResult", foundAddress);
        if (foundAddress) setAddress(foundAddress);
      })
      .catch((error: unknown) => {
        console.log("Ошибка геокодирования", error);
        setAddress(null);
      });

    console.log("click map", e.get("coords"));
  };

  function handleGeoResult(result: IGeocodeResult) {
    const firstGeoObject = result.geoObjects.get(0); // релевантный объект, который соответствует запросу

    if (firstGeoObject) {
      const properties = firstGeoObject.properties; // извлекаем из него свойства

      const location = String(properties.get("description", {}));
      const route = String(properties.get("name", {}));

      const foundAddress = {
        location,
        route,
      };

      return foundAddress;
    }
  }

  return (
    <MapStyled
      defaultState={{
        center,
        zoom,
      }}
      onClick={(e: IMapClickEvent) => handleClickMap(e)}
    >
      {coordinates && <Placemark geometry={coordinates} />}
    </MapStyled>
  );
};

export default GeocodeMap;
