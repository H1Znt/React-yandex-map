import { YMaps } from "@pbe/react-yandex-maps"
import GeocodeMap from "./components/Layout/Geocode-map"
import config from "./config/config.json"

//load: "package.full" 

function App() {
  return (
    <YMaps query={{apikey: config.YANDEX_API_KEY}}>
      <GeocodeMap />
    </YMaps>
  )
}

export default App
