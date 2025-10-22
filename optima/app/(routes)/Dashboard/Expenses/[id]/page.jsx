"use client";
import { useParams } from "next/navigation";
import Expenses from "./expenses"; // Adjust the import path if needed
import Sidebar from "../../_components/Sidebar"; // Adjust the path if necessary

export default function ExpensesPage() {
  const { id } = useParams();

  return (
    <div className="flex">
      {/* Sidebar - Fixed on the side */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Expenses id={id} />
      </div>
    </div>
  );
}
