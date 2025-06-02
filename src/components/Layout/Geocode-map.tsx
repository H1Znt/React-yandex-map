import { Map } from "@pbe/react-yandex-maps";
import styled from "styled-components";

const MapStyled = styled(Map)`
  width: 100%;
  height: 700px;
`;

const center = [55.739172009448396, 52.395032611328105];
const zoom = 12;

const GeocodeMap = () => {

  const handleClickMap = () => {
    console.log("click map")
  }

  return (
    <MapStyled
      defaultState={{
        center,
        zoom,
      }}
      onClick={handleClickMap}
    />
  );
};

export default GeocodeMap;
