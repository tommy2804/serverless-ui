import React, { useState, useContext } from 'react';
import createUserDialog from './create-user-dialog';

import { UserContext } from '../../state/users-context';
import { User } from '../../types/user';
import { ROLE } from '../../types/role';

interface titleProps {
  user: User;
}
const Title: React.FC<titleProps> = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { onCreateUser } = useContext(UserContext);

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleOpenSwal = async () => {
    try {
      const result = await createUserDialog({ showPassword, handlePasswordToggle });

      if (result.value) {
        const { password, email, firstName, lastName } = result.value;
        onCreateUser({ email, password, lastName, firstName });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <>
      <div className="title">
        <div className="column">
          <p className="title-text">User Managment</p>
          <p className="sub-title">{'Home > Permissions & accounts > User Management'}</p>
        </div>
        <div>
          {user?.role === ROLE.ADMIN ? (
            <button className="add-user-button rmv-default" onClick={handleOpenSwal}>
              <p className="title-text">Add user</p>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Title;
