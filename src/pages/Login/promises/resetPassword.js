import { forgotPwdService } from '../services'

export default (username) => {
  return new Promise(resolve => {
    forgotPwdService.create(username)
      .then(response => {
        if (response.data === 'Y') {
          resolve({ success: true })
        } else {
          resolve({ error: true })
        }
      })
  })
}
