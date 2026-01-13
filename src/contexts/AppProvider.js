import UserProvider from "./UserContext"
import ParkingProvider from "./ParkingContext"
import AdminProvider from "./AdminContext"
const AppProvider = ({children}) => {
  return (
    <UserProvider>
        <ParkingProvider>
            <AdminProvider>
                {children}
            </AdminProvider>
        </ParkingProvider>
    </UserProvider>
  )
}

export default AppProvider