import { Map, useYMaps, Placemark } from "@pbe/react-yandex-maps";
import { useState } from "react";
import { type IGeocodeResult } from "yandex-maps";
import { Flex, Typography } from "antd";
import styled from "styled-components";

type CoordinatesType = Array<number>;

interface IMapClickEvent {
  get: (key: string) => CoordinatesType;
}

interface IAddress {
  location: string;
  route: string;
}

const CardWithGeocodeMap = styled(Flex)`
  width: 100%;
  height: 700px;
  gap: 6px;
`;

const MapWithGeocode = styled(Map)`
  width: 75%;
  border: 1px solid black;
  border-radius: 10px;
  overflow: hidden;
`;

const LocationInfoCard = styled(Flex)`
  width: 25%;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 10px;
`;

const AddressWithCoordinates = styled(Flex)`
  flex-direction: column;
`;

const EmptyAddressMessage = styled(Typography.Title)`
  width: 100%;
  text-align: center;
`;

const center = [55.739172009448396, 52.395032611328105];
const zoom = 12;

const GeocodeMap = () => {
  const [coordinates, setCoordinates] = useState<CoordinatesType | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);

  const formattedCoordinates = coordinates
    ? `${coordinates[0]?.toFixed(6)}, ${coordinates[1]?.toFixed(6)}`
    : null;

  const ymaps = useYMaps(["geocode"]); // координаты

  const handleClickMap = (e: IMapClickEvent) => {
    const coords = e.get("coords");

    if (coords) {
      setCoordinates(coords);
    }

    ymaps
      ?.geocode(coords) // ? стоит, тк ymaps может быть равен null
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

  // Принимает результат обратного геокодирования наших координат из хука ymaps
  function handleGeoResult(result: IGeocodeResult) {
    const firstGeoObject = result.geoObjects.get(0); // первый релевантный объект, который соответствует запросу

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
    <CardWithGeocodeMap>
      <LocationInfoCard>
        {address ? (
          <AddressWithCoordinates>
            <Typography.Text>{`Локация: ${address?.location}`}</Typography.Text>
            <Typography.Text>{`Адрес: ${address?.route}`}</Typography.Text>
            <Typography.Text>{`Координаты: ${formattedCoordinates}`}</Typography.Text>
          </AddressWithCoordinates>
        ) : (
          <EmptyAddressMessage>Выберете точку на карте</EmptyAddressMessage>
        )}
      </LocationInfoCard>

      <MapWithGeocode
        defaultState={{
          center,
          zoom,
        }}
        onClick={(e: IMapClickEvent) => handleClickMap(e)}
      >
        {coordinates && <Placemark geometry={coordinates} />}
      </MapWithGeocode>
    </CardWithGeocodeMap>
  );
};

export default GeocodeMap;
