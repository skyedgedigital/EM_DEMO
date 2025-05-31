'use client';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

import wagesAction from '@/lib/actions/HR/wages/wagesAction';

import React, { useEffect, useState } from 'react';
import { IEnterprise } from '@/interfaces/enterprise.interface';
import { fetchEnterpriseInfo } from '@/lib/actions/enterprise';

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // const [attendanceData, setAttendanceData] = useState(null);
  const [leaveFieldsRender, setLeaveFieldsRender] = useState<{
    showCL: boolean;
    showFL: boolean;
  }>({ showCL: true, showFL: true });
  const [finalSettlementData, setFinalSettlementData] = useState(null);
  const [settle, setSettle] = useState(0);
  const [ent, setEnt] = useState<IEnterprise | null>(null);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const contentRef = React.useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  useEffect(() => {
    const fn = async () => {
      const resp = await fetchEnterpriseInfo();
      if (resp.data) {
        const inf = await JSON.parse(resp.data);
        setEnt(inf);
      }
      if (!resp.success) {
        toast.error(
          `Failed to load enterprise details, Please Reload or try later. ERROR : ${resp.error}`
        );
      }
    };
    fn();
  }, []);
  const handleOnClick = async () => {
    if (!finalSettlementData) {
      toast.error('Attendance data not available for Print generation.');
      return;
    }
    reactToPrintFn();
  };

  const handleDownloadPDF = async () => {
    if (!finalSettlementData) {
      toast.error('Attendance data not available for PDF generation.');
      return;
    }

    await generatePDF(finalSettlementData);
  };

  const generatePDF = async (finalSettlementData) => {
    const pdf = new jsPDF('p', 'pt', 'a4'); // Create a landscape PDF
    const ogId = `${searchParams.month}/${searchParams.year}`;

    // Create a container element to hold the content and table
    const originalElement = document.getElementById(ogId)!;
    const tableElement = originalElement.cloneNode(true) as HTMLElement;

    // Set the table width
    tableElement.style.width = '1250px';

    // Style the table cells (padding, border, and other styles)
    const cells = tableElement.querySelectorAll('td, th');
    cells.forEach((cell: any) => {
      // cell.style.padding = '7px';
      cell.style.border = '1px solid #000'; // Optional: Add a border for better visibility
    });

    // Adjust the margins by increasing the x and y values
    const marginX = 40; // Adjust this value to increase horizontal margin
    const marginY = 40; // Adjust this value to increase vertical margin

    // Render the table to PDF
    pdf.html(tableElement, {
      /*************  ✨ Codeium Command ⭐  *************/
      /**
       * Callback function to save the generated PDF and get the PDF data URL.
       * @async
       * @returns {Promise<void>}
       */
      /******  4ab66197-b5b0-459f-aa1c-a7e16f32c687  *******/
      callback: async () => {
        pdf.save(`${finalSettlementData?.employee?.name}_final-settlement.pdf`);
        const pdfDataUrl = pdf.output('dataurlstring');
      },
      x: marginX, // Set horizontal margin
      y: marginY, // Set vertical margin
      html2canvas: { scale: 0.5 }, // Maintain scale for better PDF rendering
      autoPaging: 'text',
    });
  };

  function getOrdinalNumber(index) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = index + 1; // +1 because your index starts from 0

    const lastDigit = value % 10;
    const lastTwoDigits = value % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return value + suffixes[1];
    } else if (lastDigit === 2 && lastTwoDigits !== 12) {
      return value + suffixes[2];
    } else if (lastDigit === 3 && lastTwoDigits !== 13) {
      return value + suffixes[3];
    } else {
      return value + suffixes[0];
    }
  }

  useEffect(() => {
    const fn = async () => {
      try {
        setFinalSettlementData(null);
        const data = {
          employee: searchParams.employee,
        };
        const filter = await JSON.stringify(data);

        const response = await wagesAction.FETCH.fetchFinalSettlement(filter);
        // console.log(JSON.parse(response.data));
        const responseData = JSON.parse(response.data);
        setFinalSettlementData(responseData);
      } catch (error) {
        toast.error('Internal Server Error');
      }
    };
    fn();
  }, []);

  useEffect(() => {
    const fn = async () => {
      try {
        if (!finalSettlementData) return;
        const totalBonusPaid =
          finalSettlementData.totalAttendancePerYear.reduce(
            (acc, e) => (!e.status ? acc + e.grossAmountYearly : acc),
            0
          );
        // I just have to change this part
        // const totalLeavePaid =
        //   finalSettlementData?.totalAttendancePerYear?.reduce(
        //     (acc, e) => (e.status ? acc + e.leave : acc),
        //     0
        //   );

        const totalLeavePaid =
          finalSettlementData.totalAttendancePerYear.reduce(
            (acc, e) =>
              !e.status
                ? acc +
                  e.EL +
                  (leaveFieldsRender.showCL ? e.CL : 0) +
                  (leaveFieldsRender.showFL ? e.FL : 0)
                : acc,
            0
          );

        const totalToBePaid =
          totalBonusPaid * 0.0833 +
          totalLeavePaid * finalSettlementData.designation.PayRate +
          (searchParams.Retrenchment_benefit
            ? finalSettlementData.designation.PayRate * 15
            : 0);

        setSettle(totalToBePaid);
      } catch (error) {
        toast.error('Internal Server Error');
      }
    };
    fn();
  }, [finalSettlementData, leaveFieldsRender.showCL, leaveFieldsRender.showFL]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Array of days (1 to 31)

  const exportToExcelHandler = async () => {
    if (!finalSettlementData) {
      toast.error('Attendance data not available for Excel generation.');
      return;
    }

    // Create new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[]]); // Initialize empty worksheet

    // Helper function to add sections
    const addSection = (data: any[][], origin?: string) => {
      XLSX.utils.sheet_add_aoa(ws, data, { origin });
    };

    // 1. Add Report Title
    addSection(
      [
        ['FINAL SETTLEMENT ANNEXURE FORM - G'],
        [], // Empty row
      ],
      'A1'
    );

    // 2. Company Information
    addSection(
      [
        [`Vendor's Name: ${ent?.name || 'N/A'}`],
        [], // Empty row
      ],
      'A3'
    );

    // 3. Employee Information (Matching your UI structure)
    const employeeInfo = [
      [
        "Employee's Name:",
        finalSettlementData.employee.name,
        'Workman SL No.:',
        finalSettlementData.employee.workManNo,
      ],
      [
        'Designation:',
        finalSettlementData.designation.designation,
        'Rate of Pay:',
        finalSettlementData.designation.PayRate,
      ],
      ['Date of Employment:', finalSettlementData.employee.appointmentDate],
      [], // Empty row
    ];
    addSection(employeeInfo, 'A5');

    // 4. Attendance Table Header
    const tableHeader = [
      [
        'Month',
        ...finalSettlementData.totalAttendancePerYear
          .map((_, index) => [
            `${getOrdinalNumber(index)} Year Days`,
            `${getOrdinalNumber(index)} Year Gross Wages`,
          ])
          .flat(),
      ],
    ];
    addSection(tableHeader, 'A9');

    // 5. Attendance Data Rows
    let rowIndex = 10;
    months.forEach((month, monthIndex) => {
      const rowData = [month];
      finalSettlementData.wages[monthIndex + 1].forEach((wage) => {
        rowData.push(wage.attendance, wage.monthlyGrossWage.toFixed(2));
      });
      addSection([rowData], `A${rowIndex}`);
      rowIndex++;
    });

    // 6. Summary Section (Matching your grid layout)
    const summaryStart = rowIndex + 2;
    addSection(
      [
        ['Total no. of days:', finalSettlementData.totalAttendance],
        ['Total Gross Wages:', finalSettlementData.totalGrossWages.toFixed(2)],
        [], // Empty row
      ],
      `A${summaryStart}`
    );

    // Leave Details (Right column in UI)
    const leaveDetails = [
      [
        'No. of EL (1 day for 20 days Working):',
        finalSettlementData.totalAttendancePerYear[
          finalSettlementData.totalAttendancePerYear.length - 1
        ]?.EL,
      ],
      ...(leaveFieldsRender.showCL
        ? [
            [
              'No. of CL (1 day for 35 days Working):',
              finalSettlementData.totalAttendancePerYear[
                finalSettlementData.totalAttendancePerYear.length - 1
              ]?.CL,
            ],
          ]
        : []),
      ...(leaveFieldsRender.showFL
        ? [
            [
              'No. of FL (1 day for 60 days Working):',
              finalSettlementData.totalAttendancePerYear[
                finalSettlementData.totalAttendancePerYear.length - 1
              ]?.FL,
            ],
          ]
        : []),
      [
        'Total no. of days for leave payment:',
        (leaveFieldsRender.showFL
          ? finalSettlementData.totalAttendancePerYear[
              finalSettlementData.totalAttendancePerYear.length - 1
            ]?.FL || 0
          : 0) +
          (leaveFieldsRender.showCL
            ? finalSettlementData.totalAttendancePerYear[
                finalSettlementData.totalAttendancePerYear.length - 1
              ]?.CL || 0
            : 0) +
          finalSettlementData.totalAttendancePerYear[
            finalSettlementData.totalAttendancePerYear.length - 1
          ]?.EL,
      ],
    ];
    addSection(leaveDetails, `D${summaryStart}`);

    // 7. Financial Details
    let financialRow = summaryStart + leaveDetails.length + 2;
    finalSettlementData.totalAttendancePerYear.forEach((e) => {
      addSection(
        [
          [
            `Total Gross Wages (April ${e.year} to March ${e.year + 1}):`,
            e.grossAmountYearly.toFixed(2),
          ],
        ],
        `A${financialRow}`
      );
      financialRow++;
    });

    let bonusRow = summaryStart + leaveDetails.length + 2;
    finalSettlementData.totalAttendancePerYear.forEach((e) => {
      addSection(
        [
          [
            `Bonus (8.33%):`,
            e.status
              ? '(Already Paid)'
              : (0.0833 * e.grossAmountYearly).toFixed(2),
          ],
        ],
        `D${bonusRow}`
      );
      bonusRow++;
    });

    // 8. Payment Details
    let leaveRow =
      financialRow + finalSettlementData.totalAttendancePerYear.length + 2;
    finalSettlementData.totalAttendancePerYear.forEach((e) => {
      addSection(
        [
          [
            `Leave Amount (${e.year}):`,
            e.status
              ? '(Already Paid)'
              : (
                  (e.EL +
                    (leaveFieldsRender.showCL ? e.CL : 0) +
                    (leaveFieldsRender.showFL ? e.FL : 0)) *
                  finalSettlementData.designation.PayRate
                ).toFixed(2),
          ],
        ],
        `A${leaveRow}`
      );
      leaveRow++;
    });

    let benefitRow =
      financialRow + finalSettlementData.totalAttendancePerYear.length + 2;
    addSection(
      [
        ['Gratuity amount:', 'N/A'],
        [
          'Retrenchment benefit:',
          searchParams.Retrenchment_benefit
            ? finalSettlementData.designation.PayRate * 15
            : 'N/A',
        ],
        ['Notice Pay:', 'N/A'],
      ],
      `D${benefitRow}`
    );

    // 9. Final Amount
    const finalAmountRow = leaveRow + 2;
    addSection(
      [
        [
          'Total amount towards full and final settlement: Rs.',
          settle.toFixed(2),
        ],
      ],
      `A${finalAmountRow}`
    );

    // Add worksheet to workbook and save
    XLSX.utils.book_append_sheet(wb, ws, 'Settlement Report');
    XLSX.writeFile(wb, `${finalSettlementData.employee.name}_settlement.xlsx`);
  };

  return (
    <div className='max-w-full px-4 md:ml-[80px] print:mx-0 print:px-0'>
      {/* Action Buttons */}
      <div className='flex flex-wrap gap-4 items-center mb-6 print:hidden'>
        <Button onClick={handleOnClick}>Print</Button>
        <Button onClick={handleDownloadPDF}>Download PDF</Button>
        <Button onClick={exportToExcelHandler}>Export to Excel</Button>
      </div>

      {finalSettlementData && (
        <div className='mb-2'>
          <fieldset>
            <legend>Choose Fields:</legend>
            <div className='flex gap-2'>
              <div>
                <input type='checkbox' id='EL' name='EL' checked disabled />
                <label htmlFor='el'>EL</label>
              </div>
              <div>
                <input
                  type='checkbox'
                  id='cl'
                  name='cl'
                  checked={leaveFieldsRender.showCL}
                  onChange={() =>
                    setLeaveFieldsRender((prevState) => {
                      return {
                        ...prevState,
                        showCL: !prevState.showCL,
                      };
                    })
                  }
                />
                <label htmlFor='cl'>CL</label>
              </div>
              <div>
                <input
                  type='checkbox'
                  id='fl'
                  name='fl'
                  checked={leaveFieldsRender.showFL}
                  onChange={() =>
                    setLeaveFieldsRender((prevState) => {
                      return {
                        ...prevState,
                        showFL: !prevState.showFL,
                      };
                    })
                  }
                />
                <label htmlFor='fl'>FL</label>
              </div>
            </div>
          </fieldset>
        </div>
      )}

      {/* Main Content */}
      <div
        id={`${searchParams.month}/${searchParams.year}`}
        ref={contentRef}
        className='bg-white p-4 md:p-6 rounded-lg shadow-sm print:shadow-none'
      >
        {/* Header Section */}
        <div className='text-center mb-8'>
          <h2 className='text-xl md:text-2xl font-bold inline-block border-b-2 border-black pb-2'>
            FINAL SETTLEMENT ANNEXURE FORM - G
          </h2>
        </div>

        {/* Employee Information Section */}
        <div className='grid grid-cols-1 md:grid-cols-1 gap-4 mb-8'>
          <div className='space-y-3'>
            <div className='font-semibold mb-8'>
              <span className='text-gray-600'>Vendor's Name: </span>
              {ent?.name ? (
                <span className='uppercase'>{ent?.name}</span>
              ) : (
                <span className='text-red-500'>
                  No company found. Try by Reloading
                </span>
              )}
            </div>

            <div className='font-semibold flex flex-wrap gap-x-24'>
              <div>
                <span className='text-gray-600'>Employee's Name: </span>
                <span className='uppercase'>
                  {finalSettlementData?.employee.name}
                </span>
              </div>
              <div>
                <span className='text-gray-600'>Workman SL No.: </span>
                <span className='uppercase'>
                  {finalSettlementData?.employee.workManNo}
                </span>
              </div>
            </div>

            <div className='font-semibold'>
              <span className='text-gray-600'>Designation: </span>
              <span className='uppercase'>
                {finalSettlementData?.designation.designation}
              </span>
            </div>

            <div className='font-semibold'>
              <span className='text-gray-600'>Rate of Pay: </span>
              <span className='uppercase'>
                {finalSettlementData?.designation.PayRate}
              </span>
            </div>

            <div className='font-semibold underline'>
              <span className='text-gray-600'>Date of Employment: </span>
              <span className='uppercase'>
                {finalSettlementData?.employee.appointmentDate}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        {finalSettlementData && (
          <div className='overflow-x-auto mb-8'>
            <table className='w-full border-collapse border border-gray-400'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-400 p-2'>Month</th>
                  {finalSettlementData.totalAttendancePerYear.map(
                    (obj, index) => (
                      <th key={index} className='border border-gray-400 p-2'>
                        <div className='flex flex-col'>
                          <div className='border-b border-gray-400 pb-1'>
                            {getOrdinalNumber(index)} year ({obj.year})
                          </div>
                          <div className='grid grid-cols-2 divide-x divide-gray-400'>
                            <div className='p-1'>
                              {getOrdinalNumber(index)} year number of days
                            </div>
                            <div className='p-1'>Gross Wages</div>
                          </div>
                        </div>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {months.map((month, index) => (
                  <tr key={index} className='hover:bg-gray-50'>
                    <td className='border border-gray-400 p-2'>{month}</td>
                    {finalSettlementData.wages[index + 1].map((wage, idx) => (
                      <td key={idx} className='border border-gray-400 p-2'>
                        <div className='grid grid-cols-2 divide-x divide-gray-400'>
                          <div className='px-2'>{wage.attendance}</div>
                          <div className='px-2'>
                            {wage.monthlyGrossWage.toFixed(2)}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className='bg-gray-100 font-bold'>
                  <td className='border border-gray-400 p-2'>TOTAL</td>
                  {finalSettlementData.totalAttendancePerYear.map(
                    (att, idx) => (
                      <td key={idx} className='border border-gray-400 p-2'>
                        <div className='grid grid-cols-2 divide-x divide-gray-400'>
                          <div className='px-2'>{att?.totalAttendance}</div>
                          <div className='px-2'>
                            {att?.grossAmountYearly.toFixed(2)}
                          </div>
                        </div>
                      </td>
                    )
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <div className='space-y-3'>
            <div className='font-semibold'>
              <span>Total no. of days: </span>
              <span>{finalSettlementData?.totalAttendance}</span>
            </div>
            <div className='font-semibold'>
              <span>Total Gross Wages: </span>
              <span>{finalSettlementData?.totalGrossWages.toFixed(2)}</span>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='font-semibold'>
              <span>No. of EL (1 day for 20 days Working): </span>
              <span className='float-right'>
                {
                  finalSettlementData?.totalAttendancePerYear[
                    finalSettlementData?.totalAttendancePerYear.length - 1
                  ]?.EL
                }
              </span>
            </div>
            {leaveFieldsRender.showCL && (
              <div className='font-semibold'>
                <span>No. of CL (1 day for 35 days Working): </span>
                <span className='float-right'>
                  {
                    finalSettlementData?.totalAttendancePerYear[
                      finalSettlementData?.totalAttendancePerYear.length - 1
                    ]?.CL
                  }
                </span>
              </div>
            )}
            {leaveFieldsRender.showFL && (
              <div className='font-semibold'>
                <span>No. of FL (1 day for 60 days Working): </span>
                <span className='float-right'>
                  {
                    finalSettlementData?.totalAttendancePerYear[
                      finalSettlementData?.totalAttendancePerYear.length - 1
                    ]?.FL
                  }
                </span>
              </div>
            )}
            <div className='font-semibold'>
              <span>Total no. of days for leave payment: </span>
              <span className='float-right'>
                {(leaveFieldsRender.showFL
                  ? finalSettlementData?.totalAttendancePerYear[
                      finalSettlementData?.totalAttendancePerYear.length - 1
                    ].FL
                  : 0) +
                  (leaveFieldsRender.showCL
                    ? finalSettlementData?.totalAttendancePerYear[
                        finalSettlementData?.totalAttendancePerYear.length - 1
                      ].CL
                    : 0) +
                  finalSettlementData?.totalAttendancePerYear[
                    finalSettlementData?.totalAttendancePerYear.length - 1
                  ].EL}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Details Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <div className='space-y-3'>
            {finalSettlementData?.totalAttendancePerYear?.map((e) => (
              <div key={e.year} className='font-semibold'>
                <span>{`Total Gross Wages (April ${e.year} to March ${
                  e.year + 1
                }): `}</span>
                <span className='float-right'>
                  {e.grossAmountYearly.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className='space-y-3'>
            {finalSettlementData?.totalAttendancePerYear?.map((e) => (
              <div key={e.year} className='font-semibold'>
                <span>Bonus (8.33%): </span>
                <span className='float-right'>
                  {e.status
                    ? '(Already Paid)'
                    : (0.0833 * e.grossAmountYearly).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <div className='space-y-3'>
            {finalSettlementData?.totalAttendancePerYear.map((e) => (
              <div key={e.year} className='font-bold'>
                <span>{`Leave Amount (${e.year}): `}</span>
                <span className='float-right'>
                  {e.status
                    ? '(Already Paid)'
                    : (
                        (e.EL +
                          (leaveFieldsRender.showCL ? e.CL : 0) +
                          (leaveFieldsRender.showFL ? e.FL : 0)) *
                        finalSettlementData?.designation.PayRate
                      ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className='space-y-3'>
            <div className='font-bold'>
              <span>Gratuity amount: </span>
              <span className='float-right'>N/A</span>
            </div>
            <div className='font-bold'>
              <span>Retrenchment benefit: </span>
              <span className='float-right'>
                {searchParams.Retrenchment_benefit
                  ? finalSettlementData?.designation?.PayRate * 15
                  : 'N/A'}
              </span>
            </div>
            <div className='font-bold'>
              <span>Notice Pay: </span>
              <span className='float-right'>N/A</span>
            </div>
          </div>
        </div>

        {/* Final Amount */}
        <div className='font-bold text-lg border-t-2 border-black pt-4'>
          <span>Total amount towards full and final settlement: Rs. </span>
          <span className='float-right'>{settle.toFixed(2)}</span>
        </div>

        {!finalSettlementData && (
          <div className='text-red-500 text-center py-4'>
            NO ATTENDANCE DATA AVAILABLE
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
