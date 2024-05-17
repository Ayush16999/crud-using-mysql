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

  const navigate = useNavigate();

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

  const deleteColumn = (index) => {
    const updatedColumns = columns.filter((_, colIndex) => colIndex !== index);
    setColumns(updatedColumns);
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
        toast.error("Error: Enter minimum 3 characters for column name");
        return;
      }
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/createTable`,
        { tableName, columns }
      );
      toast.success("New Entity Created Successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Error: Cannot Create New Entity");
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto min-h-[60vh] flex flex-col justify-around border-4 bg-black/10 p-10 rounded-3xl">
      <h1 className="text-3xl max-sm:text-xl font-bold text-center my-4">
        Create New Collection
      </h1>
      <div>
        <div>
          <Input
            type="text"
            value={tableName.replace(/_/g, " ")} // Show spaces in the input field
            onChange={(e) => handleTableNameChange(e.target.value)}
            className="h-14 border max-sm:h-12"
            placeholder="Enter Collection name"
            description=""
            required
          />
          <span className="text-xs px-2">
            Enter table name minimum 3 characters
          </span>
        </div>
        {columns.map((column, index) => (
          <div
            key={index}
            className="flex items-center w-full flex-col space-x-2 my-4"
          >
            <div className="flex items-center max-sm:flex-wrap justify-start max-sm:justify-end w-full">
              <div className="flex items-center w-full">
                <span className="mr-2">{index + 1}</span>
                <Input
                  type="text"
                  value={column.name.replace(/_/g, " ")}
                  onChange={(e) =>
                    handleColumnChange(index, "name", e.target.value)
                  }
                  className="h-12 max-sm:h-10 mr-2 max-sm:mr-0"
                  placeholder="Column name"
                />
              </div>
              <Select
                defaultValue={column.dataType}
                onValueChange={(value) =>
                  handleColumnChange(index, "dataType", value)
                }
              >
                <SelectTrigger className="w-24 h-12 max-sm:h-10 bg-indigo-600 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-600 text-white">
                  <SelectItem value="BIGINT">Number</SelectItem>
                  <SelectItem value="VARCHAR(255)">String</SelectItem>
                  <SelectItem value="BOOLEAN">Boolean</SelectItem>
                  <SelectItem value="TEXT">Text</SelectItem>

                  <SelectItem value="DATE">Date</SelectItem>
                  <SelectItem value="BLOB">Image</SelectItem>
                  <SelectItem value="MEDIUMBLOB">Audio</SelectItem>
                  <SelectItem value="LONGBLOB">Video</SelectItem>
                </SelectContent>
              </Select>
              {index > 0 && (
                <Button
                  className="ml-2 h-12 bg-red-600"
                  onClick={() => deleteColumn(index)}
                >
                  Delete
                </Button>
              )}
            </div>
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
