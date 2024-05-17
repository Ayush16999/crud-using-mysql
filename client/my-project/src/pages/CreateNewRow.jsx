import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader"; // Assuming you have a Loader component
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const CreateNewRow = () => {
  const { collectionName } = useParams();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    const { name, value, files } = e.target;
    if (files) {
      setNewRow({
        ...newRow,
        [name]: files[0],
      });
    } else {
      setNewRow({
        ...newRow,
        [name]: value,
      });
    }
  };

  const handleAddRow = async () => {
    const formData = new FormData();
    for (const key in newRow) {
      formData.append(key, newRow[key]);
    }

    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN
        }/api/tables/${collectionName}/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Row Added Successfully!");
      setNewRow({});
      navigate(-1);
    } catch (error) {
      console.log(error);
      toast.error("Error in adding row");
    }
  };

  const getInputType = (dataType) => {
    switch (dataType) {
      case "bigint":
        return "number";
      case "varchar(255)":
      case "TEXT":
        return "text";
      case "boolean":
        return "checkbox";
      case "date":
        return "date";
      case "blob":
      case "mediumblob":
      case "longblob":
        return "file";
      default:
        return "text";
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-screen-sm mx-auto">
      <h1 className="text-4xl font-bold text-center py-4">
        Create new {collectionName}
      </h1>
      <div>
        {columns
          .filter((col) => col.COLUMN_NAME !== "_id")
          .map((col) => (
            <div className="my-4" key={col.COLUMN_NAME}>
              <Label>{col.COLUMN_NAME}</Label>
              <Input
                type={getInputType(col.DATA_TYPE)}
                name={col.COLUMN_NAME}
                value={
                  col.DATA_TYPE.includes("blob")
                    ? undefined
                    : newRow[col.COLUMN_NAME] || ""
                }
                onChange={handleInputChange}
                placeholder={`Enter ${col.COLUMN_NAME}`}
                {...(col.DATA_TYPE.includes("blob") && { accept: "image/*" })}
              />
            </div>
          ))}
        <Button className="w-full bg-indigo-600" onClick={handleAddRow}>
          Add Row
        </Button>
      </div>
    </div>
  );
};

export default CreateNewRow;
