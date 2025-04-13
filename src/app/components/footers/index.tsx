import { Box, Container, Stack, Typography, Grid } from "@mui/material";
import { Footers, FooterLink, ContactItem, SocialIcon } from "../../../lib/types/styled";

export default function Footer() {
  const authMember = null;

  return (
    <Footers>
      <Container>
        <Grid container spacing={3}>
          {/* Logo and Description */}
          <Grid item xs={12} md={5}>
            <Box mb={2}>
            <div className="brand-logo" style={{ 
                            fontFamily: 'Pacifico, cursive', 
                            fontWeight: 'bold', 
                            fontSize: '24px', 
                            color: '#f8f8ff',
                            background: 'linear-gradient(45deg, #d7b668, #f8f8ff)',
                            WebkitBackgroundClip: 'text',
                        }}>
                            Pizzeria
                        </div> 
            </Box>
            <Typography variant="body2" sx={{ color: "#C5C8C9", mb: 2, maxWidth: "400px" }}>
              Welcome to Pizzeria, where authentic Italian flavors meet modern culinary artistry. 
              Our passion for crafting exceptional pizzas and delivering memorable dining experiences.
            </Typography>
            <Box mt={2}>
              <SocialIcon src={"/icons/facebook.svg"} alt="Facebook" />
              <SocialIcon src={"/icons/twitter.svg"} alt="Twitter" />
              <SocialIcon src={"/icons/instagram.svg"} alt="Instagram" />
              <SocialIcon src={"/icons/youtube.svg"} alt="YouTube" />
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Sections
            </Typography>
            <Box>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/products">Products</FooterLink>
              {authMember && <FooterLink to="/orders">Orders</FooterLink>}
              <FooterLink to="/cal-ai">Cal AI</FooterLink>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Find Us
            </Typography>
            <Box>
              <ContactItem>
                <span>L.</span>
                <div>Hongdae, Seoul</div>
              </ContactItem>
              <ContactItem>
                <span>P.</span>
                <div>+82 10 6895 3473</div>
              </ContactItem>
              <ContactItem>
                <span>E.</span>
                <div>alex@gmail.com</div>
              </ContactItem>
              <ContactItem>
                <span>H.</span>
                <div>Visit 24 hours</div>
              </ContactItem>
            </Box>
          </Grid>
        </Grid>

        <Box 
          component="hr" 
          sx={{ 
            mt: 3,
            mb: 2,
            border: "none",
            height: "1px",
            backgroundColor: "#C5C8C9",
            opacity: 0.2
          }} 
        />
        
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ color: "#C5C8C9" }}
        >
          © Copyright Alex MIT19, All rights reserved.
        </Typography>
      </Container>
    </Footers>
  );
}
