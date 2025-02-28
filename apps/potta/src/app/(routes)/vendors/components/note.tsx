import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface NotesProps {
    register: UseFormRegister<any>;
    errors?: FieldError;
}

const Notes: React.FC<NotesProps> = ({ register, errors }) => {
    return (
        <div className="mt-4 w-full">
            <p className="mb-2">Notes</p>
            <textarea
                {...register("notes")}
                className="w-full border outline-none p-2 h-36"
                placeholder="Enter any additional notes..."
            />
            {errors && <small className="text-red-500">{errors.message}</small>}
        </div>
    );
};

export default Notes;
