import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableDetails = () => {
  const { collectionName } = useParams();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchTableDetails() {
    try {
      setLoading(true);
      const columnResponse = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN
        }/api/tables/${collectionName}/columns`
      );
      const filteredColumns = columnResponse.data.filter(
        (col) => col.COLUMN_NAME !== "_id"
      );
      setColumns(filteredColumns);

      const rowResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tables/${collectionName}`
      );
      setRows(rowResponse.data);
      console.log(rowResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const truncateDescription = (description, maxWords) => {
    const words = description.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return description;
  };

  const renderCellContent = (cellData) => {
    console.log(cellData);
    if (cellData === null || cellData === undefined) {
      return "Empty"; // Show 'Empty' for null or undefined
    }

    if (typeof cellData === "object") {
      return JSON.stringify(cellData); // Convert objects to JSON strings
    }

    if (typeof cellData === "boolean") {
      return cellData ? "True" : "False"; // Display boolean values as True/False
    }

    // Base URL for media files
    const baseUrl = "http://localhost:9000";

    // Check if the cell data is an image URL
    if (
      typeof cellData === "string" &&
      cellData.match(/\.(jpeg|jpg|gif|png|webp)$/)
    ) {
      const imageUrl = `${baseUrl}${cellData}`;
      return (
        <a
          className="underline font-medium"
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Image
        </a>
      );
    }

    // Check if the cell data is an audio URL
    if (typeof cellData === "string" && cellData.match(/\.(mp3)$/)) {
      const audioUrl = `${baseUrl}${cellData}`;
      return (
        <a
          className="underline font-medium"
          href={audioUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Listen Audio
        </a>
      );
    }

    // Check if the cell data is a video URL
    if (typeof cellData === "string" && cellData.match(/\.(mp4|mkv)$/)) {
      const videoUrl = `${baseUrl}${cellData}`;
      return (
        <a
          className="underline font-medium"
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch Video
        </a>
      );
    }

    // Check if the cell data is a base64 string
    if (typeof cellData === "string" && cellData.startsWith("data:")) {
      const blob = new Blob([cellData], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      if (cellData.includes("audio")) {
        return (
          <a
            className="underline font-medium"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Listen Audio
          </a>
        );
      } else if (cellData.includes("video")) {
        return (
          <a
            className="underline font-medium"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch Video
          </a>
        );
      }
    }

    return cellData.toString(); // Convert other types to string
  };

  useEffect(() => {
    fetchTableDetails();
  }, [collectionName]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold py-4">{collectionName} Data</h1>
      <Table className="w-full my-10 border rounded-3xl p-10">
        <TableHeader>
          <TableRow className="text-sm">
            {columns.map((col) => (
              <TableHead
                className="uppercase font-bold text-center"
                key={col.COLUMN_NAME}
              >
                {col.COLUMN_NAME}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow className="text-sm " key={rowIndex}>
                {columns.map((col) => (
                  <TableCell
                    className="text-center min-w-36 h-20 font-light"
                    key={col.COLUMN_NAME}
                  >
                    {col.COLUMN_NAME === "date_of_birth"
                      ? formatDate(row[col.COLUMN_NAME])
                      : col.COLUMN_NAME === "description"
                      ? truncateDescription(row[col.COLUMN_NAME], 20)
                      : renderCellContent(row[col.COLUMN_NAME])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
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
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDetails;
