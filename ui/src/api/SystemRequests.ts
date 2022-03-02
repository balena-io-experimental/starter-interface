import expressApi from 'axios'
import { reactive } from 'vue'

interface internetConnection {
  internet: boolean
}

const apiPathV1 = 'v1/system' as string

export const internetConnectivity = reactive({
  status: false
})

export const system = {
  async checkInternetConnection() {
    await expressApi
      .get<internetConnection>(`${apiPathV1}/internet_check`)
      .then((res) => {
        internetConnectivity.status = res.data.internet
      })
    return internetConnectivity.status
  }
}
