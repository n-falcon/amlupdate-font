import { SaveParamsClientService } from '../services'

export default (userId, ips) => {
  return new Promise(resolve => {
    SaveParamsClientService.update(userId, ips)
      .then(response => resolve(resolve.data))
  })
}
