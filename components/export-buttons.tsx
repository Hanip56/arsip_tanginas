"use client";

import React from "react";
import { CSVLink } from "react-csv";
import { Button } from "./ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { GrDocumentCsv, GrDocumentExcel, GrDocumentPdf } from "react-icons/gr";

type Props = {
  data: Record<string, string | number | undefined | null>[];
};

const ExportButtons = React.forwardRef<HTMLTableElement, Props>(
  ({ data }, ref) => {
    const keys = data?.[0] ? Object.keys(data[0]) : [];

    // csv
    const headers = data?.[0]
      ? keys.map((key) => ({
          label: key.substring(0, 1).toUpperCase() + key.slice(1),
          key,
        }))
      : undefined;

    // PDF
    const handlePdf = () => {
      const doc = new jsPDF({
        orientation: "landscape", // Specify landscape mode
        unit: "mm", // Measurement unit (optional)
        format: "a4",
      });
      const pdfColumn = keys.map(
        (key) => key.substring(0, 1).toUpperCase() + key.slice(1)
      );

      const pdfRows = data.map((d) => {
        const row: any[] = [];
        keys.map((key) => row.push(d[key]));
        return row;
      });

      autoTable(doc, {
        head: [pdfColumn],
        body: pdfRows,
      });

      doc.save("my-data.pdf");
    };

    // excel
    const handleExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "my-data.xlsx");
    };

    // ref
    // const handlePrint = useReactToPrint({
    //   contentRef: ref?.current,
    // });

    return (
      <div className="flex gap-2 [&>*]:text-[0.65rem]">
        <CSVLink data={data} headers={headers}>
          <Button
            type="button"
            size="sm"
            // className="text-[0.65rem] bg-yellow-600 hover:bg-yellow-600/80"
            variant="outline"
          >
            <GrDocumentCsv className="mr-2" />
            CSV
          </Button>
        </CSVLink>
        {/* <Button
          type="button"
          size="sm"
          onClick={handlePdf}
          // className="bg-orange-600 hover:bg-orange-600/80"
          variant="outline"
        >
          <GrDocumentPdf className="mr-2" />
          PDF
        </Button> */}
        <Button
          type="button"
          size="sm"
          onClick={handleExcel}
          // className="bg-green-600 hover:bg-green-600/80"
          variant="outline"
        >
          <GrDocumentExcel className="mr-2" />
          EXCEL
        </Button>
        {/* <Button type="button" size="sm" onClick={() => handlePrint()}>
          <GrPrint className="mr-2" />
          PRINT
        </Button> */}
      </div>
    );
  }
);

export default ExportButtons;
ExportButtons.displayName = "ExportButtons";
