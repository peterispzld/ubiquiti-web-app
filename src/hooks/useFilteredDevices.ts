import { useSearchParams } from "react-router-dom"
import { Device } from "../types/api"

export const useFilteredDevices = (devices: Device[]) => {
	const [searchParams] = useSearchParams()

  const query = searchParams.get('query')
  const lines = searchParams.get('lines')

  const filteredDevices = devices
    .filter((device) => device.product.name.toLowerCase().includes(query || ''))
    .filter((device) =>
      lines?.length ? lines?.includes(device.line.id) : device,
    )
	
	return { filteredDevices }
}