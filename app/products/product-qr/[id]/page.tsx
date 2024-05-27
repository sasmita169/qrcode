import React from "react";
import ManageQR from "@/components/qr/ManageQR";

const GenerateQR = ({ params }: { params: { id: string } }) => {
  return <ManageQR id={params.id} />;
};

export default GenerateQR;
