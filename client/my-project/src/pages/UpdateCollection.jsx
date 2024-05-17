import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCollection = () => {
  const { name } = useParams();
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/tables/update`,
        { oldName, newName }
      );
      navigate("/");
      toast.success("Database name updated successfully");
    } catch (error) {
      console.error("Error updating database name:", error);
      toast.error("Error updating database name");
    }
  };

  useEffect(() => {
    setOldName(name);
  }, [name]);

  return (
    <div className="max-w-screen-sm mx-auto">
      <h2 className="text-xl my-10">Update Database Name</h2>
      <form
        className="flex justify-center flex-col gap-6 items-start border-4 p-10 rounded-3xl"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          value={oldName}
          onChange={(e) => setOldName(e.target.value)}
          placeholder="Old Database Name"
          required
          readOnly
        />
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New Database Name"
          required
        />
        <Button type="submit">Update Name</Button>
      </form>
    </div>
  );
};

export default UpdateCollection;
