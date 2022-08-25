import getUser from './getUser'
import createUser from './createUser'
import forgotUser from './forgotUser'
import getUserById from './getUserById'
import getDomain from './getDomain'
import getEstadoTareasUser from './getEstadoTareasUser'
import getUsersRespTareas from "./getUsersRespTareas"
import changePassword from "./changePassword"
import deleteDeclarations from "./deleteDeclarations"

export const getUserPromise = getUser
export const createUserPromise = createUser
export const forgotUserPromise = forgotUser
export const getUserByIdPromise = getUserById
export const getDomainPromise = getDomain
export const getEstadoTareasUserPromise = getEstadoTareasUser
export const getUsersRespTareasPromise = getUsersRespTareas
export const changePasswordPromise = changePassword
export const deleteDeclarationsPromise = deleteDeclarations
