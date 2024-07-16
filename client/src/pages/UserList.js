import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { HiOutlineExclamationCircle, HiPlusCircle } from "react-icons/hi";
import { IoIosRefreshCircle } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  IconButton,
} from "@mui/material";
import { Modal } from "flowbite-react";

const UserList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", username: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const userDetails = async () => {
    try {
      const store = JSON.parse(localStorage.getItem("userData") || "{}");
      const apiToken = store?.data?.token;
      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      const response = await axios.post(
        "http://localhost:8000/user/list",
        null,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      setLoading(false);
      setData(response?.data?.data);
    } catch (error) {
      console.error(error.message || "Error fetching user details");
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await userDetails();
      } catch (error) {
        console.error(error?.message || "Error in authentication check");
      }
    };

    checkAuth();
  }, []);

  // Delete user
  const deleteUser = async () => {
    if (!userIdToDelete) return;

    try {
      const store = JSON.parse(localStorage.getItem("userData") || "{}");
      const apiToken = store?.data?.token;

      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      await axios.delete(`http://localhost:8000/user/delete/${userIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      await userDetails();
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setUserIdToDelete(null);
    } catch (error) {
      console.error(error.message || "Error deleting user");
      toast.error("Failed to delete user");
    }
  };

  // Edit user
  const editUser = async () => {
    if (!userToEdit) return;

    try {
      const store = JSON.parse(localStorage.getItem("userData") || "{}");
      const apiToken = store?.data?.token;

      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      await axios.put(`http://localhost:8000/user/update/${userToEdit._id}`, userToEdit, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      await userDetails();
      toast.success("User updated successfully");
      setEditModalOpen(false);
      setUserToEdit(null);
    } catch (error) {
      console.error(error.message || "Error updating user");
      toast.error("Failed to update user");
    }
  };

  // Create user
  const createUser = async () => {
    try {
      const store = JSON.parse(localStorage.getItem("userData") || "{}");
      const apiToken = store?.data?.token;
      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      await axios.post('http://localhost:8000/user/create', newUser, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      await userDetails();
      toast.success("User created successfully");
      setCreateModalOpen(false);
      setNewUser({ name: "", email: "", username: "" });
    } catch (error) {
      console.error(error.message || "Error creating user");
      toast.error("Failed to create user");
    }
  };

  // Get filtered and paginated data
  const filteredData = data.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(+event.target.value);
    setCurrentPage(0);
  };

  const handleDeleteClick = (id) => {
    setUserIdToDelete(id);
    setDeleteModalOpen(true);
    console.log(id, "id")
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditModalOpen(true);
    console.log(user)
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  return (
    <>
      <div>
        <div className="p-1">
          <Alert severity="info" className="my-2">
            Info alert! Change a few things up and try submitting again.
          </Alert>
          <h1 className="my-10 ml-7 text-xl font-semibold ">
            User List
            <div className="float-right">
              <div className="flex space-x-2">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<HiPlusCircle />}
                  onClick={handleCreateClick}
                >
                  Add User
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<IoIosRefreshCircle />}
                  onClick={() => {
                    userDetails();
                    toast.success("Record refreshed");
                  }}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </h1>
          <div className="flex justify-end items-end mb-3">
            <TextField
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
            />
          </div>
          <div className="overflow-x-auto">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Licenses</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [...Array(itemsPerPage)].map((_, index) => (
                      <TableRow key={index}>
                        {[...Array(6)].map((_, idx) => (
                          <TableCell key={idx}>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    paginatedData.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {currentPage * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.licenses?.length}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(user?._id)}
                          >
                            <FaEdit />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDeleteClick(user._id)}
                          >
                            <RiDeleteBin6Fill />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>

      {/* Delete User Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        aria-labelledby="delete-user-modal"
        aria-describedby="delete-user-modal-description"
      >
        <div className="modal-content">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
          <h3 className="mb-5 text-lg font-normal text-gray-500">
            Are you sure you want to delete this user?
          </h3>
          <div className="flex justify-center gap-4">
            <Button variant="contained" color="secondary" onClick={deleteUser()}>
              Yes, I'm sure
            </Button>
            <Button
              variant="contained"
              color="default"
              onClick={() => setDeleteModalOpen(false)}
            >
              No, cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-user-modal"
        aria-describedby="edit-user-modal-description"
      >
        <div className="modal-content">
          <h3 className="mb-5 text-lg font-normal text-gray-500">Edit User</h3>
          <div className="flex flex-col gap-4">
            <TextField
              label="Name"
              value={userToEdit?.name || ""}
              onChange={(e) =>
                setUserToEdit({
                  ...userToEdit,
                  name: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              value={userToEdit?.email || ""}
              onChange={(e) =>
                setUserToEdit({
                  ...userToEdit,
                  email: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Username"
              value={userToEdit?.username || ""}
              onChange={(e) =>
                setUserToEdit({
                  ...userToEdit,
                  username: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="contained" color="primary" onClick={editUser()}>
              Save
            </Button>
            <Button
              variant="contained"
              color="default"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create User Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        aria-labelledby="create-user-modal"
        aria-describedby="create-user-modal-description"
      >
        <div className="modal-content">
          <h3 className="mb-5 text-lg font-normal text-gray-500">Add User</h3>
          <div className="flex flex-col gap-4">
            <TextField
              label="Name"
              value={newUser.name || ""}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  name: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              value={newUser.email || ""}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  email: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Username"
              value={newUser.username || ""}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  username: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="contained" color="primary" onClick={createUser}>
              Save
            </Button>
            <Button
              variant="contained"
              color="default"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserList;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { FaEdit } from "react-icons/fa";
// import { HiOutlineExclamationCircle, HiPlusCircle } from "react-icons/hi";
// import { IoIosRefreshCircle } from "react-icons/io";
// import { RiDeleteBin6Fill } from "react-icons/ri";
// import {
//   Button,
//   Modal,
//   Table,
//   TextInput,
//   Pagination,
//   Label,
// } from "flowbite-react"; // Assuming flowbite-react contains these components

// const UserList = () => {
//   const [data, setData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [createModalOpen, setCreateModalOpen] = useState(false);
//   const [userIdToDelete, setUserIdToDelete] = useState(null);
//   const [userToEdit, setUserToEdit] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [newUser, setNewUser] = useState({ name: "", email: "", username: "" });
//   const [searchQuery, setSearchQuery] = useState("");

//   const userDetails = async () => {
//     try {
//       const store = JSON.parse(localStorage.getItem("userData") || "{}");
//       const apiToken = store?.data?.token;
//       console.log(apiToken);
//       if (!apiToken) {
//         throw new Error("Missing authorization token");
//       }

//       const response = await axios.post(
//         "http://localhost:8000/user/list",
//         null,
//         {
//           headers: {
//             Authorization: `Bearer ${apiToken}`,
//           },
//         }
//       );
//       setLoading(false);
//       setData(response?.data?.data);
//     } catch (error) {
//       console.error(error.message || "Error fetching user details");
//       throw error;
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         await userDetails();
//       } catch (error) {
//         console.error(error?.message || "Error in authentication check");
//       }
//     };

//     checkAuth();
//   }, []);

//   // Delete user
//   const deleteUser = async () => {
//     if (!userIdToDelete) return;

//     try {
//       const store = JSON.parse(localStorage.getItem("userData") || "{}");
//       const apiToken = store?.user?.apiToken;

//       if (!apiToken) {
//         throw new Error("Missing authorization token");
//       }

//       await axios.delete(`/api/users/delete-user/${userIdToDelete}`, {
//         headers: {
//           Authorization: `Bearer ${apiToken}`,
//         },
//       });
//       await userDetails();
//       toast.success("User deleted successfully");
//       setDeleteModalOpen(false);
//       setUserIdToDelete(null);
//     } catch (error) {
//       console.error(error.message || "Error deleting user");
//       toast.error("Failed to delete user");
//     }
//   };

//   // Edit user
//   const editUser = async () => {
//     if (!userToEdit) return;

//     try {
//       const store = JSON.parse(localStorage.getItem("userData") || "{}");
//       const apiToken = store?.user?.apiToken;

//       if (!apiToken) {
//         throw new Error("Missing authorization token");
//       }

//       await axios.put(`/api/users/edit-user/${userToEdit._id}`, userToEdit, {
//         headers: {
//           Authorization: `Bearer ${apiToken}`,
//         },
//       });
//       await userDetails();
//       toast.success("User updated successfully");
//       setEditModalOpen(false);
//       setUserToEdit(null);
//     } catch (error) {
//       console.error(error.message || "Error updating user");
//       toast.error("Failed to update user");
//     }
//   };

//   // Create user
//   const createUser = async () => {
//     try {
//       const store = JSON.parse(localStorage.getItem("userData") || "{}");
//       const apiToken = store?.user?.apiToken;

//       if (!apiToken) {
//         throw new Error("Missing authorization token");
//       }

//       await axios.post(`/api/users/user-create`, newUser, {
//         headers: {
//           Authorization: `Bearer ${apiToken}`,
//         },
//       });
//       await userDetails();
//       toast.success("User created successfully");
//       setCreateModalOpen(false);
//       setNewUser({ name: "", email: "", username: "" });
//     } catch (error) {
//       console.error(error.message || "Error creating user");
//       toast.error("Failed to create user");
//     }
//   };

//   // Get current data
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//   const filteredData = Array.isArray(data)
//     ? data.filter(
//         (user) =>
//           user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           user.username.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : [];

//   const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const serialNumber = indexOfFirstItem + 1;

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Handle delete button click
//   const handleDeleteClick = (id) => {
//     setUserIdToDelete(id);
//     setDeleteModalOpen(true);
//   };

//   // Handle edit button click
//   const handleEditClick = (user) => {
//     setUserToEdit(user);
//     setEditModalOpen(true);
//   };

//   // Handle create button click
//   const handleCreateClick = () => {
//     setCreateModalOpen(true);
//   };

//   return (
//     <>
//       <div>
//         <div className="p-1">
//           <h1 className="my-10 ml-7 text-xl font-semibold ">
//             User List
//             <div className="float-right rtl:float-left">
//               <div className="flex space-x-2 rtl:space-x-reverse">
//                 <Button color="gray" onClick={handleCreateClick}>
//                   <HiPlusCircle className="mr-2 h-5 w-5" />
//                   Add User
//                 </Button>
//                 <Button
//                   color="gray"
//                   onClick={() => {
//                     userDetails();
//                     toast.success("record-refreshed");
//                   }}
//                 >
//                   <IoIosRefreshCircle className="mr-2 h-5 w-5" />
//                   Refresh
//                 </Button>
//               </div>
//             </div>
//           </h1>
//           <div className="flex justify-end items-end mb-3">
//             <TextInput
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="max-w-xs"
//             />
//           </div>
//           <div className="overflow-x-auto">
//             <Table striped={true}>
//               <Table.Head>
//                 <Table.HeadCell>#</Table.HeadCell>
//                 <Table.HeadCell>name</Table.HeadCell>
//                 <Table.HeadCell>email</Table.HeadCell>
//                 <Table.HeadCell>username</Table.HeadCell>
//                 <Table.HeadCell>licenses</Table.HeadCell>
//                 <Table.HeadCell>action</Table.HeadCell>
//               </Table.Head>
//               <Table.Body className="divide-y">
//                 {loading
//                   ? [...Array(itemsPerPage)].map((_, index) => (
//                       <Table.Row
//                         key={index}
//                         className="bg-white dark:bg-gray-800"
//                       >
//                         <Table.Cell>
//                           <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
//                         </Table.Cell>
//                         <Table.Cell>
//                           <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
//                         </Table.Cell>
//                         <Table.Cell>
//                           <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
//                         </Table.Cell>
//                         <Table.Cell>
//                           <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
//                         </Table.Cell>
//                         <Table.Cell>
//                           <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
//                         </Table.Cell>
//                         <Table.Cell>
//                           <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
//                         </Table.Cell>
//                       </Table.Row>
//                     ))
//                   : currentData.map((user, index) => (
//                       <Table.Row
//                         key={index}
//                         className="bg-white dark:bg-gray-800"
//                       >
//                         <Table.Cell>{serialNumber + index}</Table.Cell>
//                         <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">
//                           {user.name}
//                         </Table.Cell>
//                         <Table.Cell>{user.email}</Table.Cell>
//                         <Table.Cell>{user.username}</Table.Cell>
//                         <Table.Cell>{user?.licenses?.length}</Table.Cell>
//                         <Table.Cell className="flex flex-wrap gap-2">
//                           <Button
//                             color="blue"
//                             pill
//                             onClick={() => handleEditClick(user)}
//                             size={"sm"}
//                           >
//                             <FaEdit size={"sm"} className="mr-2 h-5 w-5" />
//                             edit
//                           </Button>
//                           <Button
//                             color="failure"
//                             pill
//                             onClick={() => handleDeleteClick(user._id)}
//                             size={"sm"}
//                           >
//                             <RiDeleteBin6Fill
//                               size={"sm"}
//                               className="mr-2 h-5 w-5"
//                             />
//                             delete
//                           </Button>
//                         </Table.Cell>
//                       </Table.Row>
//                     ))}
//               </Table.Body>
//             </Table>
//           </div>
//           <div className="flex justify-center mt-4">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={paginate}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Delete User Modal */}
//       <Modal
//         show={deleteModalOpen}
//         size="md"
//         onClose={() => setDeleteModalOpen(false)}
//         popup
//       >
//         <Modal.Header />
//         <Modal.Body>
//           <div className="text-center">
//             <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
//             <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//               are-you-sure-you-want-to-delete-this-user
//             </h3>
//             <div className="flex justify-center gap-4">
//               <Button color="failure" onClick={deleteUser}>
//                 yes-i-m-sure
//               </Button>
//               <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
//                 no-cancel
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>

//       {/* Edit User Modal */}
//       <Modal
//         show={editModalOpen}
//         size="md"
//         onClose={() => setEditModalOpen(false)}
//         popup
//       >
//         <Modal.Header />
//         <Modal.Body>
//           <div className="text-center">
//             <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//               edit-user
//             </h3>
//             <div className="flex flex-col gap-4">
//               <div>
//                 <Label htmlFor="name" value="name" />
//                 <TextInput
//                   id="name"
//                   type="text"
//                   value={userToEdit?.name || ""}
//                   onChange={(e) =>
//                     setUserToEdit({
//                       ...userToEdit,
//                       name: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="email" value="email" />
//                 <TextInput
//                   id="email"
//                   type="email"
//                   value={userToEdit?.email || ""}
//                   onChange={(e) =>
//                     setUserToEdit({
//                       ...userToEdit,
//                       email: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="username" value="username" />
//                 <TextInput
//                   id="username"
//                   type="text"
//                   value={userToEdit?.username || ""}
//                   onChange={(e) =>
//                     setUserToEdit({
//                       ...userToEdit,
//                       username: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//             <div className="flex justify-center gap-4 mt-4">
//               <Button color="success" onClick={editUser}>
//                 save
//               </Button>
//               <Button color="gray" onClick={() => setEditModalOpen(false)}>
//                 cancel
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>

//       {/* Create User Modal */}
//       <Modal
//         show={createModalOpen}
//         size="md"
//         onClose={() => setCreateModalOpen(false)}
//         popup
//       >
//         <Modal.Header />
//         <Modal.Body>
//           <div className="text-center">
//             <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//               add-user
//             </h3>
//             <div className="flex flex-col gap-4">
//               <div>
//                 <Label htmlFor="newName" value="name" />
//                 <TextInput
//                   id="newName"
//                   type="text"
//                   value={newUser.name || ""}
//                   onChange={(e) =>
//                     setNewUser({
//                       ...newUser,
//                       name: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="newEmail" value="email" />
//                 <TextInput
//                   id="newEmail"
//                   type="email"
//                   value={newUser.email || ""}
//                   onChange={(e) =>
//                     setNewUser({
//                       ...newUser,
//                       email: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="newUsername" value="username" />
//                 <TextInput
//                   id="newUsername"
//                   type="text"
//                   value={newUser.username || ""}
//                   onChange={(e) =>
//                     setNewUser({
//                       ...newUser,
//                       username: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//             <div className="flex justify-center gap-4 mt-4">
//               <Button color="success" onClick={createUser}>
//                 save
//               </Button>
//               <Button color="gray" onClick={() => setCreateModalOpen(false)}>
//                 cancel
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };
// export default UserList;
