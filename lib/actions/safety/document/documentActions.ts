import { createDocument } from './create';
import {
  fetchCurrentVersionOfAllDocuments,
  getAllVersionsOfDocument,
  getCurrentDocumentByDocTypeAndCategory,
  getNextVersion,
} from './fetch';

const documentActions = {
  CREATE: {
    createDocument: createDocument,
  },
  FETCH: {
    getNextDocumentVersion: getNextVersion,
    fetchCurrentVersionOfAllDocuments,
    getCurrentDocumentByDocTypeAndCategory,
    getAllVersionsOfDocument,
  },
  DELETE: {},
  UPDATE: {},
};

export default documentActions;
