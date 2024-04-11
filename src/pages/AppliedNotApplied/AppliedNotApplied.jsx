import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import { api } from "../../client/api";
import { useSearchParams } from "react-router-dom";
import { saveAs } from "file-saver";

function TableData() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const [post, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);

  async function postFetacher() {
    const response = await api.get(`/api/v1/post`);
    if (response.data) {
      setPosts(response.data);
    }
  }

  async function fetcher() {
    const response = await api.post(`api/v1/user/applied`, {
      postId: currentPost,
    });
    if (response.data) {
      setData(response.data);
    }
  }

  async function fetcherNotApplied() {
    const response = await api.post(`api/v1/user/notApplied`, {
      postId: currentPost,
    });
    if (response.data) {
      setData(response.data);
    }
  }

  useEffect(() => {
    postFetacher();
  }, []);

  useEffect(() => {
    fetcher();
  }, [currentPost]);

  useEffect(() => {
    if (termsAccepted) {
      fetcherNotApplied();
    } else {
      fetcher();
    }
  }, [termsAccepted]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle pagination change
  const handlePaginationChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  // Calculate index of the last item on the current page
  const indexOfLastItem = page * limit;
  // Calculate index of the first item on the current page
  const indexOfFirstItem = indexOfLastItem - limit;

  // Generate table headers dynamically from the first data object
  const tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];

  function downloadCSV(data, filename) {
    const csvContent = Papa.unparse(data); // Assuming you're using PapaParse library for CSV parsing

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    if (navigator.msSaveBlob) {
      // For IE and Edge browsers
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  const handleDownload = async ({ jsonData, filename }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add headers
    const headers = Object.keys(jsonData[0]);
    worksheet.addRow(headers);

    // Add data
    jsonData.forEach((row) => {
      const rowData = [];
      headers.forEach((header) => {
        rowData.push(row[header]);
      });
      worksheet.addRow(rowData);
    });

    // Save workbook
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename + ".xlsx");
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Applied Student Data
        </h2>
        <div className="flex gap-4 items-center">
          <div className="flex w-[500px] gap-4 items-center">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
            </div>
            <label
              htmlFor="terms"
              className=" w-fit ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Not Applied
            </label>
          </div>

          <select
            id="role"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-5 dark:bg-[#1E293B] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-transparent text-base"
            value={currentPost}
            onChange={(e) => setCurrentPost(e.target.value)}
          >
            <option value="">Choose The Job Post</option>
            {post.map((post, index) => (
              <option key={post?._id} value={post?._id}>
                {post?.company_Name}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              downloadCSV(
                data.map((item) => item.student),
                "studentdata",
              )
            }
            type="submit"
            className="w-full md:w-1/2 text-white bg-[#4F46E5] focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 text-center dark:bg-[#4F46E5]  dark:focus:ring-blue-800 mx-auto"
          >
            Export to CSV
          </button>
          <button
            onClick={() =>
              handleDownload({ jsonData: data, filename: "studentdataexcl" })
            }
            type="submit"
            className="w-full md:w-1/2 text-white bg-[#4F46E5] focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 text-center dark:bg-[#4F46E5]  dark:focus:ring-blue-800 mx-auto"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="relative mt-10 overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 bg-red-500 dark:bg-[#1E293B]">
          <thead className="text-sm bg-indigo-500 dark:text-white w-full whitespace-nowrap text-white">
            <tr className="text-center w-full">
              {tableHeaders.map((header, index) => (
                <th key={index} scope="col" className="py-6 px-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 whitespace-nowrap text-center dark:text-slate-300 text-black font-medium"
              >
                {tableHeaders.map((header, index) => (
                  <td key={index} className="px-6 py-4">
                    {String(rowData[header])} {/* Convert object to string */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TableData;
