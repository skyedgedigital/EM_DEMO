'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import Chalan from '@/lib/models/chalan.model';
import Compliance from '@/lib/models/compliances.model';
import Consumable from '@/lib/models/consumables.model';
import FuelManagement from '@/lib/models/fuelManagement.model';

const monthNameToNumber = (monthName: string): number => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthIndex = monthNames.indexOf(monthName);
  return monthIndex !== -1 ? monthIndex + 1 : -1; // Months are 1-based
};

const getVehiclesWithHours = async (month: string, year: string) => {
  try {
    const monthNum = monthNameToNumber(month);
    const yearNum = parseInt(year, 10);

    if (monthNum === -1 || isNaN(yearNum)) {
      throw new Error('Invalid month or year');
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const chalans = await Chalan.find({
      date: { $gte: startDate, $lte: endDate },
    }).exec();

    const vehicleData = {};

    chalans.forEach((chalan) => {
      chalan.items.forEach((item) => {
        // console.log(item);
        const vehicleNumber = item.vehicleNumber;
        if (item.unit) {
          if (!vehicleData[vehicleNumber]) {
            vehicleData[vehicleNumber] = {
              vehicleNumber,
              totalHours: 0,
              totalCost: 0,
              chalans: [],
              totalFuel: 0,
              fuelCost: 0,
              complianceCost: 0,
              consumablesCost: 0,
              totalShifts: 0,
              totalDays: 0,
              totalMonths: 0,
              totalMinutes: 0,
              totalOT: 0,
            };
          }
          vehicleData[vehicleNumber].chalans.push({
            chalan: chalan.chalanNumber,
            amount: item.itemCosting,
            hours: item.hours,
            unit: item.unit,
          });

          // I don't know what is 'fixed' and there is no quantity named 'fixed' in chalan model(chalan.model.ts) therefore I am excluding its calc.

          vehicleData[vehicleNumber].totalHours +=
            item.unit === 'hours' ? item.hours : 0;
          vehicleData[vehicleNumber].totalCost += item.itemCosting;
          vehicleData[vehicleNumber].totalShifts +=
            item.unit === 'shift' ? item.hours : 0;
          vehicleData[vehicleNumber].totalDays +=
            item.unit === 'days' ? item.hours : 0;
          vehicleData[vehicleNumber].totalMonths +=
            item.unit === 'months' ? item.hours : 0;
          vehicleData[vehicleNumber].totalMinutes +=
            item.unit === 'minutes' ? item.hours : 0;
          vehicleData[vehicleNumber].totalOT +=
            item.unit === 'ot' ? item.hours : 0;
        }
      });
    });

    // console.log('--------------------------------------', vehicleData);

    let fuelManagementDocs = await FuelManagement.find({
      month: month,
      year: yearNum,
    });

    fuelManagementDocs.forEach((ele) => {
      if (vehicleData[ele.vehicleNumber]) {
        vehicleData[ele.vehicleNumber].totalFuel =
          (vehicleData[ele.vehicleNumber].totalFuel || 0) + ele.fuel;
        vehicleData[ele.vehicleNumber].fuelCost =
          (vehicleData[ele.vehicleNumber].fuelCost || 0) + ele.amount;
      }
    });

    let complianceDocs = await Compliance.find({
      month: month,
      year: yearNum,
    });

    complianceDocs.forEach((ele) => {
      if (vehicleData[ele.vehicleNumber]) {
        vehicleData[ele.vehicleNumber].complianceCost =
          (vehicleData[ele.vehicleNumber].complianceCost || 0) + ele.amount;
      }
    });

    let consumablesDocs = await Consumable.find({
      month: month,
      year: year,
    });

    consumablesDocs.forEach((ele) => {
      if (vehicleData[ele.vehicleNumber]) {
        vehicleData[ele.vehicleNumber].consumablesCost =
          (vehicleData[ele.vehicleNumber].consumablesCost || 0) + ele.amount;
      }
    });

    const result = Object.values(vehicleData);

    return {
      success: true,
      status: 200,
      data: JSON.stringify(result),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
      error: JSON.stringify(err),
    };
  }
};

export default getVehiclesWithHours;
