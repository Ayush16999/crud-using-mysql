import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateEntity = () => {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([
    { name: "", dataType: "", defaultValue: "" },
  ]);
  const [message, setMessage] = useState("");
  const [tables, setTables] = useState([]);

  useEffect(() => {
    // Fetch all tables on component mount
    axios
      .get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/tables`)
      .then((response) => {
        setTables(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tables:", error);
      });
  }, []);

  const addColumn = () => {
    setColumns([...columns, { name: "", dataType: "", defaultValue: "" }]);
  };

  const handleColumnChange = (index, key, value) => {
    const updatedColumns = [...columns];
    if (key === "name") {
      // Replace spaces with underscores for column names
      updatedColumns[index][key] = value.replace(/\s+/g, "_");
    } else {
      updatedColumns[index][key] = value;
    }
    setColumns(updatedColumns);
  };

  const handleTableNameChange = (value) => {
    setTableName(value.replace(/\s+/g, "_"));
  };

  const handleSubmit = async () => {
    // Validate column names
    for (const column of columns) {
      if (column.name.length < 3) {
        setTableName("");
        setColumns([{ name: "", dataType: "", defaultValue: "" }]);
        toast.error("Error: Enter minimum 3 characters for column name");
        return;
      }
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/createTable`,
        { tableName, columns }
      );
      setMessage(response.data.message);
      toast.success("New Entity Created Successfully!");
    } catch (error) {
      setMessage("Failed to create table");
      toast.error("Error: Cannot Create New Entity");
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto min-h-[60vh] flex flex-col justify-around border-4 bg-black/10 p-10 rounded-3xl">
      <h1 className="text-3xl font-bold text-center my-4">
        Create New Collection
      </h1>
      <div>
        <div>
          <Input
            type="text"
            value={tableName.replace(/_/g, " ")} // Show spaces in the input field
            onChange={(e) => handleTableNameChange(e.target.value)}
            className="h-14"
            placeholder="Enter table name"
            description=""
            required
          />
          <span className="text-xs   px-2">
            Enter table name minimum 3 characters
          </span>
        </div>
        {columns.map((column, index) => (
          <div
            key={index}
            className="flex items-center w-full flex-col space-x-2 my-4"
          >
            <div className="flex items-center justify-start w-full">
              <span className="mr-2">{index + 1}</span>
              <Input
                type="text"
                value={column.name.replace(/_/g, " ")}
                onChange={(e) =>
                  handleColumnChange(index, "name", e.target.value)
                }
                className="h-12 mr-2"
                placeholder="Column name"
              />
              <Select
                defaultValue={column.dataType}
                onValueChange={(value) =>
                  handleColumnChange(index, "dataType", value)
                }
              >
                <SelectTrigger className="w-[150px] h-12 bg-indigo-600 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-600 text-white">
                  <SelectItem value="INT">Number</SelectItem>
                  <SelectItem value="VARCHAR(255)">String</SelectItem>
                  <SelectItem value="BOOLEAN">Boolean</SelectItem>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="DATE">Date</SelectItem>
                  <SelectItem value="BLOB">Image</SelectItem>
                  <SelectItem value="MEDIUMBLOB">Audio</SelectItem>
                  <SelectItem value="LONGBLOB">Video</SelectItem>
                  {/* Add more data types as needed */}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs  px-4 w-full">
              Enter column name minimum 3 characters
            </p>
          </div>
        ))}
        <Button className="float-end bg-green-700 mb-4" onClick={addColumn}>
          Add Column
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </span>
        </Button>
      </div>
      <Button className="h-12" onClick={handleSubmit}>
        Create Collection
      </Button>
    </div>
  );
};

export default CreateEntity;
