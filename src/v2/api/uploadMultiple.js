
import ENV from "@/v2/config/env";
import request from "@/api/request";
export function FILE_UPLOAD_MULTIPLE(data) {
  return request(`${ENV.BASE_API}/api/invoice/common/uploadInvoiceFile`, data, "POST", 3, 'json', 5 * 60 * 1000);
}



export function GET_INCREMENT_FILE(data) {
  return request(`${ENV.BASE_API}/api/invoice/common/getIncrementFile`, data, "get", 2, 'json');
}

export function INCREMENT_FILE_PARSE(data) {
  return request(`${ENV.BASE_API}/api/invoice/common/file/parse`, data, "get", 2, 'json');
}

export function GET_INCREMENTFILE_PATH(data) {
  return request(`${ENV.BASE_API}/api/invoice/common/getIncrementFilePath`, data, "get", 2, 'json');
}