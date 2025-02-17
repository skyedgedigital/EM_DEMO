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
import {
  IQA,
  IStripPoint,
  IToolboxTalk,
} from '@/lib/models/Safety/toolboxtalk.model';
import { IWorkOrderHr } from '@/lib/models/HR/workOrderHr.model';
import WorkOrderHrAction from '@/lib/actions/HR/workOrderHr/workOrderAction';
import toast from 'react-hot-toast';
import { IAttendance } from '../../../lib/models/Safety/toolboxtalk.model';
import { useSession } from 'next-auth/react';
import { createToolboxTalk } from '@/lib/actions/safety/toolboxtalk/create';
import { IEnterpriseBase } from '@/interfaces/enterprise.interface';
import { fetchEnterpriseInfo } from '@/lib/actions/enterprise';
import { FaSpinner } from 'react-icons/fa6';

const toolboxTalkDefault: IToolboxTalk = {
  documentNo: '',
  programName: '',
  effectiveDate: new Date(),
  vendorCode: '',
  safetyRepresentative: '',
  contractorRepresentative: '',
  currentVersion: 1,
  versions: [
    {
      revNo: 1,
      workOrderNo: null,
      totalManPower: 1,
      totalWorkers: 1,
      totalEngineers: 1,
      totalSupervisors: 1,
      totalSafety: 1,
      supervisor: 'Company Supervisor',
      questions: [
        {
          question:
            'Safety contact and review of action items from last meeting?',
          answer: '',
        },
        {
          question: `Items of General Safety Importance to the Total Work Site:
                (ask employees to mention any incidents/nearmiss during the past
                day which may have resulted in damage to property or injury to
                Company or Contractor personnel)?`,
          answer: '',
        },
        {
          question: `Items of Safety Interest to this Group: (e.g. Red Stripes,
                Orange stripes, Green stripe, safety alert tips safety
                communications, hazards or safety conditions applicable to this
                group's work area)?`,
          answer: '',
        },
        {
          question: `Safety Message Hand Outs/circulars to be shared with contract employee?`,
          answer: '',
        },
      ],
      records: [],
      points: [{ point: '', color: 'blue' }],
      uploadDate: new Date(),
      suggestion: '',
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
      siteFileURL: '',
      uploadedBy: null,
      attendance: {
        permitNo: '',
        remarks: '',
        attendanceFileURL: '',
      },
    },
  ],
};

