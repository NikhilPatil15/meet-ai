import { Avatar, AvatarGroup, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { transformImage } from "@/lib/features";

const AvatarCard = ({ avatar = [], max = 5 }) => {
  const displayedAvatars = avatar.slice(0, max); 
  const remainingCount = Math.max(avatar.length - max, 0); 

  console.log("Remaining count:", remainingCount);

  return (
    <Stack direction={"row"} spacing={0.5} alignItems="center">
      <AvatarGroup
        max={max}
        sx={{
          position: "relative",
        }}
      >
        <Box height={"3rem"} width={"auto"} display="flex">
          {displayedAvatars.map((src, index) => (
            <Avatar
              key={index}
              src={transformImage(src)}
              alt={`Avatar ${index}`}
              sx={{
                width: "3rem",
                height: "3rem",
                position: "absolute",
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
          {remainingCount > 0 && (
            <div className="pl-20">
              <Avatar
                sx={{
                  position: "relative",
                  marginLeft: `${max + 0.8}rem `,
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: "#fff", 
                  color: "black",
                  fontSize: "1rem",
                  alignItems: "center",
                  paddingLeft: "6px"
                }}
              >
                {"     "}
                +{remainingCount} more
              </Avatar>
            </div>
          )}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
