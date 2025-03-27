import React from 'react';
import CreateBillForm from '@/components/accountant/CreateBillForm';

const Bills: React.FC<{}> = () => {
  return (
    <section>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Bills
      </h1>
      <CreateBillForm />
    </section>
  );
};

export default Bills;
