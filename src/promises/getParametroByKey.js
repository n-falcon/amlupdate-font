import { UsersService } from '../services'

export default (key) => {
  return new Promise((resolve, reject) => {
    UsersService.getParametroByKey(key)
      .then(response => resolve(response.data))
      .catch(err => console.log(err))
  })
}
