import { Map, useYMaps, Placemark, Panorama } from "@pbe/react-yandex-maps";
import { useState } from "react";
import { type IGeocodeResult } from "yandex-maps";
import { Divider, Flex, Typography } from "antd";
import { FrownOutlined } from "@ant-design/icons";
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
  height: 500px;

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

  padding: 6px;
`;

const AddressWithCoordinates = styled(Flex)`
  flex-direction: column;
`;

const InfoWithPanoramaWrapper = styled(Flex)`
  width: 100%;
  height: 100%;
`;

const EmptyAddressMessage = styled(Typography.Title)`
  width: 100%;
  text-align: center;
`;

const PanoramaStyled = styled(Panorama)`
  width: 100%;
  height: 100%;

  /* margin: 6px 0; */
  border-radius: 10px;

  overflow: hidden;
`;

const NonPanoramaWrapper = styled(Flex)`
  width: 100%;
  height: 100%;

  font-size: 16px;
  text-align: center;

  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-radius: 10px;
  border: 1px solid grey;

  background-color: #f0f0f0;
  color: #999;
`;

const center = [55.739172009448396, 52.395032611328105];
const zoom = 12;

const GeocodeMap = () => {
  const [coordinates, setCoordinates] = useState<CoordinatesType | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [hasPanorama, setHasPanorama] = useState<boolean>(false);

  const formattedCoordinates = coordinates
    ? `${coordinates[0]?.toFixed(6)}, ${coordinates[1]?.toFixed(6)}`
    : null;

  const ymaps = useYMaps(["geocode"]); // координаты

  const handleClickMap = (e: IMapClickEvent) => {
    const coords = e.get("coords");

    if (coords) {
      setCoordinates(coords);
    }

    //Для того, чтобы панорама обновлялась
    ymaps?.panorama
      .locate(coords)
      .then((panorama) => {
        setHasPanorama(!!panorama.length); // с помощью !! переворачиваем в булевое значение
        console.log("panorama", panorama.length);
      })
      .catch((error) => {
        console.log("Ошибка при поиске панорамы", error);
        setHasPanorama(false);
      });

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
          <InfoWithPanoramaWrapper vertical>
            <AddressWithCoordinates>
              <Typography.Text>{`Локация: ${address?.location}`}</Typography.Text>
              <Typography.Text>{`Адрес: ${address?.route}`}</Typography.Text>
              <Typography.Text>{`Координаты: ${formattedCoordinates}`}</Typography.Text>
            </AddressWithCoordinates>
            <Divider />
            {hasPanorama && coordinates ? (
              <PanoramaStyled
                key={coordinates?.join(",")}
                defaultPoint={coordinates ?? undefined}
              />
            ) : (
              <NonPanoramaWrapper>
                <FrownOutlined style={{ fontSize: "100px"}} />
                <Typography.Title>Панорама не найдена</Typography.Title>
              </NonPanoramaWrapper>
            )}
          </InfoWithPanoramaWrapper> // В PanoramaStyled если coordinates = null, будем выводить undefined
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
