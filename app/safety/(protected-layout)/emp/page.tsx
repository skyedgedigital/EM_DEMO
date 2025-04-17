'use client';

import MonthlyTaskHome from '@/components/safety/emp/monthlyTaskHome';
import React, { useState } from 'react';

const Page = () => {
  const [activeTab, setActiveTab] = useState('monthly');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div>
        <ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400'>
          <li className='me-2'>
            <button
              onClick={() => handleTabClick('monthly')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'monthly'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Monthly Task
            </button>
          </li>
        </ul>

        <div className='tab-content'>
          {activeTab === 'monthly' && <MonthlyTaskHome />}
        </div>
      </div>
    </>
  );
};

export default Page;
