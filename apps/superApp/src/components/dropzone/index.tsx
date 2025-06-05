import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onDrop: (arg: File[]) => void
}

const MyDropzone: React.FC<Props> = ({ onDrop }) => {

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full drop border-dashed border-2 max-h-[20vh]">
      <div
        className=" w-full h-[8vh] mt-3 flex justify-center items-center rounded"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center">
          <div className="text-center mt-14">
            <center>
              <img src={"/icons/dropzone.svg"} height={50} width={50} alt="" />
            </center>
            <br />
            <p className="text-green-400 -mt-1">Max (50px 50px)</p>
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>or Drag and Drop here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDropzone;