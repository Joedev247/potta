import Button from "@potta/components/button";
import Modal from "@potta/components/modal";
import { useState } from "react";
import useDeleteVendor from "../hooks/useDeleteVendor";
import toast from 'react-hot-toast';
interface DeleteProps{
  vendorID: string;
}

const DeleteModal: React.FC<DeleteProps> = ({ vendorID}) => {
  const mutation = useDeleteVendor()
  const handleDelete = () => {
    mutation.mutate(vendorID,{
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success('Vendor deleted successfully!');
      },
      onError: (error) => {
        console.log(error);
        setIsModalOpen(false);
        toast.error('Failed to delete vendor please try again later');
      },
    });

  }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (

      <Modal button={false} text="Delete" title="Delete Vendor" width="full" open={isModalOpen}
      setOpen={setIsModalOpen}>
        <div className="p-4">

        <div>
          <p>Are you sure you want to delete this Vendor?</p>
        </div>
        <div className="text-center md:text-right mt-4 md:flex md:justify-end space-x-4">
               <Button onClick={() =>{handleDelete()}} isLoading={mutation.isPending} type="button" text={"Delete"} theme="red"/>
                <Button text={'Cancel'} type="button" theme="gray" color={true} onClick={() => setIsModalOpen(!isModalOpen)}/>
            </div>
        </div>
      </Modal>

  );
}
export default DeleteModal;
