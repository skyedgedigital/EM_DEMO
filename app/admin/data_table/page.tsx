"use client";

import AdminAnalytics from "@/lib/actions/adminAnalytics/adminAnalyticsAction";
import React, { CSSProperties, useState } from "react";
import toast from "react-hot-toast";
import HashLoader from "react-spinners/HashLoader";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const Page = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = ["2024", "2025", "2026", "2027"];

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    if (!selectedMonth || !selectedYear) {
      toast.error("Please select both month and year");
      return;
    }

    setLoading(true);
    try {
      const resp = await AdminAnalytics.fetchVehicles.fetchVehicleHours(
        selectedMonth,
        selectedYear
      );
      if (resp?.success) {
        toast.success("Data fetched");
        setData(JSON.parse(resp.data));
      } else {
        toast.error("Error fetching data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-base text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4">
        Vehicle Data
      </h1>
      <div className="border-[1px] border-gray-300 rounded-md shadow-lg  gap-6 mt-5 p-4 lg:w-1/2 md:w-3/4 w-full mx-auto">
        <div className="flex flex-col md:flex-row w-full gap-2 justify-center items-center">
          <div className="flex-1">
            <label className="block text-lg font-medium mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md"
              disabled={loading} // Disable during loading
            >
              <option value="">Select Month</option>
              {monthNames.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-medium mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md"
              disabled={loading}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            onClick={fetchData}
            className={`mt-6 p-2 rounded-md text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>
      {loading ? (
        // <div className="flex justify-center items-center min-h-[200px]">
        //   <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent">

        //   </div>
        // </div>
        <div className="flex justify-center items-center h-40 w-full">
          <HashLoader
            color="#000000"
            cssOverride={override}
            aria-label="Loading..."
          />
        </div>
      ) : // Render the data if not loading
      data.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full mt-5">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">
                Vehicle Number
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Total Hours
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Amount(from Challan)
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Total Fuel
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Total Fuel Cost
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Total Amount(Challan+Fuel+Compliance)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((vehicle, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {vehicle.vehicleNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {vehicle.totalHours}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {vehicle.totalCost}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {vehicle.totalFuel}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {vehicle.fuelCost}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {vehicle.fuelCost+vehicle.complianceCost+vehicle.totalCost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 flex justify-center items-center text-4xl min-h-40">
          No data available
        </p>
      )}
    </div>
  );
};

export default Page;