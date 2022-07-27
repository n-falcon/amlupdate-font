import { UserService } from '../services'

const Logout = () => {
  return new Promise((resolve, reject) => {
    UserService.logout()
      .then(response => resolve(response.data))
      .catch(err => reject({ error: true }))
  })
}
export default Logout;
