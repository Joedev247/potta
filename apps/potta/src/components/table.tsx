import React, { FC, useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import Checkbox from '@material-ui/core/Checkbox';
import CustomLoader from './loader';


interface DataTableProps {
    columns: any[];
    data: any[];
}

const Table: FC<DataTableProps> = ({ columns, data }) => {
    const selectProps = {
        indeterminate: (isIndeterminate: boolean) => isIndeterminate,
    };

    const customCheckbox: any = React.forwardRef((props: any, ref: any) => (
        <Checkbox
            {...props}
            inputRef={ref}
            color="primary"
        />
    ));

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f3fbfb', // Header background color
            },
        },
        headCells: {
            style: {
                fontSize: '18px', // Header text size
                // borderTop: '0.05px solid #ccc',
                // borderLeft: '0.05px solid #ccc',
                borderRight: '0.05px solid #ccc',
            },
        },
        cells: {
            style: {
                borderBottom: '0.05px solid #ccc',
                // borderLeft: '0.05px solid #ccc',
                borderRight: '0.05px solid #ccc',
                fontSize: '16px',
            },
        },
    };

    const [active, setactive] = useState(false)
    const [pending, setPending] = useState<boolean>(true);

    useEffect(() => {
        const timeout = setTimeout(() => {

            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);
    return (
        <div className={pending ? '' : 'border-l border-t'}>
            <DataTable
                columns={columns}
                data={data}
                selectableRows
                selectableRowsComponent={customCheckbox}
                selectableRowsComponentProps={selectProps}
                defaultSortFieldId="id"
                defaultSortAsc={true}
                pagination={active}
                highlightOnHover
                dense
                progressPending={pending}
                progressComponent={<CustomLoader />}
                customStyles={customStyles} // Apply custom styles here
            />
        </div>
    );
};

export default Table;
