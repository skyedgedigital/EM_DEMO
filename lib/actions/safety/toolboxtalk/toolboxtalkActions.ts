import { createToolboxTalk } from './create';
import {
  fetchCurrentVersionOfAllToolboxTalk,
  getAllVersionsOfToolboxTalk,
  getCurrentToolboxTalk,
  getNextToolboxtalkVersion,
} from './fetch';

const toolboxtalkActions = {
  CREATE: {
    createToolboxTalk,
  },
  FETCH: {
    fetchCurrentVersionOfAllToolboxTalk,
    getCurrentToolboxTalk,
    getAllVersionsOfToolboxTalk,
    getNextToolboxtalkVersion,
  },
  DELETE: {},
  UPDATE: {},
};

export default toolboxtalkActions;
