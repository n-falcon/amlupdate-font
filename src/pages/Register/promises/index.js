import getClients from './getClients'
import getClientDetail from './getClientDetail'
import getClientHistoryMonitoreo from './getClientHistoryMonitoreo'
import getClientTree from './getClientTree'
import getDetailFalsoPositivo from './getDetailFalsoPositivo'
import validateForm from './validateForm'
import saveRegisterClient from './saveRegisterClient'
import uploadClients from './uploadClients'
import saveDDAValidated from './saveDDAValidated'
import sendFormC57 from './sendFormC57'
import getHistoryMonitoreoClient from './getHistoryMonitoreoClient'
import updateFalsoPositivo from './updateFalsoPositivo'
import getDJObjectsFalsePositive from './getDJObjectsFalsePositive'
import getAreas from './getAreas'
import getGrupos from './getGrupos'
import getCategories from './getCategories'
import bajaClientes from './bajaClientes'
import uploadRelated from './uploadRelated'
import updateRisk from './updateRisk'
import getFicha from './getFicha'
import saveComments from './saveComments'
import getUbosCtrl from './getUbosCtrl'
import savePeriodicity from './savePeriodicity'

export const getClientsPromise = getClients
export const getClientDetailPromise = getClientDetail
export const getClientHistoryMonitoreoPromise = getClientHistoryMonitoreo
export const getClientTreePromise = getClientTree
export const getDetailFalsoPositivoPromise = getDetailFalsoPositivo
export const saveRegisterClientPromise = saveRegisterClient
export const uploadClientsPromise = uploadClients
export const validateFormPromise = validateForm
export const saveDDAValidatedPromise = saveDDAValidated
export const sendFormC57Promise = sendFormC57
export const getHistoryMonitoreoClientPromise = getHistoryMonitoreoClient
export const updateFalsoPositivoPromise = updateFalsoPositivo
export const getDJObjectsFalsePositivePromise = getDJObjectsFalsePositive
export const getAreasPromise = getAreas
export const getGruposPromise = getGrupos
export const getCategoriesPromise = getCategories
export const bajaClientesPromise = bajaClientes
export const uploadRelatedPromise = uploadRelated
export const updateRiskPromise = updateRisk;
export const getFichaPromise = getFicha;
export const saveCommentsPromise = saveComments;
export const getUbosCtrlPromise = getUbosCtrl;
export const savePeriodicityPromise = savePeriodicity;
