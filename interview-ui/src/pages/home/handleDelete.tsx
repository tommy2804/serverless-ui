import Swal from 'sweetalert2';
import { deleteUser } from '../../api/users';

export const handleDelete = (id: string) => {
  // Handle delete action here...
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire('Deleted!', 'User has been deleted from db.', 'success');
        console.log('df');
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire('Cancelled', 'User is not deleted:)', 'error');
      }
    });
  console.log(`Deleting user with ID ${id}`);
};
