import { DetectIpService } from '../services'

export default () => {
  return new Promise(resolve => {
    DetectIpService.read()
      .then(response => resolve(response.data))
  })
}