interface IToolBoxTalkHome {
  receivedToolBoxTalk?: IToolboxTalk | null;
  canEditImportantDetails?: boolean;
  canEditAllDetails?: boolean;
}
const ToolBoxTalkHome = ({
  receivedToolBoxTalk = null,
  canEditImportantDetails = true,
  canEditAllDetails = true,
}: IToolBoxTalkHome) => {
  console.log('ToolBoxTalkHome');
  const session = useSession();
  const [activeTab, setActiveTab] = useState('add');
  const [fetchedToolBoxData, setFetchedToolBoxData] = useState<IToolboxTalk>(
    receivedToolBoxTalk || toolboxTalkDefault
  );
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
  const [saving, setSaving] = useState<boolean>(false);
  const mainToolBoxTalkRef = useRef(null);
  const feedbackRef = useRef(null);
  const attendanceRef = useRef(null);
  const siteUrlRef = useRef(null);
  const stripPointsRef = useRef(null);

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
      // console.log('response we got ', resp);
      if (resp.data) {
        const inf: IEnterpriseBase = await JSON.parse(resp.data);
        setEnterpriseInfo(inf);
        setFetchedToolBoxData((prev) => ({
          ...prev,
          vendorCode: inf.vendorCode,
        }));
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
        const selectedWO = parsedWorkOrderHr.find(
          (wo) => wo?._id === fetchedToolBoxData.versions[0].workOrderNo
        );
        if (selectedWO) setSelectedWorkOrderHr(selectedWO);
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const updateMainToolBoxTalk = useCallback(() => {
    const data: IToolboxTalk = mainToolBoxTalkRef.current?.getFeedbackData();
    data.versions[0].uploadedBy = new mongoose.Types.ObjectId(
      session.data.user._id
    );
    console.log('UPDATED MAIN TOOL BOX TALK', data);
    if (data) {
      setFetchedToolBoxData((prev) => ({
        ...prev,
        ...data,
      }));
    }
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

  const uploadStripsPoints = () => {
    const updatedStripPoints: { stripPoints: IStripPoint[] } =
      stripPointsRef.current?.getUpdatedStripPoints();
    console.log('UPDATED STRIP POINTS', updatedStripPoints);
    if (updatedStripPoints) {
      setFetchedToolBoxData((prev) => ({
        ...prev,
        versions: [
          {
            ...prev.versions[0],
            points: updatedStripPoints.stripPoints,
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
      console.log('SUBMITTED DATA', fetchedToolBoxData);
      console.log(
        canEditImportantDetails,
        attendance.attendanceFileURL,
        workOrderNo,
        programName,
        documentNo
      );
      if (
        (canEditImportantDetails &&
          (!attendance.attendanceFileURL ||
            !workOrderNo ||
            !programName ||
            !documentNo)) ||
        !contractorRepresentative
      ) {
        return toast.error('Please fill all required(*) fields');
      }
      setSaving(true);
      const response = await createToolboxTalk(
        await JSON.parse(
          JSON.stringify({
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
          })
        )
      );

      if (response.success && response.data.documentNo) {
        toast.success(`${response.data.documentNo} created successfully!`);
      }

      // if (!fetchedToolBoxData.programName || !fetchedToolBoxData) {
      //   return toast.error('Please upload attendance image first to save data');
      // }
    } catch (error) {
      toast.error(`${error.message || 'something went wrong!'}`);
      console.error('Error saving data:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* <div>{JSON.stringify(fetchedToolBoxData.versions[0].points)}</div> */}
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
        <div
          className={`${
            activeTab === 'view' && 'hidden'
          } flex justify-center items-center my-1 flex-col gap-1 mx-8`}
        >
          {!canEditAllDetails && !canEditImportantDetails && (
            <p className='bg-blue-500 text-white py-1 px-3 rounded'>
              View Only
            </p>
          )}
          {canEditAllDetails && !canEditImportantDetails && (
            <p className='bg-blue-500 text-white py-1 px-3 rounded'>
              Edit Details
            </p>
          )}
          {canEditAllDetails && canEditImportantDetails && (
            <p className='bg-blue-500 text-white py-1 px-3 rounded'>
              Create New Document
            </p>
          )}

          <p className='w-full mx-8 text-center my-2 bg-yellow-50 p-2 rounded border-[1px] border-yellow-200 text-yellow-700'>
            Required fields*: Document Number, Program Name, Attendances photo,
            Contractor Representative & Work Order Number
          </p>
        </div>
        <div className='tab-content'>
          {' '}
          {activeTab === 'add' && (
            <AddToolBoxTalk
              ref={mainToolBoxTalkRef}
              toolBoxTalkData={fetchedToolBoxData}
              updateMainToolBoxTalk={updateMainToolBoxTalk}
              workOrderHr={allWorkOrderHr}
              enterPriseInfo={enterPriseInfo}
              canEditImportantDetails={canEditImportantDetails}
              canEditAllDetails={canEditAllDetails}
            />
          )}
          {activeTab === 'view' && <ViewToolBoxTalk />}
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
              canEditImportantDetails={canEditImportantDetails}
              canEditAllDetails={canEditAllDetails}
            />
          )}
          {activeTab === 'strip' && (
            <StripUploads
              ref={stripPointsRef}
              canEditAllDetails={canEditAllDetails}
              canEditImportantDetails={canEditImportantDetails}
              stripPoints={fetchedToolBoxData.versions[0].points}
              updateStripsPoints={uploadStripsPoints}
              documentNo={fetchedToolBoxData.documentNo}
            />
          )}
          {activeTab === 'site' && (
            <SiteUploads
              siteFileURL={fetchedToolBoxData.versions[0].siteFileURL}
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
              canEditImportantDetails={canEditImportantDetails}
              canEditAllDetails={canEditAllDetails}
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
              canEditImportantDetails={canEditImportantDetails}
              canEditAllDetails={canEditAllDetails}
            />
          )}
        </div>
        <div className='w-full flex flex-col justify-center items-center'>
          {activeTab !== 'view' &&
            (canEditAllDetails || canEditImportantDetails) && (
              <button
                onClick={handleSave}
                className='bg-green-500 rounded px-4 py-1 mb-10 text-white font-semibold shadow hover:scale-[101%] flex justify-center items-center gap-2'
              >
                {saving ? (
                  <>
                    <FaSpinner />
                    Saving...
                  </>
                ) : (
                  'Save Data'
                )}
              </button>
            )}
        </div>
      </div>
    </>
  );
};

export default ToolBoxTalkHome;
