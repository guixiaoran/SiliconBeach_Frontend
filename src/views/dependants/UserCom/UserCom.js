import { useState, useEffect, useCallback } from "react";
import { API } from "helpers";
import { EnhancedTable, notify } from "components/index";
import { useIsMountedRef } from "../../../helpers/hooks/index";
import { Box, Container } from "@mui/material";

export const UserCom = () => {
  const [users, setUsers] = useState([]);
  const isMounted = useIsMountedRef();

  const getComment = useCallback(async () => {
    try {
      const response = await API.getComment();
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
    getComment();
  }, [getComment]);

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
        <EnhancedTable
          data={users}
          title="Comment Manager"
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
