import { useState, useEffect, useCallback } from "react";
import { API } from "helpers";
import { EnhancedTable, notify } from "components/index";
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
  const isMounted = useIsMountedRef();

  const getUsers = useCallback(async () => {
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
    getUsers();
  }, [getUsers]);

  let content = (
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
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
                        // setModalIsOpen(true);
                        // setSelectedSale(sale);
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
