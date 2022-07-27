import { deleteFileService } from '../services'

export default (id) => {
  return new Promise(resolve => {
    deleteFileService.delete(id)
      .then(response => resolve(response.data))
  })
}
