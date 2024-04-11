import React, { useState, useEffect } from "react";
import { api } from "../client/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function StudentDataVisualization() {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState("");
  const [appliedData, setAppliedData] = useState([]);
  const [notAppliedData, setNotAppliedData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get(`/api/v1/post`);
      if (response.data) {
        setPosts(response.data);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (currentPost) {
        const appliedResponse = await api.post(`/api/v1/user/applied`, {
          postId: currentPost,
        });
        if (appliedResponse.data) {
          setAppliedData(appliedResponse.data);
        }

        const notAppliedResponse = await api.post(`/api/v1/user/notApplied`, {
          postId: currentPost,
        });
        if (notAppliedResponse.data) {
          setNotAppliedData(notAppliedResponse.data);
        }
      }
    }
    fetchData();
  }, [currentPost]);

  const handlePostChange = (event) => {
    setCurrentPost(event.target.value);
  };

  const getChartData = () => {
    return [
      { name: "Applied", count: appliedData.length },
      { name: "Not Applied", count: notAppliedData.length },
    ];
  };

  return (
    <div>
      <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
        Applied Student Data
      </h2>
      <div className="flex gap-4 items-center">
        <select
          className="w-[500px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block py-2 px-4 dark:bg-[#1E293B] dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-transparent text-base"
          value={currentPost}
          onChange={handlePostChange}
        >
          <option value="">Choose The Job Post</option>
          {posts.map((post) => (
            <option key={post._id} value={post._id}>
              {post.company_Name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100%", height: 400, marginTop: 20 }}>
        <ResponsiveContainer>
          <BarChart
            data={getChartData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StudentDataVisualization;
