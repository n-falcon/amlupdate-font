import { itemService } from '../services'

export default (type, body) => {
return new Promise(resolve => {
	itemService.save(type, body)
		.then(response => {
			resolve({ success: true, response: response.data })
		})
})
}
