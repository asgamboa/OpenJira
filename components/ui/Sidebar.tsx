import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React, { useContext } from "react";
import { UIContext } from "../../context/ui";

const menuItems: string[] = ["Inbox", "Starred", "Sent Mail", "Drafts", "Trash"];

export const Sidebar = () => {
  const { sidemenuOpen, closeSideMenu } = useContext(UIContext);

  return (
    <Drawer anchor='left' open={sidemenuOpen} onClose={closeSideMenu}>
      <Box sx={{ width: 250 }}>
        <Box sx={{ padding: "5px 10px" }}>
          <Typography variant='h4'>Menu</Typography>
        </Box>

        <List>
          {menuItems.map((itemText, idx) => (
            <ListItem button key={itemText}>
              <ListItemIcon>{idx % 2 ? <InboxOutlinedIcon /> : <EmailOutlinedIcon />}</ListItemIcon>
              <ListItemText primary={itemText} />
            </ListItem>
          ))}
        </List>

        <Divider />
      </Box>
    </Drawer>
  );
};
