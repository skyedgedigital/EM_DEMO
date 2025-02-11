import { createToolboxTalk } from './create';
import {
  fetchCurrentVersionOfAllToolboxTalk,
  getAllVersionsOfToolboxTalk,
  getCurrentToolboxTalk,
  getNextToolboxTalkVersion,
} from './fetch';

const toolboxTalkActions = {
  CREATE: {
    createToolboxTalk,
  },
  FETCH: {
    fetchCurrentVersionOfAllToolboxTalk,
    getCurrentToolboxTalk,
    getAllVersionsOfToolboxTalk,
    getNextToolboxTalkVersion,
  },
  DELETE: {},
  UPDATE: {},
};

export default toolboxTalkActions;
