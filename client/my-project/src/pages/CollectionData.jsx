import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader"; // Assuming you have a Loader component

const TableDetails = () => {
  const { collectionName } = useParams();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTableDetails() {
      try {
        setLoading(true);
        const columnResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_DOMAIN
          }/api/tables/${collectionName}/columns`
        );
        setColumns(columnResponse.data);

        const rowResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tables/${collectionName}`
        );
        setRows(rowResponse.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTableDetails();
  }, [collectionName]);

  const handleInputChange = (e) => {
    setNewRow({
      ...newRow,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold py-4">{collectionName} Data</h1>
      <table className="w-full my-10">
        <thead>
          <tr className="flex justify-between items-center text-sm">
            {columns.map((col) => (
              <th className="uppercase" key={col.COLUMN_NAME}>
                {col.COLUMN_NAME}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr className="flex justify-between items-center text-sm" key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.COLUMN_NAME}>{row[col.COLUMN_NAME]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex justify-center items-center flex-col mt-40 text-xl gap-4 rounded-3xl">
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
                  <p>No Data Found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableDetails;
