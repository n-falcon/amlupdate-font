import { UsersService } from '../../../services'

export default () => {
  return new Promise(async resolve => {
    await UsersService.read()
      .then(response => {
        resolve(response.data.records)
      })
  })
}
