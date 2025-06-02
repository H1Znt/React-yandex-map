import { Map } from "@pbe/react-yandex-maps";
import styled from "styled-components";

const MapStyled = styled(Map)`
  width: 100%;
  height: 700px;
`;

const GeocodeMap = () => {
  return (
    <MapStyled
      defaultState={{
        center: [55.739172009448396, 52.395032611328105],
        zoom: 12,
      }}
    />
  );
};

export default GeocodeMap;
