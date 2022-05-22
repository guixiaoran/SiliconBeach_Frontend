import { Box, InputLabel, TextField, Button, Paper, Grid } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { notify } from "components/index";
import Avatar from "@mui/material/Avatar";
import UploadIcon from "@mui/icons-material/Upload";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

export const Profile = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [profilePicture, setProfilePicture] = useState("");
  const [initialValue, setInitialValue] = useState({
    companyName: "",
    Address: "",
    description: "",
    ABN: "",
    emailId: "",
  });
  const [editing, setEditing] = useState(false);

  const pictureChangeHandle = async (event) => {
    if (event.target.files[0]) {
      const formData = new FormData();
      formData.append("imageFile", event.target.files[0]);
      const response = await API.uploadImage(formData);
      if (response.success) {
        setProfilePicture(response.data.imageFileURL.original);
      }
    }
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: () => {
      return Yup.object().shape({
        companyName: Yup.string().max(255).required("Company Name is required"),
        Address: Yup.string().max(255).required("Address is required"),
      });
    },
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      const dataToSend = {
        companyName: values.companyName,
        Address: values.Address,
        description: values.description ?? "",
        ABN: values.ABN ?? "",
        picture: profilePicture ?? "",
        emailId: values.emailId ?? "",
      };
      const response = await API.editUserProfile(dataToSend);
      if (response.success) {
        notify("Profile updated!", null, "success");
        getUserProfile();
        setEditing(false);
      }
      setStatus(true);
      setSubmitting(false);
    },
  });

  const getUserProfile = useCallback(async () => {
    const response = await API.getUserProfile();
    if (response.success) {
      const res = response.data.customerData;
      console.log(res);
      const _initialValues = {
        companyName: res.companyName,
        Address: res.Address,
        description: res.description,
        ABN: res.ABN,
        emailId: res.emailId,
      };
      setInitialValue(_initialValues);
      setCurrentUser(res);
      setProfilePicture(res.picture);
    } else {
      setCurrentUser({});
      notify("Failed to Fetch User Profile", null, "warning");
    }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  let userProfileForm = (
    <Formik enableReinitialize={true} initialValues={formik.initialValue}>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            position: "relative",
            display: "flex",
          }}
        >
          <Avatar
            sx={{ width: 90, height: 90 }}
            alt={currentUser.companyName}
            src={profilePicture}
          />

          {editing ? (
            <Box sx={{ position: "absolute", width: 90, height: 90 }}>
              {" "}
              <UploadIcon
                sx={{
                  position: "absolute",
                  width: 90,
                  height: 90,
                  color: "rgba(192,192,192,.5)",
                }}
              />
              <input
                style={{
                  position: "absolute",
                  width: 90,
                  height: 90,
                  opacity: 0,
                }}
                type="file"
                onChange={pictureChangeHandle}
              ></input>
            </Box>
          ) : null}
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            {editing ? (
              <TextField
                error={
                  formik.touched.companyName &&
                  Boolean(formik.errors.companyName)
                }
                fullWidth
                helperText={
                  formik.touched.companyName && formik.errors.companyName
                }
                label="Company Name"
                margin="normal"
                name="companyName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.companyName}
                variant="outlined"
              />
            ) : (
              <Box>
                <InputLabel htmlFor="companyName">Company Name</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  margin="normal"
                  name="companyName"
                  placeholder="Company name"
                  type="text"
                  value={currentUser.companyName}
                  variant="outlined"
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={6}>
            {editing ? (
              <TextField
                error={formik.touched.Address && Boolean(formik.errors.Address)}
                fullWidth
                helperText={formik.touched.Address && formik.errors.Address}
                label="Address"
                margin="normal"
                name="Address"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.Address}
                variant="outlined"
              />
            ) : (
              <Box>
                <InputLabel htmlFor="Address">Address</InputLabel>
                <TextField
                  fullWidth
                  margin="normal"
                  name="Address"
                  placeholder="Address"
                  type="text"
                  value={currentUser.Address}
                  disabled
                  variant="outlined"
                />
              </Box>
            )}
          </Grid>
        </Grid>

        {editing ? (
          <TextField
            error={formik.touched.ABN && Boolean(formik.errors.ABN)}
            fullWidth
            helperText={formik.touched.ABN && formik.errors.ABN}
            label="ABN"
            margin="normal"
            name="ABN"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            value={formik.values.ABN}
            variant="outlined"
          />
        ) : (
          <Box>
            <InputLabel htmlFor="ABN">ABN</InputLabel>
            <TextField
              disabled
              fullWidth
              margin="normal"
              name="ABN"
              placeholder="ABN"
              type="text"
              value={currentUser.ABN}
              variant="outlined"
            />
          </Box>
        )}
        {editing ? (
          <TextField
            error={formik.touched.emailId && Boolean(formik.errors.emailId)}
            fullWidth
            helperText={formik.touched.emailId && formik.errors.emailId}
            label="E-mail"
            margin="normal"
            name="emailId"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            value={formik.values.emailId}
            variant="outlined"
          />
        ) : (
          <Box>
            <InputLabel htmlFor="emailId">E-mail Address</InputLabel>
            <TextField
              disabled
              fullWidth
              placeholder="E-mail Address"
              margin="normal"
              name="emailId"
              type="text"
              value={currentUser.emailId}
              variant="outlined"
            />
          </Box>
        )}
        {editing ? (
          <TextField
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            fullWidth
            helperText={formik.touched.description && formik.errors.description}
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            multiline
            rows={4}
            value={formik.values.description}
            variant="outlined"
          />
        ) : (
          <Box>
            <InputLabel htmlFor="description">Description</InputLabel>
            <TextField
              disabled
              fullWidth
              placeholder="Description"
              margin="normal"
              name="description"
              type="text"
              multiline
              rows={4}
              value={currentUser.description}
              variant="outlined"
            />
          </Box>
        )}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            sx={{ px: 5, mr: 4 }}
            color="secondary"
            disabled={formik.isSubmitting}
            size="large"
            type="button"
            variant="contained"
            onClick={() => {
              formik.values.companyName = currentUser.companyName;
              formik.values.Address = currentUser.Address;
              formik.values.description = currentUser.description;
              formik.values.ABN = currentUser.ABN;
              formik.values.emailId = currentUser.emailId;
              setEditing(!editing);
            }}
          >
            {editing ? "Cancel" : "Edit"}
          </Button>
          <Button
            sx={{ px: 5 }}
            color="primary"
            disabled={formik.isSubmitting}
            size="large"
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </Box>
      </form>
    </Formik>
  );
  return (
    <Box sx={{ ml: 4 }}>
      <Paper elevation={2} sx={{ py: 3, px: 12 }}>
        {userProfileForm}
      </Paper>
    </Box>
  );
};
