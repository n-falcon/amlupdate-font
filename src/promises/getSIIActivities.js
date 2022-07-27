import { getSIIActivities } from '../services'

export default () => {
  return new Promise((resolve) => {
    getSIIActivities.getSIIActivities()
      .then(response => resolve(response.data))
      .catch(err => console.log(err))
  })
}
