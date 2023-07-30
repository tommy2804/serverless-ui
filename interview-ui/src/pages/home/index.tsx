import React, { useContext } from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import Sidebar from "../../components/sidebar/side-bar";
import "./styles.scss";
import { ROLE } from "../../types/role";
import { SettingsOutlined, RemoveCircleOutline } from "@mui/icons-material";
import { Box } from "@mui/material";
import { handleDelete } from "./handleDelete";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Title from "./main-title";
import { UserContext } from "../../state/users-context";
import editUserDialog from "./edit-user-dialog";

const UserManagment: React.FC = () => {
  const currentUser = useCurrentUser();
  const { users, onDeleteUser, onEditUser } = useContext(UserContext);

  const handleEditUser = async (id: string) => {
    try {
      const result = await editUserDialog({
        name: users?.find((user) => user.id === id)?.firstName,
      });
      if (result.value) {
        const { email, firstName, lastName } = result.value;
        onEditUser(id, { email, lastName, firstName });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      valueGetter: (params: GridValueGetterParams) => {
        const id = params.id.toString();
        return id.length > 4 ? id.substring(id.length - 4) : id;
      },
    },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },

    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    {
      field: "role",
      headerName: "User Role",
      type: "number",
      width: 100,
    },

    {
      field: "Actions",
      headerName: "Actions",
      width: 300,
      align: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <>
            {currentUser?.role === ROLE.ADMIN ? (
              <Box
                justifyContent={"space-around"}
                alignItems={"center"}
                display={"flex"}
                width={"20rem"}
              >
                <button
                  className="rmv-default button"
                  onClick={() => handleEditUser(params.id.toString())}
                >
                  <SettingsOutlined />
                  <p>Modify User</p>
                </button>
                <button
                  className="rmv-default button"
                  onClick={() =>
                    handleDelete(() => onDeleteUser(params.id.toString()))
                  }
                >
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

  return (
    <div className="flex">
      <Sidebar user={currentUser} />
      <div className="container">
        {
          <div className="management-container">
            <Title user={currentUser} />
            <DataGrid
              rows={users}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </div>
        }
      </div>
    </div>
  );
};

export default UserManagment;
