import { createChalan } from './create';
import { deleteChalanbyChalanNumber } from './delete';
import {
  getAllChalans,
  getChalanByChalanNumber,
  getChalanByEngineerAndWorkOrder,
  getChalansCreatedAWeekBefore,
  getPaginationInformation,
  getAllNonVerifiedChalans,
  getAllVerifiedChalans,
  getAllInvoiceCreatedChalans,
} from './fetch';
import { markChalanAsVerified, updateChalan } from './update';
import { testFunction } from './test';
import { fn } from './calculatePrice';
import { mergeChalans, prepareMergedItems } from './merge';
import {
  checkIfInvoiceExists,
  generateContinuousInvoiceNumber,
} from './invoice';
import { getPhysicalChalansOfInvoice } from './getChalanOfInvoice';
import { getDistinguishedSummaryData } from './summaryPdf';
import { vehicleReport } from './vehicleReport';

const chalanAction = {
  CREATE: {
    createChalan: createChalan,
    createMergeChalan: mergeChalans,
  },
  DELETE: {
    deleteChalan: deleteChalanbyChalanNumber,
  },
  UPDATE: {
    updateChalan: updateChalan,
    markAsVerified: markChalanAsVerified,
  },
  FETCH: {
    getAllChalans: getAllChalans,
    getChalanByChalanNumber: getChalanByChalanNumber,
    getAllChalansCreatedLastSevenDays: getChalansCreatedAWeekBefore,
    getPaginationInformation: getPaginationInformation,
    getChalanByEngineerAndWorkOrder: getChalanByEngineerAndWorkOrder,
    getAllNonVerifiedChalans: getAllNonVerifiedChalans,
    getAllVerifiedChalans: getAllVerifiedChalans,
    getAllInvoiceCreatedChalans: getAllInvoiceCreatedChalans,
    getPhysicalChalansOfInvoice: getPhysicalChalansOfInvoice,
    getLatestInvoiceNumber: generateContinuousInvoiceNumber,
    getSummaryPdfData: getDistinguishedSummaryData,
    vehicleReport: vehicleReport,
  },
  CHECK: {
    checkExistingInvoice: checkIfInvoiceExists,
  },
  TEST: {
    testChalan: testFunction,
    calc: fn,
  },
  PREPARE: {
    prepareMergedItems,
  },
};

export default chalanAction;
