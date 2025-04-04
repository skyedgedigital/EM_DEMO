import { deleteMonthlyTask } from './delete';
import { fetchMonthlyTask, fetchMonthlyTaskOnSpecificDate } from './fetch';
import { createMonthlyTask } from './create';
import { updateMonthlyTask, updateMonthlyTaskStatusById } from './update';

const MonthlyTaskAction = {
  CREATE: {
    createMonthlyTask,
  },
  DELETE: {
    deleteMonthlyTask,
  },
  UPDATE: {
    updateMonthlyTask,
    updateMonthlyTaskStatusById,
  },
  FETCH: {
    fetchMonthlyTask,
    fetchMonthlyTaskOnSpecificDate,
  },
};

export default MonthlyTaskAction;
