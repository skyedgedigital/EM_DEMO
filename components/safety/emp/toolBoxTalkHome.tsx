import React, { useState } from 'react';
import AddToolBoxTalk from './addToolBoxTalk';
import ViewToolBoxTalk from './viewToolBoxTalk';
import AttendanceUploads from './attendance';
import StripUploads from './strip';
import SiteUploads from './site';
import Feedback from './feedBack';
import { DividerVerticalIcon } from '@radix-ui/react-icons';

const ToolBoxTalkHome = () => {
  const [activeTab, setActiveTab] = useState('add');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
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
          {activeTab === 'add' && <AddToolBoxTalk />}
          {activeTab === 'view' && <ViewToolBoxTalk />}
          {activeTab === 'att' && <AttendanceUploads />}
          {activeTab === 'strip' && <StripUploads />}
          {activeTab === 'site' && <SiteUploads />}
          {activeTab === 'feedback' && <Feedback />}
        </div>
      </div>
    </>
  );
};

export default ToolBoxTalkHome;
