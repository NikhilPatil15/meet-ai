import React from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";;
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

const ProfileInfo: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter()

  const handleRedirect = ()=>{
    router.push("/user/dashboard/edit-profile")
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={4}
      p={3}
      className="bg-[#232F3E] rounded-xl shadow-lg"
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          alt={user?.fullName || "User Avatar"}
          src={user.avatar}
          sx={{ width: 60, height: 60 }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {user?.fullName || "John Doe"}
          </Typography>
          <Typography variant="body2" color="white">
            @{user?.userName || "username"}
          </Typography>
        </Box>
      </Box>
      <Button onClick={handleRedirect} variant="contained" color="primary" size="small">
        Edit Profile
      </Button>
    </Box>
  );
};

export default ProfileInfo;
