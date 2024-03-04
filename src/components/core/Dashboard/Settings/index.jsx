import ChangeProfilePicture from './ChangeProfilePicture'
import DeleteAccount from './DeleteAccount'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'

const index = () => {
  return (
    <>
      <h1 className='mb-14 text-3xl font-medium text-richblack-5'>
        Edit Profile
      </h1>
          <ChangeProfilePicture />
          <EditProfile />
      {/* Password */}
      ;<UpdatePassword />
      {/* Delete Account */}
      ;<DeleteAccount />
    </>
  )
}

export default index
