import { deleteMonthlyTask } from './delete';
import { fetchMonthlyTask, fetchMonthlyTaskOnSpecificDate } from './fetch';
import { createMonthlyTask } from './create';
import { updateMonthlyTask } from './update';

const MonthlyTaskAction = {
  CREATE: {
    createMonthlyTask,
  },
  DELETE: {
    deleteMonthlyTask,
  },
  UPDATE: {
    updateMonthlyTask,
  },
  FETCH: {
    fetchMonthlyTask,
    fetchMonthlyTaskOnSpecificDate,
  },
};

export default MonthlyTaskAction;
