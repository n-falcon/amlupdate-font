import apiConfig from '../config/api'
import { apiRequestorHelper } from '../helpers'

const indices = () => {

	return ({
		getIndices: () => {
			return apiRequestorHelper({
				url: apiConfig.url + '/getIndices',
				method: 'post'
			})
		},
		getUpdateIndexes: (name) => {
			return apiRequestorHelper({
				url: apiConfig.url + `/getUpdateIndexes?indice=${name}`,
				method: 'post'
			})
		}
	})
}

export default indices;
