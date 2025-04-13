import { Box, Grid } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useGlobals } from "../../hooks/useGlobals";
import { useState } from "react";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";

export function Settings() {
  const {authMember, setAuthMember} = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage 
    ? `${serverApi}/${authMember.memberImage}` 
    : "/icons/default-user.svg"
  );
  const [memberUpdateInput, setMemberUpdateInput] = 
  useState<MemberUpdateInput>({
    memberNick: authMember?.memberNick,
    memberPhone: authMember?.memberPhone,
    memberAddress: authMember?.memberAddress,
    memberDesc: authMember?.memberDesc,
    memberImage: authMember?.memberImage,
  });

  /** HANDLERS **/
  const memberNickHandler = (e: T) => {
    memberUpdateInput.memberNick = e.target.value;
    setMemberUpdateInput({...memberUpdateInput});
  };

  const memberPhoneHandler = (e: T) => {
    memberUpdateInput.memberPhone = e.target.value;
    setMemberUpdateInput({...memberUpdateInput});
  };

  const memberAddressHandler = (e: T) => {
    memberUpdateInput.memberAddress = e.target.value;
    setMemberUpdateInput({...memberUpdateInput});
  };

  const memberDescHandler = (e: T) => {
    memberUpdateInput.memberDesc = e.target.value;
    setMemberUpdateInput({...memberUpdateInput});
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if(
        memberUpdateInput.memberNick === "" || 
        memberUpdateInput.memberPhone === "" || 
        memberUpdateInput.memberAddress === "" ||
        memberUpdateInput.memberDesc === ""
      ) {
        throw new Error(Messages.error3);
      }

      const member = new MemberService();

      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);

      await sweetTopSuccessAlert("Modify successfully!");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err)
      .then();
    }
  }

  const memberImageHandler = (e: T) => {
    memberUpdateInput.memberImage = e.target.value;
    setMemberUpdateInput({...memberUpdateInput});
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    const fileType = file.type,
    validateImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (!validateImageTypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5).then();
    } else {
      if (file) {
        memberUpdateInput.memberImage = file;
        setMemberUpdateInput({...memberUpdateInput});
        setMemberImage(URL.createObjectURL(file));
      }
    }
      
  }

  return (
    <Grid container spacing={4} className="settings-grid">
      <Grid item xs={12} md={4} className="image-section">
        <Box className="profile-image-container">
          <img src={memberImage} className="profile-image" />
          <div className="upload-overlay">
            <p>Formats : JPG, JPEG, PNG</p>
            <Button 
              component="label" 
              variant="contained" 
              startIcon={<CloudDownloadIcon />}
              onChange={handleImageViewer}
              className="upload-btn"
            >
              Upload Image
              <input type="file" hidden />
            </Button>
          </div>
        </Box>
      </Grid>
      
      <Grid item xs={12} md={8} className="form-section">
        <Box className="form-container">
          <div className="form-field">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder={authMember?.memberNick}
              value={memberUpdateInput.memberNick}
              name="memberNick"
              onChange={memberNickHandler}
            />
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                type="text"
                placeholder={authMember?.memberPhone}
                value={memberUpdateInput.memberPhone}
                name="memberPhone"
                onChange={memberPhoneHandler}
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">Address</label>
              <input
                className="form-input"
                type="text"
                placeholder={
                  authMember?.memberAddress 
                  ? authMember.memberAddress 
                  : "no address"
                }
                value={memberUpdateInput.memberAddress}
                name="memberAddress"
                onChange={memberAddressHandler}
              />
            </div>
          </div>
          
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder={
                authMember?.memberDesc 
                ? authMember.memberDesc 
                : "no description"
              }
              value={memberUpdateInput.memberDesc}
              name="memberDesc"
              onChange={memberDescHandler}
            />
          </div>
          
          <div className="form-actions">
            <Button 
              variant="contained" 
              onClick={handleSubmitButton}
              className="save-button"
            >
              Save
            </Button>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
}