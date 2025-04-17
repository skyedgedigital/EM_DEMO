'use client';

import SafetyAuditHome from '@/components/safety/emp/SafetyAuditHome';
import SiteSecurityAuditHome from '@/components/safety/emp/SiteSecurityAuditHome';
import React, { useState } from 'react';

const Page = () => {
  const [activeTab, setActiveTab] = useState('weekly');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div>
        <ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400'>
          <li className='me-2'>
            <button
              onClick={() => handleTabClick('weekly')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'weekly'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Weekly Safety Audit
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
              Site Security Audit
            </button>
          </li>
        </ul>

        <div className='tab-content'>
          {activeTab === 'weekly' && <SafetyAuditHome />}
          {activeTab === 'site' && <SiteSecurityAuditHome />}
        </div>
      </div>
    </>
  );
};

export default Page;
