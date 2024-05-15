import Loader from "@/components/Loader";
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

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {entitys.length > 0 ? (
        <div className="grid grid-cols-3 place-items-center gap-y-20 w-full">
          {entitys.map((entity, ind) => {
            return (
              <div
                key={ind}
                onClick={() =>
                  navigate(`/collection/${entity.Tables_in_vahan_assignment}`)
                }
                className="w-96 h-60 flex items-center justify-center text-3xl uppercase bg-gray-100 rounded-3xl cursor-pointer shadow-2xl hover:scale-95 transition-all duration-100"
              >
                {entity.Tables_in_vahan_assignment}
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
