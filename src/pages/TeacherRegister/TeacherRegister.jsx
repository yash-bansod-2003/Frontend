import * as React from "react";
import { useAuth } from "../../context/auth";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../client/api";

function TeacherRegister() {
  const { user } = useAuth();

  if (user?.Role !== "tpo") {
    return <Navigate to="/dashboard" replace />;
  }
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    Email_ID: "",
    First_Name: "",
    Middle_Name: "",
    Last_Name: "",
    Password: "",
    Conform_Passwprd: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit() {
    for (let key in formData) {
      if (formData[key] === "") {
        return toast.error(`${key} Filed is required..!`);
      }
    }

    if (formData.Password !== formData.Conform_Passwprd) {
      return toast.error(`Passwprd and Conform_Passwprd must be same`);
    }

    try {
      setIsLoading(true);
      const response = await api.post("/api/v1/user/register", {
        Email_ID: formData.Email_ID,
        Full_Name: `${formData.First_Name} ${formData.Middle_Name} ${formData.Last_Name}`,
        Password: formData.Password,
      });

      if (response.data) {
        for (let key in formData) {
          formData[key] = "";
        }

        return toast.success("teacher created successfully!", {
          position: "top-center",
        });
      }
    } catch (error) {
      setIsLoading(false);
      return toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-1 mx-auto my-7">
      <ToastContainer />
      <div>
        <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          Register New Teacher
        </h2>
      </div>
      {user && (
        <form>
          <div className="bg-white rounded-xl shadow text-gray-900 dark:text-white dark:bg-slate-800">
            <div className="relative h-5 rounded-t-xl bg-cover bg-center">
              <div className="absolute top-0 right-0 p-4"></div>
            </div>

            <div className="pt-0 p-4 sm:pt-0 sm:p-7">
              <div className="space-y-4 sm:space-y-6">
                <div className="pb-2">
                  <h1 className="block mb-2 text-md font-medium text-gray-900 dark:text-blue-500" />
                  <h1 className="text-2xl font-semibold mb-4 text-[#4F46E5] mt-10">
                    Personal Information
                  </h1>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="city"
                        className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        First Name
                      </label>
                      <div className="mt-2">
                        <input
                          disabled={isLoading}
                          value={formData.First_Name}
                          onChange={handleInputChange}
                          name="First_Name"
                          type="text"
                          id="city"
                          autoComplete="address-level2"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-5 dark:bg-[#1E293B] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-transparent text-base"
                          placeholder="First Name"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="region"
                        className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Middle Name
                      </label>
                      <div className="mt-2">
                        <input
                          disabled={isLoading}
                          value={formData.Middle_Name}
                          onChange={handleInputChange}
                          name="Middle_Name"
                          type="text"
                          id="region"
                          autoComplete="address-level1"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-5 dark:bg-[#1E293B] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-transparent text-base"
                          placeholder="Middle Name"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="Last Name"
                        className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Last Name
                      </label>
                      <div className="mt-2">
                        <input
                          disabled={isLoading}
                          value={formData.Last_Name}
                          onChange={handleInputChange}
                          name="Last_Name"
                          type="text"
                          id="Last Name"
                          autoComplete="Last Name"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-5 dark:bg-[#1E293B] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-transparent text-base"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          disabled={isLoading}
                          value={formData.Email_ID}
                          onChange={handleInputChange}
                          name="Email_ID"
                          id="email"
                          type="email"
                          autoComplete="email"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-5 dark:bg-[#1E293B] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-transparent text-base"
                          placeholder="you@gmail.com"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="city"
                        className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <div className="mt-2">
                        <input
                          disabled={isLoading}
                          value={formData.Password}
                          onChange={handleInputChange}
                          name="Password"
                          type="text"
                          id="city"
                          autoComplete="address-level2"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-5 dark:bg-[#1E293B] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-transparent text-base"
                          placeholder="XXXX XXXX XXXX"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="Last Name"
                        className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        conform password
                      </label>
                      <div className="mt-2">
                        <input
                          disabled={isLoading}
                          value={formData.Conform_Passwprd}
                          onChange={handleInputChange}
                          name="Conform_Passwprd"
                          type="text"
                          id="Last Name"
                          autoComplete="Last Name"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-5 dark:bg-[#1E293B] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-transparent text-base"
                          placeholder="XXXX XXXX XXXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-center gap-x-2">
                  <button
                    disabled={isLoading}
                    onClick={() => handleSubmit()}
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    {isLoading ? "Loading..." : "Register Teacher"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End Card */}
        </form>
      )}
    </div>
  );
}

export default TeacherRegister;
