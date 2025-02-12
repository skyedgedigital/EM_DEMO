'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AddToolBoxTalk from './addToolBoxTalk';
import ViewToolBoxTalk from './viewToolBoxTalk';
import AttendanceUploads from './attendance';
import StripUploads from './strip';
import SiteUploads, { TSiteFileUrl } from './site';
import Feedback from './feedBack';
import { DividerVerticalIcon } from '@radix-ui/react-icons';
import mongoose from 'mongoose';
import { IQA, IToolboxTalk } from '@/lib/models/Safety/toolboxtalk.model';
import { IWorkOrderHr } from '@/lib/models/HR/workOrderHr.model';
import WorkOrderHrAction from '@/lib/actions/HR/workOrderHr/workOrderAction';
import toast from 'react-hot-toast';
import { IAttendance } from '../../../lib/models/Safety/toolboxtalk.model';
import { FormState } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { createToolboxTalk } from '@/lib/actions/safety/toolboxtalk/create';
import { IEnterpriseBase } from '@/interfaces/enterprise.interface';
import { fetchEnterpriseInfo } from '@/lib/actions/enterprise';

const toolboxTalkExample: IToolboxTalk = {
  documentNo: '',
  programName: '',
  effectiveDate: new Date('2024-03-20'),
  vendorCode: 'VENDOR123',
  safetyRepresentative: 'John Smith',
  contractorRepresentative: 'Mike Johnson',
  currentVersion: 1,
  versions: [
    {
      revNo: 1,
      workOrderNo: new mongoose.Types.ObjectId('64f8c3e5d52a9b1c72a0b123'),
      totalManPower: 25,
      totalWorkers: 20,
      totalEngineers: 23,
      totalSupervisors: 12,
      totalSafety: 2,
      supervisor: 'Company Supervisor',
      questions: [
        {
          question:
            'Safety contact and review of action items from last meeting?',
          answer:
            'Falls, falling objects, weather conditions, unstable surfaces',
        },
        {
          question: `Items of General Safety Importance to the Total Work Site:
                (ask employees to mention any incidents/nearmiss during the past
                day which may have resulted in damage to property or injury to
                Company or Contractor personnel)?`,
          answer:
            'Safety harness, hard hat, safety shoes, high-visibility vest',
        },
        {
          question: `Items of Safety Interest to this Group: (e.g. Red Stripes,
                Orange stripes, Green stripe, safety alert tips safety
                communications, hazards or safety conditions applicable to this
                group's work area)?`,
          answer:
            'Safety harness, hard hat, safety shoes, high-visibility vest',
        },
        {
          question: `Safety Message Hand Outs/circulars to be shared with contract employee?`,
          answer:
            'Safety harness, hard hat, safety shoes, high-visibility vest',
        },
      ],
      records: [
        {
          actionBy: 'Inspect all safety harnesses',
          when: 'Before each shift',
          targetDate: new Date('2024-03-20'),
          status: 'Completed',
          item: 'Newly added item',
        },
        {
          actionBy: 'Check weather conditions',
          when: 'Every 2 hours',
          targetDate: new Date('2024-03-20'),
          status: 'In Progress',
          item: 'Newly added item two',
        },
      ],
      points: [
        {
          point: 'Always maintain three points of contact on ladders',
          color: 'red',
        },
        {
          point: 'Inspect all equipment before use',
          color: 'yellow',
        },
        {
          point: 'Report any safety concerns immediately',
          color: 'green',
        },
      ],
      uploadDate: new Date('2024-03-20'),
      suggestion: 'Consider implementing a buddy system for height work',
      feedback: [
        {
          question: 'Feedback /Suggestion With Date and Signature',
          answer: 'N/A',
        },
        {
          question: 'Action/Compliance With Date and Signture ',
          answer: 'N/A',
        },
        {
          question: 'Informed To the Suggest or /Concerned Persons  ',
          answer: 'N/A',
        },
        {
          question: 'PDCA Staus.(PLAN - DO - CHECK-ACT)',
          answer: 'N/A',
        },
      ],
      siteFileURL: 'https://storage.firebase.com/site-photos-001.pdf',
      uploadedBy: new mongoose.Types.ObjectId('64f8c3e5d52a9b1c72a0b123'),
      attendance: {
        permitNo: '2',
        remarks: 'abc',
        attendanceFileURL: '',
      },
    },
  ],
};
const ToolBoxTalkHome = () => {
  const session = useSession();
  const [activeTab, setActiveTab] = useState('add');
  const [fetchedToolBoxData, setFetchedToolBoxData] =
    useState<IToolboxTalk>(toolboxTalkExample);
  const [allWorkOrderHr, setAllWorkOrderHr] = useState<
    (IWorkOrderHr & { _id: mongoose.Types.ObjectId })[]
  >([]);
  const [selectedWorkOrderHr, setSelectedWorkOrderHr] = useState<
    (IWorkOrderHr & { _id: mongoose.Types.ObjectId }) | null
  >(null);
  const [enterPriseInfo, setEnterpriseInfo] = useState<IEnterpriseBase>({
    name: 'N/A',
    pan: 'N/A',
    gstin: 'N/A',
    vendorCode: 'N/A',
    address: 'N/A',
    email: 'N/A',
  });
  const mainToolBoxTalkRef = useRef(null);
  const feedbackRef = useRef(null);
  const attendanceRef = useRef(null);
  const siteUrlRef = useRef(null);

  useEffect(() => {
    if (session && session?.data?.user._id) {
      // console.log('LAWDA', session, session.data.user._id);
      setFetchedToolBoxData((prev) => ({
        ...prev,
        versions: [
          {
            ...prev.versions[0],
            uploadedBy: new mongoose.Types.ObjectId(session.data.user._id),
          },
        ],
      }));
    }
  }, [session]);

  useEffect(() => {
    const fn = async () => {
      const resp = await fetchEnterpriseInfo();
      console.log('response we got ', resp);
      if (resp.data) {
        const inf = await JSON.parse(resp.data);
        setEnterpriseInfo(inf);
      }
      if (!resp.success) {
        toast.error(
          `Failed to load enterprise details, Please Reload or try later. ERROR : ${resp.error}`
        );
      }
    };
    fn();
  }, []);
  const fetchWorkOrderHr = async () => {
    try {
      const { data, error, message, status, success } =
        await WorkOrderHrAction.FETCH.fetchAllValidWorkOrderHr();
      if (success) {
        const parsedWorkOrderHr = await JSON.parse(data);
        setAllWorkOrderHr(parsedWorkOrderHr);
      }
      if (!success) {
        toast.error(error);
      }
    } catch (error) {
      toast.error(
        error || 'Failed to fetch work order from HR, Please try later'
      );
    }
  };
  useEffect(() => {
    fetchWorkOrderHr();
  }, []);
  useEffect(() => {
    if (allWorkOrderHr.length > 0) {
      const selectedWO = allWorkOrderHr.find(
        (wo) => wo?._id === fetchedToolBoxData.versions[0].workOrderNo
      );
      if (selectedWO) setSelectedWorkOrderHr(selectedWO);
    }
  }, [allWorkOrderHr, fetchedToolBoxData]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Callback to update attendance data
  // const updateMainToolBoxTalk = () => {
  //   const data: IToolboxTalk = mainToolBoxTalkRef.current?.getFeedbackData();
  //   console.log('UPDATED MAIN DATA', data);
  //   if (data) {
  //     // setFetchedToolBoxData((prev) => ({ ...prev, ...data }));
  //   }
  // };
  const updateMainToolBoxTalk = useCallback((updatedData: IToolboxTalk) => {
    if (session && session?.data?.user._id)
      updatedData.versions[0].uploadedBy = new mongoose.Types.ObjectId(
        session.data.user._id
      );
    setFetchedToolBoxData((prev) => ({ ...prev, ...updatedData }));
  }, []);

  // Callback to update attendance data
  const updateAttendance = async () => {
    // Get the updated feedback data from the child component
    const updatedAttendance: IAttendance =
      attendanceRef.current?.getFeedbackData();

    console.log('UPDATED ATTENDANCE', updatedAttendance);
    if (updatedAttendance) {
      if (!updatedAttendance.attendanceFileURL) {
        return;
        // return toast.error('Attendance file is necessary');
      }
      setFetchedToolBoxData((prev) => ({
        ...prev,
        versions: [
          {
            ...prev.versions[0],
            attendance: updatedAttendance,
          },
        ],
      }));
    }
  };

  //Callback to update feedback
  const updateFeedback = () => {
    const updatedFeedback: IQA[] = feedbackRef.current?.getFeedbackData();
    console.log('UPDATED FEEDBACK', updatedFeedback);

    if (updatedFeedback) {
      // Update the parent state with the new feedback data
      setFetchedToolBoxData((prevData) => ({
        ...prevData,
        versions: [
          {
            ...prevData.versions[0],
            feedback: updatedFeedback,
          },
        ],
      }));
    }
  };

  // Callback to update site data
  const updateSiteURL = () => {
    const updatedSiteUrl: TSiteFileUrl = siteUrlRef.current?.getFeedbackData();
    console.log('UPDATED SITEFILEURL', updatedSiteUrl);

    if (updatedSiteUrl) {
      // Update the parent state with the new siteurl data
      setFetchedToolBoxData((prevData) => ({
        ...prevData,
        versions: [
          {
            ...prevData.versions[0],
            siteFileURL: updatedSiteUrl.siteFileURL,
          },
        ],
      }));
    }
  };

  // Save all changes to the server
  const handleSave = async () => {
    try {
      const {
        programName,
        documentNo,
        versions,
        vendorCode,
        contractorRepresentative,
        safetyRepresentative,
        effectiveDate,
        currentVersion,
      } = fetchedToolBoxData;
      const {
        workOrderNo,
        attendance,
        totalEngineers,
        totalManPower,
        totalSafety,
        totalSupervisors,
        totalWorkers,
        uploadDate,
        uploadedBy,
        siteFileURL,
        feedback,
        points,
        questions,
        records,
        supervisor,
        suggestion,
      } = versions[0];
      if (
        !attendance.attendanceFileURL ||
        !workOrderNo ||
        !programName ||
        !documentNo ||
        !vendorCode
      ) {
        return toast.error('Please fill all required(*) fields');
      }

      console.log('SUBMITTED DATA', fetchedToolBoxData);

      const response = await createToolboxTalk({
        programName,
        documentNo,
        vendorCode,
        contractorRepresentative,
        safetyRepresentative,
        attendance: {
          attendanceFileURL: attendance.attendanceFileURL,
          permitNo: attendance.permitNo,
          remarks: attendance.remarks,
        },
        workOrderNo,
        totalWorkers,
        totalEngineers,
        totalManPower,
        totalSafety,
        totalSupervisors,
        uploadDate,
        uploadedBy,
        siteFileURL,
        supervisor,
        questions,
        feedback,
        points,
        records,
        suggestion,
        currentVersion,
        effectiveDate,
        versions,
      });

      if (response.success && response.data.documentNo) {
        toast.success(`${response.data.documentNo} created successfully!`);
      }

      // if (!fetchedToolBoxData.programName || !fetchedToolBoxData) {
      //   return toast.error('Please upload attendance image first to save data');
      // }
    } catch (error) {
      toast.error(`${error.message || 'something went wrong!'}`);
      console.error('Error saving data:', error);
    }
  };

  return (
    <>
      {/* <div>{JSON.stringify(fetchedToolBoxData.versions[0].feedback)}</div>
      <div>{JSON.stringify(fetchedToolBoxData.versions[0].attendance)}</div>
      <div>{JSON.stringify(fetchedToolBoxData.versions[0].siteFileURL)}</div> */}
      {/* <div>{JSON.stringify(fetchedToolBoxData)}</div> */}
      <div className='mt-2'>
        <ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400'>
          <li className='me-2'>
            <button
              onClick={() => handleTabClick('add')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'add'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Add Tool Box Talk
            </button>
          </li>

          <li className='me-2'>
            <button
              onClick={() => handleTabClick('att')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'att'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Attendance
            </button>
          </li>
          <li className='me-2'>
            <button
              onClick={() => handleTabClick('feedback')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'feedback'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Feedback
            </button>
          </li>
          <li className='me-2'>
            <button
              onClick={() => handleTabClick('strip')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'strip'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Strip
            </button>
          </li>

          <li className='me-2'>
            <button
              onClick={() => handleTabClick('site')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'site'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Site
            </button>
          </li>
          <li>
            <DividerVerticalIcon className='h-full' />
          </li>
          <li className='me-2'>
            <button
              onClick={() => handleTabClick('view')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'view'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              View Tool Box Talk
            </button>
          </li>
        </ul>

        <div className='tab-content'>
          <p className='w-full text-center my-2 text-gray-500'>
            Note: Attendances photo, Program Name, Work Order Number & Document
            Number are Required fields
          </p>
          {activeTab === 'add' && (
            <AddToolBoxTalk
              ref={mainToolBoxTalkRef}
              toolBoxTalkData={fetchedToolBoxData}
              updateMainToolBoxTalk={updateMainToolBoxTalk}
              workOrderHr={allWorkOrderHr}
              enterPriseInfo={enterPriseInfo}
            />
          )}
          {activeTab === 'view' && (
            <ViewToolBoxTalk toolBoxTalkData={fetchedToolBoxData} />
          )}
          {activeTab === 'att' && (
            <AttendanceUploads
              updateAttendance={updateAttendance}
              effectiveDate={fetchedToolBoxData.effectiveDate}
              documentNo={fetchedToolBoxData.documentNo}
              revNo={fetchedToolBoxData.versions[0].revNo}
              workOrderNumber={selectedWorkOrderHr?.workOrderNumber}
              programName={fetchedToolBoxData.programName}
              uploadDate={fetchedToolBoxData.versions[0].uploadDate}
              permitNo={fetchedToolBoxData.versions[0].attendance.permitNo}
              remarks={fetchedToolBoxData.versions[0].attendance.remarks}
              contractorRepresentative={
                fetchedToolBoxData.contractorRepresentative
              }
              vendorCode={fetchedToolBoxData.vendorCode}
              attendanceFileURL={
                fetchedToolBoxData.versions[0].attendance.attendanceFileURL
              }
              ref={attendanceRef}
              enterPriseInfo={enterPriseInfo}
            />
          )}
          {activeTab === 'strip' && <StripUploads />}
          {activeTab === 'site' && (
            <SiteUploads
              updateSiteURL={updateSiteURL}
              effectiveDate={fetchedToolBoxData.effectiveDate}
              documentNo={fetchedToolBoxData.documentNo}
              revNo={fetchedToolBoxData.versions[0].revNo}
              workOrderNumber={selectedWorkOrderHr?.workOrderNumber}
              programName={fetchedToolBoxData.programName}
              uploadDate={fetchedToolBoxData.versions[0].uploadDate}
              contractorRepresentative={
                fetchedToolBoxData.contractorRepresentative
              }
              vendorCode={fetchedToolBoxData.vendorCode}
              ref={siteUrlRef}
              enterPriseInfo={enterPriseInfo}
            />
          )}
          {activeTab === 'feedback' && (
            <Feedback
              feedback={fetchedToolBoxData.versions[0].feedback}
              documentNo={fetchedToolBoxData.documentNo}
              effectiveDate={fetchedToolBoxData.effectiveDate}
              revNo={fetchedToolBoxData.versions[0].revNo}
              uploadDate={fetchedToolBoxData.versions[0].uploadDate}
              ref={feedbackRef}
              updateFeedback={updateFeedback}
              enterPriseInfo={enterPriseInfo}
            />
          )}
        </div>
        <div className='w-full flex flex-col justify-center items-center'>
          <button
            onClick={handleSave}
            className='bg-green-500 rounded px-4 py-1 mb-10 text-white font-semibold shadow hover:scale-[101%]'
          >
            Save Data
          </button>
        </div>
      </div>
    </>
  );
};

export default ToolBoxTalkHome;
