import { useState, useEffect, useCallback } from "react";
import { API } from "helpers";
import { EnhancedTable, notify, EnhancedModal } from "components/index";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import {
  Box,
  Container,
  Card,
  CardActionArea,
  Button,
  CardContent,
  Typography,
} from "@mui/material";

export const Service = () => {
  const [users, setUsers] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const isMounted = useIsMountedRef();

  const [selectedService, setSelectedService] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getServices = useCallback(async () => {
    try {
      const response = await API.getService();
      if (response.success) {
        if (isMounted) setUsers(response.data.data);
      } else {
        setUsers([]);
        notify("Failed to Fetch Users List");
      }
    } catch (err) {
      setUsers([]);
      notify("Failed to Fetch Users List");
    }
  }, [isMounted]);

  useEffect(() => {
    getServices();
  }, [getServices]);

  const getCommentByService = useCallback(async () => {
    try {
      const response = await API.getCommentByService(
        "6286f5db4cd0860e3c428cff"
      );
      if (response.success) {
        setCommentList(response.data.data);
      } else {
        setCommentList([]);
        notify("Failed to Fetch Users List");
      }
    } catch (err) {
      setCommentList([]);
      notify("Failed to Fetch Users List");
    }
  }, []);

  useEffect(() => {
    getCommentByService();
  }, [getCommentByService]);
  let content = (
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={`Detail of Service`}
        dialogContent={commentList}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: "100px",
            sm: window.screen.availHeight / 50,
          },
        }}
      >
        {users.length > 0 ? (
          users.map((service) => {
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
                        setSelectedService(service);
                      }}
                    >
                      Check Comment
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        // setModalIsOpen(true);
                        // setSelectedService(sale);
                      }}
                    >
                      Add Service
                    </Button>
                  </CardActionArea>
                </Card>{" "}
              </Box>
            );
          })
        ) : (
          <Typography>No Data Available</Typography>
        )}
        {selectedService}
        <EnhancedTable
          data={users}
          title="Service Manager"
          options={{
            ignoreKeys: [
              "_id",
              "deakinSSO",
              "firstLogin",
              "emailVerified",
              "isBlocked",
              "__v",
            ],
          }}
        />
      </Container>
    </Box>
  );
  return content;
};
