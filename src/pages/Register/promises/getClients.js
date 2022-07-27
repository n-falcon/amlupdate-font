import { ClientsService } from '../services'

export default (from, size, filters) => {
  return new Promise(async (resolve, reject) => {
    await ClientsService.read(from, size, filters)
      .then(response => resolve({
        filters: response.data.filters,
        records: response.data.records,
        total: response.data.total
      }))
      .catch(err => reject({ error: true }))
  })
}
