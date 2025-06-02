import { YMaps } from "@pbe/react-yandex-maps"
import GeocodeMap from "./components/Layout/Geocode-map"

function App() {
  return (
    <YMaps>
      <GeocodeMap />
    </YMaps>
  )
}

export default App
