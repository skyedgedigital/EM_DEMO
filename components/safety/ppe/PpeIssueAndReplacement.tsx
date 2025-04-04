'use client';
import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { storage } from '@/utils/fireBase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PpeAction from '@/lib/actions/ppe/ppeAction';
import toast from 'react-hot-toast';
import { IEmployeesBySelectedHRWorkOrderIDResponse } from '@/lib/actions/HR/EmployeeData/fetch';
import EmployeeDataAction from '@/lib/actions/HR/EmployeeData/employeeDataAction';
import WorkOrderHrAction from '@/lib/actions/HR/workOrderHr/workOrderAction';
import { IWorkOrderHr } from '@/lib/models/HR/workOrderHr.model';
import { Loader2Icon, RefreshCcw } from 'lucide-react';
import designationAction from '@/lib/actions/HR/Designation/designationAction';
import { IDesignation } from '@/lib/models/HR/designation.model';
import departmentAction from '@/lib/actions/department/departmentAction';
import { IDepartment } from '@/interfaces/department.interface';
const PpeIssueAndReplacement = () => {
  const [rows, setRows] = useState([]);
  const sigCanvasRefs = useRef([]);
  const [revNo, setRevNo] = useState('');
  const [docNo, setDocNo] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [empCode, setEmpCode] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [fetchedDesignation, setFetchedDesignation] = useState<
    (IDesignation & { _id: string })[]
  >([]);
  const [fetchedDepartment, setFetchedDepartment] = useState<
    (IDepartment & { _id: string })[]
  >([]);
  const [hrWorkOrders, setHrWorkOrders] =
    useState<(IWorkOrderHr & { _id: string })[]>(null);
  const [employees, setAllEmployees] = React.useState<
    IEmployeesBySelectedHRWorkOrderIDResponse[]
  >([]);
  const [
    selectedWorkOrderFilterForEmployees,
    setSelectedWorkOrderFilterForEmployees,
  ] = useState<string>(null);
  const [loadingStates, setLoadingStates] = useState<{
    loadingEmployees: boolean;
    creatingPPE: boolean;
    fetchingRevNo: boolean;
  }>({
    loadingEmployees: true,
    creatingPPE: false,
    fetchingRevNo: true,
  });
  const fetchEmployee = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, loadingEmployees: true }));
      const { data, message, success } =
        await EmployeeDataAction.FETCH.fetchEmployeesBySelectedHRWorkOrderID(
          selectedWorkOrderFilterForEmployees,
          ['name', 'code']
        );

      if (success) {
        const empData = data;
        setAllEmployees(empData);
      } else {
        toast.error(message || 'Failed to load employees, Please try later');
      }
    } catch (error) {
      toast.error('An error occurred while fetching employees');
    } finally {
      setLoadingStates((prev) => ({ ...prev, loadingEmployees: false }));
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [, selectedWorkOrderFilterForEmployees]);

  useEffect(() => {
    const fetchHrWorkOrders = async () => {
      try {
        const { data, error, message, status, success } =
          await WorkOrderHrAction.FETCH.fetchAllValidWorkOrderHr([
            'workOrderNumber',
          ]);
        if (success) {
          const parsedData = await JSON.parse(data);
          setHrWorkOrders(parsedData);
        }
        if (!success) {
          toast.error('Failed to load HR WorkOrders to filter employee', {
            duration: 5000,
          });
        }
      } catch (error) {
        console.log('Fetching Work order Failed', error);
      }
    };
    fetchHrWorkOrders();
  }, []);

  const addRow = () => {
    setRows([
      ...rows,
      { ppeItem: '', type: 'Issued', date: '', signature: null },
    ]);
  };

  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        const { data, status, success, error, message } =
          await designationAction.FETCH.fetchDesignations();

        if (success) {
          const parsedData = await JSON.parse(data);
          // console.log('designations', parsedData);
          setFetchedDesignation(parsedData);
        }
        if (!success) {
          toast.error(message);
        }
      } catch (error) {
        toast.error(
          JSON.stringify(error) ||
            'Unexpected Error occurred, Failed to load designation, Please try later'
        );
      }
    };
    fetchDesignation();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, status, success, error, message } =
          await departmentAction.FETCH.fetchAllDepartments();

        if (success) {
          const parsedData = await JSON.parse(data);
          // console.log('designations', parsedData);
          setFetchedDepartment(parsedData);
        }
        if (!success) {
          toast.error(message);
        }
      } catch (error) {
        toast.error(
          JSON.stringify(error) ||
            'Unexpected Error occurred, Failed to load designation, Please try later'
        );
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    console.log('called');

    const fetchRevNo = async () => {
      try {
        setLoadingStates((prev) => ({ ...prev, fetchingRevNo: true }));
        const { data, error, message, status, success } =
          await PpeAction.FETCH.fetchNextRevNoByDocumentNumber(docNo);

        if (success) {
          console.log('received rev no,data', data);
          setRevNo(data.nextRevNo.toString());
        }
        if (!success) {
          toast.error(message || 'Failed to generate rev no');
        }
      } catch (error) {
        toast.error(JSON.stringify(error) || 'Failed to generate rev no');
      } finally {
        setLoadingStates((prev) => ({ ...prev, fetchingRevNo: false }));
      }
    };
    const timerId = setTimeout(fetchRevNo, 300);
    return () => clearTimeout(timerId);
  }, [docNo]);
  // console.log('received rev no,data', revNo);

  // console.log('alldesignations', fetchedDesignation);
  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const saveSignature = (index) => {
    const signatureRef = sigCanvasRefs.current[index];
    if (signatureRef) {
      const newRows = [...rows];
      newRows[index].signature = signatureRef.toDataURL();
      setRows(newRows);
    }
  };

  const clearSignature = (index) => {
    const signatureRef = sigCanvasRefs.current[index];
    if (signatureRef) {
      signatureRef.clear();
      const newRows = [...rows];
      newRows[index].signature = null;
      setRows(newRows);
    }
  };

  const exportToExcel = async () => {
    setLoadingStates((prev) => ({ ...prev, creatingPPE: true }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PPE Data');

    worksheet.addRow([
      'Rev No',
      revNo,
      'Document No',
      docNo,
      'Effective Date',
      effectiveDate,
    ]);
    worksheet.addRow(['Employee Name', employeeName, 'Employee Code', empCode]);
    worksheet.addRow(['Designation', designation]);
    worksheet.addRow(['Department', department]);
    worksheet.addRow(['Site Location', siteLocation]);
    worksheet.addRow(['Issue/Replacement Date', selectedDate]);
    worksheet.addRow(['PPE Item', 'Type', 'Date', 'Signature']);

    worksheet.columns = [
      { key: 'ppeItem', width: 20 },
      { key: 'type', width: 20 },
      { key: 'date', width: 20 },
      { key: 'signature', width: 40 },
    ];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowIndex = worksheet.addRow({
        ppeItem: row.ppeItem,
        type: row.type,
        date: row.date,
      }).number;

      if (row.signature) {
        const imageId = workbook.addImage({
          base64: row.signature,
          extension: 'png',
        });
        worksheet.addImage(imageId, {
          tl: { col: 3, row: rowIndex - 1 },
          ext: { width: 200, height: 100 },
        });
      }
      worksheet.addRow([]);
      worksheet.addRow([]);
      worksheet.addRow([]);
      worksheet.addRow([]);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `PPE_Issue_Replacement${
      selectedDate ? `_${selectedDate}` : ''
    }.xlsx`;
    // saveAs(new Blob([buffer]), "PPE_Issue_Replacement.xlsx");
    const storageRef = ref(storage, `PPE_IssueAndReplacement/${fileName}`);
    const metadata = {
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    const snapshot = await uploadBytes(storageRef, buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.warn(downloadURL);
    const obj = {
      link: downloadURL,
      revNo: revNo,
      docNo: docNo,
      date: selectedDate,
    };
    const resp = await PpeAction.CREATE.createPpeIssueAndReplacement(
      JSON.stringify(obj)
    );
    if (resp.success) {
      toast.success('Excel Saved');
    } else {
      toast.error('An Error Occurred');
    }
    setLoadingStates((prev) => ({ ...prev, creatingPPE: false }));
  };
  console.log('designation', designation, department);
  return (
    <div className=' mx-auto p-4'>
      <div>
        <h1 className='text-center my-2 text-2xl'>Add Ppe Issue/Replacement</h1>
        <div className='py-5 px-3 flex flex-wrap'>
          <div className='m-4'>
            <label
              htmlFor='input'
              className='block text-sm font-medium text-gray-700'
            >
              Document No.
            </label>
            <input
              type='text'
              id='input'
              value={docNo}
              onChange={(e) => {
                setDocNo(e.target.value);
              }}
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              placeholder='Enter Here'
              min='0'
            />
          </div>

          <div className='m-4 flex justify-center items-center gap-1'>
            <div>
              <label
                htmlFor='input'
                className='block text-sm font-medium text-gray-700'
              >
                Rev No.
              </label>
              <input
                disabled
                type='text'
                id='input'
                value={revNo}
                onChange={(e) => {
                  setRevNo(e.target.value);
                }}
                className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                placeholder='Enter Here'
                min='0'
              />
            </div>
            {loadingStates.fetchingRevNo && (
              <Loader2Icon className='animate-spin w-[20px] h-[20px]' />
            )}
          </div>

          <div className='m-4'>
            <label
              htmlFor='input'
              className='block text-sm font-medium text-gray-700'
            >
              Effective Date
            </label>
            <input
              type='date'
              id='date'
              value={effectiveDate}
              onChange={(e) => {
                setEffectiveDate(e.target.value);
              }}
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              placeholder='Enter Here'
              min='0'
            />
          </div>

          <div className='m-4'>
            <label htmlFor='designation' className='md:mr-8'>
              Designation
            </label>
            <select
              id='designation'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              onChange={(e) => setDesignation(e.currentTarget.value)}
            >
              {' '}
              <option value={''}>All Designation</option>
              {fetchedDesignation?.map((d) => (
                <option value={d.designation} key={d?._id}>
                  {d.designation}
                </option>
              ))}
            </select>
          </div>
          <div className='m-4'>
            <label htmlFor='department' className='md:mr-8'>
              Department
            </label>
            <select
              id='department'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              onChange={(e) => setDepartment(e.currentTarget.value)}
            >
              {' '}
              <option value={''}>All Department</option>
              {fetchedDepartment?.map((d) => (
                <option value={d.departmentName} key={d?._id}>
                  {d.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div className='m-4'>
            <label
              htmlFor='input'
              className='block text-sm font-medium text-gray-700'
            >
              Site Location
            </label>
            <input
              type='text'
              id='date'
              value={siteLocation}
              onChange={(e) => {
                setSiteLocation(e.target.value);
              }}
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              placeholder='Enter Here'
              min='0'
            />
          </div>

          <div className='m-4'>
            <label
              htmlFor='input'
              className='block text-sm font-medium text-gray-700'
            >
              Issue/Replacement Date
            </label>
            <input
              type='date'
              id='date'
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              placeholder='Enter Here'
              min='0'
            />
          </div>
        </div>
        <div className='flex flex-col gap-3 border-[1px] border-gray-200 rounded p-2'>
          <div className='flex flex-col md:flex-row justify-between items-end'>
            <h2 className='font-semibold mb-1'>Issuing to Employee:</h2>

            <div className='flex flex-col md:flex-row gap-1 items-end'>
              <div className='flex flex-col gap-1 p-1 '>
                <label htmlFor='woHr' className='md:mr-8'>
                  Filter Employee by Work Order:
                </label>
                <select
                  id='woHr'
                  className='border-[1px] flex-grow border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                  onChange={(e) =>
                    setSelectedWorkOrderFilterForEmployees(
                      e.currentTarget.value
                    )
                  }
                >
                  {' '}
                  <option value={''}>All Employees</option>
                  {hrWorkOrders?.map((wo) => (
                    <option value={wo?._id} key={wo?._id}>
                      {wo.workOrderNumber}
                    </option>
                  ))}
                </select>
                {/* {errors.title && (
                  <p className='text-red-500 text-sm'>{errors.title.message}</p>
                )} */}
              </div>
              <button
                onClick={fetchEmployee}
                type='button'
                className='flex justify-center items-center gap-2 px-2 py-2 border-[1px] border-blue-400 rounded bg-white text-blue-500 text-nowrap text-sm font-semibold mb-1'
              >
                <RefreshCcw
                  className={`${
                    loadingStates.loadingEmployees && `animate-spin`
                  } w-[16px] h-[16px] `}
                />
                <>Reload Employees</>
              </button>
            </div>
          </div>
          {employees.length === 0 ? (
            <div className='w-full h-full flex justify-center items-center'>
              <p>No employees found</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 max-h-screen overflow-auto'>
              {employees.map((employee) => (
                <label
                  key={employee._id.toString()}
                  htmlFor={employee._id.toString()}
                  className='flex items-center gap-2 border-[.5px] p-1 px-2 border-gray-200 lowercase hover:bg-gray-100 text-gray-700'
                >
                  <input
                    name='assignedTo'
                    type='radio'
                    value={employee._id}
                    id={employee._id.toString()}
                    onChange={() => {
                      setEmployeeName(employee.name);
                      setEmpCode(employee.code);
                    }}
                  />
                  {employee.name} ({employee.code})
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <table className='min-w-full bg-white border border-gray-200'>
        <thead>
          <tr>
            <th className='py-2 px-4 border-b'>PPE Item</th>
            <th className='py-2 px-4 border-b'>Type</th>
            <th className='py-2 px-4 border-b'>Date</th>
            <th className='py-2 px-4 border-b'>Signature of Recipient</th>
            <th className='py-2 px-4 border-b'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className='py-2 px-4 border-b'>
                  <input
                    type='text'
                    value={row.ppeItem}
                    onChange={(e) =>
                      handleInputChange(index, 'ppeItem', e.target.value)
                    }
                    className='border border-gray-300 p-2 w-full'
                  />
                </td>
                <td className='py-2 px-4 border-b'>
                  <select
                    value={row.type}
                    onChange={(e) =>
                      handleInputChange(index, 'type', e.target.value)
                    }
                    className='border border-gray-300 p-2 w-full'
                  >
                    <option value='Issued'>Issued</option>
                    <option value='Replacement'>Replacement</option>
                  </select>
                </td>
                <td className='py-2 px-4 border-b'>
                  <input
                    type='date'
                    value={row.date}
                    onChange={(e) =>
                      handleInputChange(index, 'date', e.target.value)
                    }
                    className='border border-gray-300 p-2 w-full'
                  />
                </td>
                <td className='py-2 px-4 border-b'>
                  {row.signature ? (
                    <img src={row.signature} alt='Signature' className='h-24' />
                  ) : (
                    <div className='flex flex-col items-center'>
                      <SignatureCanvas
                        penColor='black'
                        canvasProps={{
                          width: 300,
                          height: 100,
                          className: 'border border-gray-300',
                        }}
                        ref={(ref) => (sigCanvasRefs.current[index] = ref)}
                      />
                      <div className='mt-2 space-x-2'>
                        <button
                          onClick={() => saveSignature(index)}
                          className='bg-blue-500 text-white py-1 px-2 rounded'
                        >
                          Save
                        </button>
                        <button
                          onClick={() => clearSignature(index)}
                          className='bg-red-500 text-white py-1 px-2 rounded'
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </td>
                <td className='py-2 px-4 border-b text-center'>
                  <button
                    onClick={() => removeRow(index)}
                    className='bg-red-500 text-white py-1 px-2 rounded'
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {[...Array(4)].map((_, i) => (
                <tr key={`spacer-${index}-${i}`} className='h-6'>
                  <td colSpan={5}></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className='mt-4 flex space-x-2'>
        <button
          onClick={addRow}
          className='bg-green-500 text-white py-2 px-4 rounded'
        >
          Add Row
        </button>
        <button
          onClick={exportToExcel}
          className='bg-blue-500 text-white py-2 px-4 rounded flex justify-center items-center gap-1'
        >
          {loadingStates.creatingPPE && (
            <Loader2Icon className={`${`animate-spin`} w-[16px] h-[16px] `} />
          )}
          Save & export to excel
        </button>
      </div>
    </div>
  );
};

export default PpeIssueAndReplacement;
