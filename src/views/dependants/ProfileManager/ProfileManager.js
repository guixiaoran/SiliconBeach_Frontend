import {
  Box,
  InputLabel,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardActionArea,
  // Button,
  FormControl,
  CardContent,
  Typography,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { API } from "helpers";
import { notify, EnhancedModal } from "components/index";
import Avatar from "@mui/material/Avatar";
import UploadIcon from "@mui/icons-material/Upload";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";

export const Profile = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [currentId, setCurrentId] = useState("");
  const [services, setServices] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [comment, setComment] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [serviceModal, setserviceModal] = useState(false);
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
      setCurrentId(res._id);
      console.log("current id", currentId);
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
    getServiceByUserId();
    // }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const createService = async (data) => {
    const response = await API.createService(data);
    if (response.success) {
      notify("Service Creation Successed", null, "success");
      setserviceModal(false);
      getServiceByUserId();
    } else {
      setserviceModal(false);
      notify("Service Creation Failed", null, "warning");
    }
  };

  const initialValues = {
    description: "",
    name: "",
    cost: "",
    private: "true",
  };

  const validationSchema = () => {
    return Yup.object().shape({
      description: Yup.string().max(255).required("Description Is Required"),
      name: Yup.string().min(5).max(255).required("Name Is Required"),
      cost: Yup.number().required("Cost Is Required"),
      private: Yup.boolean(),
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      description: values.description,
      name: values.name,
      serviceId: values.serviceId,
      cost: values.cost,
      private: values.private,
    };
    createService(data);
    resetForm();
  };

  let createServiceModal = (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              fullWidth
              label="Service Name"
              margin="normal"
              name="name"
              type="text"
              variant="outlined"
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
            <Field
              as={TextField}
              fullWidth
              label=" Description"
              margin="normal"
              name="description"
              type="text"
              variant="outlined"
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />
            <Field
              as={TextField}
              fullWidth
              label="Cost "
              margin="normal"
              name="cost"
              type="text"
              variant="outlined"
              error={touched.cost && Boolean(errors.cost)}
              helperText={touched.cost && errors.cost}
            />
            <Field
              as={TextField}
              fullWidth
              label="Private "
              margin="normal"
              name="private"
              type="text"
              placeholder="true "
              variant="outlined"
              error={touched.private && Boolean(errors.private)}
              helperText={touched.private && errors.private}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                color="primary"
                disabled={isSubmitting}
                size="large"
                variant="contained"
                type="submit"
              >
                Create Service
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );

  const getServiceByUserId = useCallback(async () => {
    try {
      const response = await API.getServiceByUserId("6286ea722ace583bb464d731");
      if (response.success) {
        setServices(response.data.data);
      } else {
        setServices([]);
        notify("Failed to Fetch Users List");
      }
    } catch (err) {
      setServices([]);
      notify("Failed to Fetch Users List");
    }
  }, []);

  useEffect(() => {
    getServiceByUserId();
  }, [getServiceByUserId]);

  const getCommentByService = useCallback(async () => {
    console.log(selectedService);
    try {
      const response = await API.getCommentByService(
        "6286f5944cd0860e3c428cf4"
      );
      if (response.success) {
        setComment(response.data.data);
      } else {
        setComment([]);
        notify("Failed to Fetch Users List");
      }
    } catch (err) {
      setComment([]);
      notify("Failed to Fetch Users List");
    }
  }, []);

  useEffect(() => {
    getCommentByService();
  }, [getCommentByService]);

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

  let CommentDetailModal = (
    <Box>
      <FormControl fullWidth>
        {comment.length > 0 ? (
          comment.map((com) => {
            return (
              <Box key={com._id} mb={2}>
                <Card>
                  <CardContent>
                    <div style={{ width: 300, whiteSpace: "nowrap" }}>
                      <Typography
                        component="div"
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        gutterBottom
                      >
                        CommentDate: {com.commentDate}
                      </Typography>
                    </div>

                    <Typography variant="body2">
                      content: {com.content}
                      <br />
                    </Typography>
                  </CardContent>
                  <CardActionArea>
                    <Button
                      size="small"
                      onClick={() => {
                        // setModalIsOpen(true);
                        // setSelectedService(service._id);
                      }}
                    >
                      Delete Comment
                    </Button>
                  </CardActionArea>
                </Card>{" "}
              </Box>
            );
          })
        ) : (
          <Typography>No Data Available</Typography>
        )}
      </FormControl>
    </Box>
  );

  let userServices = (
    <Box>
      <br />
      <Typography>Update Section:</Typography>{" "}
      <Box maxWidth="xl" sx={{ textAlign: "left", ml: 4 }}>
        <Button
          size="middle"
          variant="contained"
          onClick={() => setserviceModal(true)}
        >
          Create Service
        </Button>{" "}
      </Box>
      <br />
      {services.length > 0 ? (
        services.map((service) => {
          return (
            <Box key={service._id} mb={2}>
              <Card>
                <CardContent>
                  <div style={{ width: 300, whiteSpace: "nowrap" }}>
                    <Typography
                      component="div"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      gutterBottom
                    >
                      Service Name: {service.name}
                    </Typography>
                  </div>

                  <Typography variant="body2">
                    Price: ${service.cost}
                    <br />
                  </Typography>
                  <Typography variant="body2">
                    Description: {service.description}
                    <br />
                  </Typography>
                </CardContent>
                <CardActionArea>
                  <Button
                    size="small"
                    onClick={() => {
                      setModalIsOpen(true);
                      setSelectedService(service._id);
                    }}
                  >
                    Check Comment
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      // setModalIsOpen(true);
                      // setSelectedSale(sale);
                    }}
                  >
                    Publish
                  </Button>
                </CardActionArea>
              </Card>{" "}
            </Box>
          );
        })
      ) : (
        <Typography>No Data Available</Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ ml: 4 }}>
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={`Detail of Comment`}
        dialogContent={CommentDetailModal}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
      <EnhancedModal
        isOpen={serviceModal}
        dialogTitle={`Create New Service`}
        dialogContent={createServiceModal}
        options={{
          onClose: () => setserviceModal(false),
          disableSubmit: true,
        }}
      />
      <Paper elevation={2} sx={{ py: 3, px: 12 }}>
        {userProfileForm}

        {userServices}
      </Paper>
    </Box>
  );
};
