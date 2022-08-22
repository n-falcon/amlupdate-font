import { consultasService } from '../services'

export default (mes) => {
  return new Promise(async (resolve, reject) => {
    await consultasService.consultas(mes)
      .then(response => resolve(response.data))
      .then(err => reject({ error: true }))
  })
}
