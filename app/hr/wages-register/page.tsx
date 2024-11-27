'use client';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Separator } from '@/components/ui/separator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  PDFTable,
} from '@/components/ui/table';

import React, { useEffect, useState } from 'react';

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const [wagesData, setWagesData] = useState(null);

  useEffect(() => {
    const fn = async () => {
      try {
        // @ts-ignore
        const data = await JSON.parse(searchParams.employee);
        console.log('shaiaiijsjs', data);

        setWagesData(data);
      } catch (error) {
        toast.error('Internal Server Error');
        console.log('Internal Server Error:', error);
      }
    };
    fn();
  }, []);
  console.log('sahi h bhai');

  // Array of days (1 to 31)

  const months = [
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


  const contentRef = React.useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef,
   documentTitle:`BonusStatement/${searchParams.year}`, })
  const handleOnClick = async () => {
   if(!wagesData){
     toast.error('Attendance data not available for Print generation.');
     return;
   }
     reactToPrintFn();
 };
  const handleDownloadPDF = async () => {
    if (!wagesData) {
      toast.error('Attendance data not available for PDF generation.');
      return;
    }

    await generatePDF(wagesData);
  };

  const generatePDF = async (wagesData) => {
    const pdf = new jsPDF('l', 'pt', 'a4'); // Create a landscape PDF
    const ogId = `Wages-Register`;
   console.log("siiiiiii",wagesData)
    // Create a container element to hold the content and table

    const originalElement = document.getElementById(ogId)!;
    const tableElement = originalElement.cloneNode(true) as HTMLElement;

    // Append the table to the container element

    tableElement.style.width = '1250px';

    pdf.html(tableElement, {
      callback: async () => {
        pdf.save(`${ogId}.pdf`);
        const pdfDataUrl = pdf.output('dataurlstring');
      },
      x: 10,
      y: 10,
      html2canvas: { scale: 0.6 },
      autoPaging: 'text',
    });
  };

  return (
    <div className='p-5'>
      <div className='flex gap-2 mb-2'>
      <Button onClick={handleDownloadPDF}>Download PDF</Button>
      <Button onClick={handleOnClick}>Print</Button> 
      </div>
      <div 
      ref={contentRef}
    id="Wages-Register"
    className='ml-[80px] p-4'>
      {wagesData?.map((wage, index) => (
  <div
    key={`${wage?.existingWage?.employee?.name}-${wage?.existingWage?.employee?.workManNo}-${index}`}
    id={`${wage?.existingWage?.employee?.name}-${wage?.existingWage?.employee?.workManNo}`}
    className='border-2 border-black p-2 mb-4'
  >
    <div className='flex justify-between pr-10'>
      <h1 className='uppercase'>FOR XIX</h1>
      <span className='uppercase'>Wages slip</span>
      <span>[ See Rule 78 (2) (B) ]</span>
    </div>
    <div className='flex gap-4 my-4'>
      <span>Name & Address of Contractor :- </span>
      <span className='uppercase'>
        SRI CONSTRUCTION & CO. .H.NO 78 KAPLI NEAR HARI MANDIR, .PO KAPALI
        SARAIKEA,
      </span>
    </div>
    <div>
      <h2 className='font-semibold my-2'>Contract Under</h2>
      <div className='flex gap-52'>
        <div>
          <div className='flex gap-2'>
            <span>Name of Workman :-</span>
            <span className='uppercase'>{wage?.name}</span>
          </div>
          <div className='flex gap-2'>
            <span>Nature & Location of Work :-</span>
            <span className='uppercase'></span>
          </div>
          <div className='flex gap-2'>
            <span>For the Month :-</span>
            <span className='uppercase'>
              {months[Number(wage?.month - 1)]} &nbsp; {wage?.year}
            </span>
          </div>
        </div>
        <div>
          <div className='flex gap-2'>
            <span>Workman No:-</span>
            <span className='uppercase'>
              {wage?.existingWage?.employee?.workManNo}
            </span>
          </div>
          <div className='flex gap-2'>
            <span>Account No :-</span>
            <span className='uppercase'>
              {wage?.existingWage?.employee?.accountNumber}
            </span>
          </div>
          <div className='flex gap-2'>
            <span>UAN :-</span>
            <span className='uppercase'>
              {wage?.existingWage?.employee?.UAN}
            </span>
          </div>
          <div className='flex gap-2'>
            <span>ESIC No :-</span>
            <span className='uppercase'>
              {wage?.existingWage?.employee?.ESICNo}
            </span>
          </div>
        </div>
      </div>
    </div>
    <ol className='list-decimal ml-5 my-3'>
      <li>
        <span>No. of Days Worked :- </span> <span>{wage?.attendance}</span>
      </li>
      <li>
        <span>No. of Units Worked in Case of Piece Rate of Work</span>
        {'  :- '}
        <span>-</span>
      </li>
      <li>
        <span>Rate of Daily Wages @ Piece Rate :- </span>{' '}
        <span>{wage?.designation?.PayRate}</span>
      </li>
      <li>
        <span>Amount of Wages :- </span>{' '}
        <span>
          {(wage?.designation.basic * wage?.attendance.find((ele)=>{return ele>0})).toFixed(2)} +
          {wage?.designation.DA * wage?.attendance.find((ele)=>{return ele>0}).toFixed(2)} +
          {(wage?.existingWage?.otherCash).toFixed(2)}
        </span>
      </li>
      <li>
        <span>Amount of Overtime Wages :- </span> <span></span>
      </li>
      <li>
        <span>Gross Wages Payable :- </span>{' '}
        <span>{wage?.existingWage?.total.toFixed(2)}</span>
      </li>
      <li>
        <span>Deduction if Any Advance :- </span> <span></span>
      </li>
      <li>
        <span>Net Amount of Wages Paid :- </span>{' '}
        <span>{wage?.existingWage?.netAmountPaid.toFixed(2)}</span>
      </li>
    </ol>

    <div className='my-5'>Initial of Contractor or his Representative</div>
  </div>
))}
</div>
    </div>
  );
};

export default Page;