import { List, Paper } from "@mui/material";
import React, { FC, useContext, useMemo, DragEvent } from "react";
import { EntriesContext } from "../../context/entries";
import { EntryStatus } from "../../interfaces";
import { EntryCard } from "./";
import { UIContext } from "../../context/ui";

import styles from "./EntryList.module.css";

interface Props {
  status: EntryStatus;
}

export const EntryList: FC<Props> = ({ status }) => {
  const { isDragging, endDragging } = useContext(UIContext);

  const { entries, updateEntry } = useContext(EntriesContext);

  const entriesByStatus = useMemo(() => entries.filter((entry) => entry.status === status), [entries]);

  const onDropEntry = (event: DragEvent<HTMLDivElement>) => {
    const id = event.dataTransfer.getData("text");
    const entry = entries.find((entry) => entry._id === id)!; //! means that we are sure that the entry exists
    entry.status = status;
    updateEntry(entry);
    endDragging();
  };

  const allowDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      onDrop={onDropEntry} //
      onDragOver={allowDrop}
      className={isDragging ? styles.dragging : ""}
    >
      <Paper sx={{ height: "calc(100vh - 250px)", overflow: "scroll", backgroundColor: "transparent", padding: "1px 5px", "&::-webkit-scrollbar": { display: "none" } }}>
        <List sx={{ opacity: isDragging ? 0.5 : 1, transition: "all 0.3s" }}>
          {entriesByStatus.map((entry) => (
            <EntryCard key={entry._id} entry={entry} />
          ))}
        </List>
      </Paper>
    </div>
  );
};
