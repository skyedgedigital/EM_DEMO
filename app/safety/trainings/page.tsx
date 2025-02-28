'use client';
import CompletedTraining from '@/components/safety/trainings/CompletedTraining';
import CreateTraining from '@/components/safety/trainings/CreateTraining';
import UpcomingTraining from '@/components/safety/trainings/UpcomingTraining';
import React, { useState } from 'react';

type tabOptionTypes =
  | 'upcoming-trainings'
  | 'completed-trainings'
  | 'create-training';

const TrainingHome = () => {
  const [activeTab, setActiveTab] = useState<tabOptionTypes>('create-training');

  const handleTabClick = (tab: tabOptionTypes) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div>
        <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
          Trainings
        </h1>
        <ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400'>
          <li className='me-2'>
            <button
              onClick={() => handleTabClick('upcoming-trainings')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'upcoming-trainings'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Upcoming Trainings
            </button>
          </li>

          <li className='me-2'>
            <button
              onClick={() => handleTabClick('completed-trainings')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'completed-trainings'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Completed Trainings
            </button>
          </li>

          <li className='me-2'>
            <button
              onClick={() => handleTabClick('create-training')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'create-training'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Create Training
            </button>
          </li>
        </ul>

        <div className='tab-content my-2'>
          {activeTab === 'upcoming-trainings' && <UpcomingTraining />}
          {activeTab === 'completed-trainings' && <CompletedTraining />}
          {activeTab === 'create-training' && <CreateTraining />}
        </div>
      </div>
    </>
  );
};

export default TrainingHome;
