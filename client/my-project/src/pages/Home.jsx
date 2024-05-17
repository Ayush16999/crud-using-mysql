import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [entitys, setEntitys] = useState([]);

  const navigate = useNavigate();

  async function getEmployees() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tables`
      );
      const data = response.data;
      setEntitys(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getEmployees();
  }, []);
  
  
  useEffect(() => {
    deleteTable();
  }, [entitys]);




  const deleteTable = (tableName) => {
    setLoading(true);
    axios.delete(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/tables/${tableName}`)
      .then(() => {
        setEntitys(
          entitys.filter(
            (entity) => entity.Tables_in_vahan_assignment !== tableName
          )
        );
        toast.success("Collection Deleted Successfully!");
      })
      .catch((error) => {
        toast.error("Error: Cannot delete table");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <p className="text-center mb-10 uppercase underline">
        double click To Open a collection
      </p>
      <h1 className="text-2xl font-bold mb-10">ALL COLLECTIONS ARE BELOW:-</h1>
      {entitys.length > 0 ? (
        <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 place-items-center gap-10 w-full">
          {entitys.map((entity, ind) => {
            return (
              <div
                key={ind}
                onDoubleClick={() =>
                  navigate(`/collection/${entity.Tables_in_vahan_assignment}`)
                }
                className="w-full relative px-10 h-fit py-20 flex items-center justify-center text-3xl uppercase bg-gray-100 rounded-3xl border-4 shadow-2xl transition-all duration-100"
              >
                {entity.Tables_in_vahan_assignment}
                <span className="bg-red-600 w-10 h-10 border absolute cursor-pointer z-20 -bottom-10 right-0 p-2 rounded-full">
                  <svg
                    onClick={() =>
                      deleteTable(entity.Tables_in_vahan_assignment)
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </span>
                <span className="bg-yellow-600 absolute cursor-pointer z-20 -bottom-10 left-0 p-2 rounded-full">
                  <svg
                    onClick={() =>
                      navigate(
                        `/update/collection/${entity.Tables_in_vahan_assignment}`
                      )
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col mt-40 text-xl h-[50vh] gap-4 bg-indigo-50 rounded-3xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="blue"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p>No Data Founds</p>
        </div>
      )}
    </>
  );
};

export default Home;
