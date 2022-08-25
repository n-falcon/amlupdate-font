import { portalService } from "../services";

export default (userId) => {
  return new Promise((resolve) => {
    portalService
      .getUsersRespTareas(userId)
      .then((response) => resolve({ success: true, data: response.data }));
  });
};
