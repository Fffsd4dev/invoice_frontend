// import { useState, useEffect, useMemo } from 'react';
// import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane, Modal, Button, Alert } from 'react-bootstrap';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import AdminListView from './AdminListView';
// import AdminGrid from './AdminGrid';
// import CreateAdminModal from './CreateAdminModal';
// import { useAuthContext } from '@/context/useAuthContext';
// import axios from 'axios';
// import debounce from 'lodash/debounce';

// const AdminList = ({ admins = [], pagination, onPageChange, refreshAdmins }) => {
//   const { user } = useAuthContext();
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [activeView, setActiveView] = useState('list-view');
//   const [deleteError, setDeleteError] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [roles, setRoles] = useState([]);
//   const [loadingRoles, setLoadingRoles] = useState(true);
//   const [rolesError, setRolesError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRoleId, setSelectedRoleId] = useState('all');

//   // Fetch roles from API
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-roles`,
//           {
//             headers: {
//               'Authorization': `Bearer ${user.token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         // Transform API response to ensure consistent structure
//         const formattedRoles = (response.data.data || []).map(role => ({
//           id: role.role_id?.toString() || role.id?.toString(),
//           name: role.name || role.role_name || `Role ${role.role_id || role.id}`
//         }));
        
//         setRoles(formattedRoles);
//       } catch (error) {
//         setRolesError('Failed to load roles. Please try again.');
//       } finally {
//         setLoadingRoles(false);
//       }
//     };

//     if (user?.token) {
//       fetchRoles();
//     }
//   }, [user]);

//   // Filter admins based on search term and selected role_id
//   const filteredAdmins = useMemo(() => {

//     let result = [...admins];
    
//     // Filter by search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(admin => 
//         (admin.name?.toLowerCase()?.includes(term)) || 
//         (admin.email?.toLowerCase()?.includes(term))
//       );
//     }
    
//     // Filter by role - handles single role object (admin.role instead of admin.roles)
//     if (selectedRoleId !== 'all') {
//       result = result.filter(admin => {
        
//         // Check if admin has a role object
//         if (!admin.role) {
//           return false;
//         }

//         // Get role_id from the role object
//         const adminRoleId = admin.role.role_id?.toString() || admin.role.id?.toString();
//         const match = adminRoleId === selectedRoleId.toString();
//         return match;
//       });
//     }
    
//     return result;
//   }, [admins, searchTerm, selectedRoleId]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const debouncedSearch = debounce(handleSearchChange, 300);

//   const handleRoleChange = (e) => {
//     setSelectedRoleId(e.target.value);
//   };

//   const handleAddClick = () => {
//     setEditMode(false);
//     setSelectedAdmin(null);
//     setShowModal(true);
//   };

//   const handleEditClick = (admin) => {
//     setEditMode(true);
//     setSelectedAdmin(admin);
//     setShowModal(true);
//   };

//   const handleDeleteClick = (admin) => {
//     setSelectedAdmin(admin);
//     setShowDeleteModal(true);
//     setDeleteError(null);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedAdmin || !user?.token) {
//       setDeleteError('Invalid request data');
//       return;
//     }

//     setIsDeleting(true);
//     setDeleteError(null);

//     try {
//       if (!user?.token) {
//         throw new Error('No authentication token found');
//       }
      
//       // await axios.post(
//       //   `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/delete-admin`,
//       //   {
//       //     data: { id: selectedAdmin.id },
//       //     headers: {
//       //       'Authorization': `Bearer ${user.token}`,
//       //       'Content-Type': 'application/json'
//       //     }
//       //   }
//       // );
//       await axios.post(
//   `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/delete-admin`,
//   { id: selectedAdmin.id }, // request body
//   {
//     headers: {
//       'Authorization': `Bearer ${user.token}`,
//       'Content-Type': 'application/json'
//     }
//   }
// );

//       refreshAdmins();
//       setShowDeleteModal(false);
//     } catch (error) {
//       setDeleteError(error.response?.data?.message || 'Failed to delete admin');
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <>
//       <TabContainer activeKey={activeView} onSelect={setActiveView}>
//         <Row>
//           <Col xs={12}>
//             <Card>
//               <CardBody>
//                 <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
//                   <div>
//                     <form className="d-flex flex-wrap align-items-center gap-2">
//                       <div className="search-bar me-3">
//                         <span>
//                           <IconifyIcon icon="bx:search-alt" className="mb-1" />
//                         </span>
//                         <input 
//                           type="search" 
//                           className="form-control" 
//                           placeholder="Search admins..." 
//                           onChange={debouncedSearch}
//                         />
//                       </div>
//                       <div className="me-sm-3">
//                         {rolesError ? (
//                           <Alert variant="danger" className="mb-0">
//                             {rolesError}
//                           </Alert>
//                         ) : (
//                           <select 
//                             className="form-select my-1 my-md-0"
//                             value={selectedRoleId}
//                             onChange={handleRoleChange}
//                             disabled={loadingRoles}
//                           >
//                             <option value="all">All Roles</option>
//                             {roles.map(role => (
//                               <option key={role.id} value={role.id}>
//                                 {role.name}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                       </div>
//                     </form>
//                   </div>
//                   <div>
//                     <div className="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
//                       <Nav variant="pills" className="gap-1 p-0">
//                         <NavItem>
//                           <NavLink eventKey="grid-view" className="p-2">
//                             <IconifyIcon icon="bx:grid-alt" />
//                           </NavLink>
//                         </NavItem>
//                         <NavItem>
//                           <NavLink eventKey="list-view" className="p-2">
//                             <IconifyIcon icon="bx:list-ul" />
//                           </NavLink>
//                         </NavItem>
//                       </Nav>
//                       <button 
//                         className="btn btn-primary"
//                         onClick={handleAddClick}
//                         disabled={loadingRoles || !!rolesError}
//                       >
//                         <IconifyIcon icon="bi:plus" className="me-1" />
//                         Add Admin
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>

//         <TabContent className="pt-0">
//           <TabPane eventKey="list-view">
//             {filteredAdmins.length === 0 ? (
//               <Alert variant="info" className="mt-3">
//                 {searchTerm || selectedRoleId !== 'all' 
//                   ? 'No admins match your filters' 
//                   : 'No admins found'}
//               </Alert>
//             ) : (
//               <AdminListView 
//                 admins={filteredAdmins} 
//                 pagination={pagination}
//                 onPageChange={onPageChange}
//                 onEditClick={handleEditClick}
//                 onDeleteClick={handleDeleteClick}
//                 roles={roles}
//                 loading={loadingRoles}
//               />
//             )}
//           </TabPane>
//           <TabPane eventKey="grid-view">
//             {filteredAdmins.length === 0 ? (
//               <Alert variant="info" className="mt-3">
//                 {searchTerm || selectedRoleId !== 'all' 
//                   ? 'No admins match your filters' 
//                   : 'No admins found'}
//               </Alert>
//             ) : (
//               <AdminGrid 
//                 admins={filteredAdmins}
//                 onEditClick={handleEditClick}
//                 onDeleteClick={handleDeleteClick}
//                 roles={roles}
//                 loading={loadingRoles}
//               />
//             )}
//           </TabPane>
//         </TabContent>
//       </TabContainer>

//       <CreateAdminModal 
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         refreshAdmins={refreshAdmins}
//         editMode={editMode}
//         adminToEdit={selectedAdmin}
//         roles={roles}
//         loadingRoles={loadingRoles}
//       />

//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {deleteError && (
//             <Alert variant="danger">
//               {deleteError}
//             </Alert>
//           )}
//           <p>Are you sure you want to delete <strong>{selectedAdmin?.name}</strong>?</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={handleDeleteConfirm}
//             disabled={isDeleting}
//           >
//             {isDeleting ? 'Deleting...' : 'Confirm Delete'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default AdminList;



import { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane, Modal, Button, Alert } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import AdminListView from './AdminListView';
import AdminGrid from './AdminGrid';
import CreateAdminModal from './CreateAdminModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';
import debounce from 'lodash/debounce';

const AdminList = ({ admins = [], pagination, onPageChange, refreshAdmins }) => {
  const { user } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [activeView, setActiveView] = useState('list-view');
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [rolesError, setRolesError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('all');

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-roles`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Transform API response to ensure consistent structure
        const formattedRoles = (response.data.data || []).map(role => ({
          id: role.role_id?.toString() || role.id?.toString(),
          name: role.name || role.role_name || `Role ${role.role_id || role.id}`
        }));
        
        setRoles(formattedRoles);
      } catch (error) {
        setRolesError('Failed to load roles. Please try again.');
      } finally {
        setLoadingRoles(false);
      }
    };

    if (user?.token) {
      fetchRoles();
    }
  }, [user]);

  // Filter admins based on search term and selected role_id
  const filteredAdmins = useMemo(() => {

    let result = [...admins];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(admin => 
        (admin.name?.toLowerCase()?.includes(term)) || 
        (admin.email?.toLowerCase()?.includes(term))
      );
    }
    
    // Filter by role - handles single role object (admin.role instead of admin.roles)
    if (selectedRoleId !== 'all') {
      result = result.filter(admin => {
        
        // Check if admin has a role object
        if (!admin.role) {
          return false;
        }

        // Get role_id from the role object
        const adminRoleId = admin.role.role_id?.toString() || admin.role.id?.toString();
        const match = adminRoleId === selectedRoleId.toString();
        return match;
      });
    }
    
    return result;
  }, [admins, searchTerm, selectedRoleId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const debouncedSearch = debounce(handleSearchChange, 300);

  const handleRoleChange = (e) => {
    setSelectedRoleId(e.target.value);
  };

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedAdmin(null);
    setShowModal(true);
  };

  const handleEditClick = (admin) => {
    setEditMode(true);
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAdmin || !user?.token) {
      setDeleteError('Invalid request data');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }
      
      // Updated to use DELETE method with URL parameter like the edit pattern
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/delete-admin/${selectedAdmin.uuid}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      refreshAdmins();
      setShowDeleteModal(false);
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to delete admin');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TabContainer activeKey={activeView} onSelect={setActiveView}>
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <form className="d-flex flex-wrap align-items-center gap-2">
                      <div className="search-bar me-3">
                        <span>
                          <IconifyIcon icon="bx:search-alt" className="mb-1" />
                        </span>
                        <input 
                          type="search" 
                          className="form-control" 
                          placeholder="Search admins..." 
                          onChange={debouncedSearch}
                        />
                      </div>
                      <div className="me-sm-3">
                        {rolesError ? (
                          <Alert variant="danger" className="mb-0">
                            {rolesError}
                          </Alert>
                        ) : (
                          <select 
                            className="form-select my-1 my-md-0"
                            value={selectedRoleId}
                            onChange={handleRoleChange}
                            disabled={loadingRoles}
                          >
                            <option value="all">All Roles</option>
                            {roles.map(role => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </form>
                  </div>
                  <div>
                    <div className="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
                      <Nav variant="pills" className="gap-1 p-0">
                        <NavItem>
                          <NavLink eventKey="grid-view" className="p-2">
                            <IconifyIcon icon="bx:grid-alt" />
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink eventKey="list-view" className="p-2">
                            <IconifyIcon icon="bx:list-ul" />
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <button 
                        className="btn btn-primary"
                        onClick={handleAddClick}
                        disabled={loadingRoles || !!rolesError}
                      >
                        <IconifyIcon icon="bi:plus" className="me-1" />
                        Add Admin
                      </button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <TabContent className="pt-0">
          <TabPane eventKey="list-view">
            {filteredAdmins.length === 0 ? (
              <Alert variant="info" className="mt-3">
                {searchTerm || selectedRoleId !== 'all' 
                  ? 'No admins match your filters' 
                  : 'No admins found'}
              </Alert>
            ) : (
              <AdminListView 
                admins={filteredAdmins} 
                pagination={pagination}
                onPageChange={onPageChange}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                roles={roles}
                loading={loadingRoles}
              />
            )}
          </TabPane>
          <TabPane eventKey="grid-view">
            {filteredAdmins.length === 0 ? (
              <Alert variant="info" className="mt-3">
                {searchTerm || selectedRoleId !== 'all' 
                  ? 'No admins match your filters' 
                  : 'No admins found'}
              </Alert>
            ) : (
              <AdminGrid 
                admins={filteredAdmins}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                roles={roles}
                loading={loadingRoles}
              />
            )}
          </TabPane>
        </TabContent>
      </TabContainer>

      <CreateAdminModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshAdmins={refreshAdmins}
        editMode={editMode}
        adminToEdit={selectedAdmin}
        roles={roles}
        loadingRoles={loadingRoles}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger">
              {deleteError}
            </Alert>
          )}
          <p>Are you sure you want to delete <strong>{selectedAdmin?.name}</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminList;