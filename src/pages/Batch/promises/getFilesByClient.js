import { filesByClientService } from '../services'

export default (from, size, fromDate = '', toDate = '', userId = '', fileName = '', optDates = '') => {
  return new Promise(resolve => {
    filesByClientService.read(from, size, fromDate, toDate, userId, fileName, optDates)
      .then(response => resolve({
        files: response.data.records,
        total: response.data.total
      }))
  })
}
