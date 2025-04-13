import { Box, Container, Typography } from "@mui/material";
import { Settings } from "./Settings";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/userPage.css";

export default function UserPage() {
  const history = useHistory();
  const {authMember} = useGlobals();

  if(!authMember) history.push("/")
  return (
    <div className={"user-page"}>
      <Container>
        <div className="profile-card">
          <Box className="profile-content">
            <Settings />
          </Box>
          <Box 
            sx={{ 
              padding: "20px", 
              textAlign: "center", 
              borderTop: "1px solid #e5e7eb",
              marginTop: "30px"
            }}
          >
            <Typography 
              sx={{ 
                color: "#6b7280", 
                fontSize: "14px", 
                fontFamily: "'Inter', sans-serif" 
              }}
            >
              Manage your personal information
            </Typography>
          </Box>
        </div>
      </Container>
    </div>
  );
}
