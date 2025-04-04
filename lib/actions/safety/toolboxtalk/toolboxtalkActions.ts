import { createToolboxTalk } from './create';
import {
  fetchCurrentVersionOfAllToolboxTalk,
  getAllVersionsOfToolboxTalk,
  getLatestVersionOfToolboxTalk,
  getNextToolboxTalkVersion,
  getToolboxTalkByVersionAndDoc,
} from './fetch';

const toolboxTalkActions = {
  CREATE: {
    createToolboxTalk,
  },
  FETCH: {
    fetchCurrentVersionOfAllToolboxTalk,
    getLatestVersionOfToolboxTalk,
    getAllVersionsOfToolboxTalk,
    getNextToolboxTalkVersion,
    getToolboxTalkByVersionAndDoc,
  },
  DELETE: {},
  UPDATE: {},
};

export default toolboxTalkActions;
