"use client";
import FileFn from "@/lib/actions/adminAnalytics/fileData";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const Page = () => {
  const [data, setData] = useState([]);
  const [start, setStart] = useState(1); 
  const [end, setEnd] = useState(2); 
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  

      let extractedData = jsonData.slice(start - 1, end).flatMap((row) => {
        const year = row[1];
        const empCode = row[6];
        const month = row[0]; 

        const days = [];
        for (let colIndex = 58; colIndex < 58 + 31; colIndex++) {
          const status = row[colIndex];
          const day = colIndex - 57; 

          if (status) {
            let normalizedStatus = '';
            if (status === 'p' || status === 'P') {
              normalizedStatus = 'Present';
            } else if (status === 'a' || status === 'A') {
              normalizedStatus = 'Absent';
            } else {
              normalizedStatus = 'Leave';
            }
  
            days.push({
              day,
              status: normalizedStatus
            });
          } else {
            days.push({
              day,
              status: "No Data" 
            });
          }
        }

        return {
          year,
          empCode,
          month,
          days
        };
      });

      console.table(extractedData)
  
      setData(extractedData);
    };
  
    reader.readAsBinaryString(file);
  };
  

  const fn = async () => {
    const resp = await FileFn(JSON.stringify(data));
    if (resp.success) {
      toast.success("Done");
    } else {
      toast.error("Nope");
    }
  };

  return (
    <div className="ml-16">
      <h1>Upload Excel File</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <div>
        <label>Start Row:</label>
        <input
          type="number"
          value={start}
          onChange={(e) => setStart(parseInt(e.target.value, 10))}
          min="1"
        />
      </div>
      <div>
        <label>End Row:</label>
        <input
          type="number"
          value={end}
          onChange={(e) => setEnd(parseInt(e.target.value, 10))}
          min={start}
        />
      </div>

      {data.length > 0 && (
  <table className="b-1">
    <thead>
      <tr>
        <th>Year</th>
        <th>Emp Code</th>
        <th>Month</th>
        <th>Day</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        row.days.map((dayData, dayIndex) => (
          <tr key={`${index}-${dayIndex}`}>
            <td>{row.year}</td>
            <td>{row.empCode}</td>
            <td>{row.month}</td>
            <td>{dayData.day}</td>
            <td>{dayData.status}</td>
          </tr>
        ))
      ))}
    </tbody>
  </table>
)}

      <button
        onClick={() => {
          fn();
        }}
      >
        Run fn
      </button>
    </div>
  );
};

export default Page;
