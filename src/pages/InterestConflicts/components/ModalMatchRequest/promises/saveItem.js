import { itemService } from '../services'

export default (body) => {
return new Promise(resolve => {
	itemService.save(body)
		.then(response => {
			resolve({ success: true, response: response.data })
		})
})
}
