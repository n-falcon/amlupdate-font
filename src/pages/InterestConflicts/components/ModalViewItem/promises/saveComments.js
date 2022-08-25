import saveComments from '../services/saveComments'

export default (formId, title, comments) => {
	return new Promise(resolve => {
		saveComments(formId, title, comments)
			.then(response => resolve({ success: true, data: response.data }))
	})
}
