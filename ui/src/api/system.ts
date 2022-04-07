import expressApi from 'axios'
import { reactive } from 'vue'

interface internetConnection {
  internet: boolean
}

const apiPathV1 = 'v1/system' as string

export const internetConnectivity = reactive({
  status: undefined as boolean | undefined
})

export const system = {
  async checkInternetConnection() {
    const response = await expressApi.get<internetConnection>(
      `${apiPathV1}/internet_check`
    )

    internetConnectivity.status = response.data.internet
    return internetConnectivity.status
  }
}
