import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Footer styled components
export const Footers = styled.div`
  width: 100%;
  padding: 40px 0 20px;
  background: #343434;
  color: #fff;
`;

export const FooterLink = styled(Link)`
  color: #C5C8C9;
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
  transition: color 0.3s;
  
  &:hover {
    color: #fff;
  }
`;

export const ContactItem = styled(Box)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  
  span {
    min-width: 24px;
    margin-right: 8px;
    font-weight: bold;
  }
`;

export const SocialIcon = styled.img`
  margin-right: 12px;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`; 