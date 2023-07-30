import React, { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Sidebar from '../../components/sidebar/side-bar';
import { User } from '../../types/user';
import './styles.scss';
import { ROLE } from '../../types/role';
import { SettingsOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { Box } from '@mui/material';
import { handleDelete } from './handleDelete';
import { getUsers } from '../../api/users';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import Title from './main-title';

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', role: ROLE.USER },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', role: ROLE.USER },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', role: ROLE.USER },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', role: ROLE.USER },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', role: ROLE.USER },
//   { id: 6, lastName: 'fdsdfs', firstName: 'fdjsfjk', role: ROLE.USER },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', role: ROLE.USER },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', role: ROLE.USER },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', role: ROLE.USER },
// ];

const UserManagment: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = useCurrentUser();
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      valueGetter: (params: GridValueGetterParams) => {
        const id = params.id.toString();
        return id.length > 4 ? id.substring(id.length - 4) : id;
      },
    },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },

    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'role',
      headerName: 'User Role',
      type: 'number',
      width: 100,
    },

    {
      field: 'Actions',
      headerName: 'Actions',
      width: 300,
      align: 'center',
      renderCell: (params: GridCellParams) => {
        const handleEdit = () => {
          // Handle edit action here...
          console.log(`Editing user with ID ${params.id}`);
        };
        return (
          <>
            {currentUser?.role === ROLE.ADMIN ? (
              <Box
                justifyContent={'space-around'}
                alignItems={'center'}
                display={'flex'}
                width={'20rem'}>
                <button className="rmv-default button" onClick={handleEdit}>
                  <SettingsOutlined />
                  <p>Modify User</p>
                </button>
                <button
                  className="rmv-default button"
                  onClick={() => handleDelete(params.id.toString())}>
                  <RemoveCircleOutline />
                  <p>Delete User</p>
                </button>
              </Box>
            ) : (
              <p>Users don't have permissions</p>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await getUsers();
      setUsers(data);
    };
    fetchUsers();
    console.log(users);
  }, []);

  return (
    <div className="flex">
      <Sidebar user={currentUser} />
      <div className="container">
        {
          <div className="management-container">
            <Title />
            <DataGrid
              rows={users}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        }
      </div>
    </div>
  );
};

export default UserManagment;
