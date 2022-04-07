import { useSnackbar } from "notistack";
import React, { FC, useEffect, useReducer } from "react";

import { entriesApi } from "../../apis";
import { Entry } from "../../interfaces";
import { EntriesContext, entriesReducer } from "./";

export interface EntriesState {
  entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: [],
};

export const EntriesProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);
  const { enqueueSnackbar } = useSnackbar();

  const addNewEntry = async (description: string) => {
    const { data } = await entriesApi.post<Entry>("/entries", { description });

    dispatch({ type: "[Entry] Add-Entry", payload: data });
  };

  const updateEntry = async ({ _id, description, status }: Entry, showSnackbar = false) => {
    try {
      const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, { description: description, status: status });

      dispatch({ type: "[Entry] Update-Entry", payload: data });

      if (showSnackbar)
        enqueueSnackbar("Entry updated", {
          variant: "success",
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
    } catch (err) {
      console.log({ err });
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const { data } = await entriesApi.delete<Entry>(`/entries/${entryId}`);

      dispatch({ type: "[Entry] Delete-Entry", payload: data._id });

      enqueueSnackbar("Entry deleted", {
        variant: "error",
        autoHideDuration: 1500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    } catch (err) {
      console.log({ err });
    }
  };

  const refreshEntries = async () => {
    const { data } = await entriesApi.get<Entry[]>("/entries");
    dispatch({ type: "[Entry] Refresh-Data", payload: data });
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  return (
    <EntriesContext.Provider
      value={{
        ...state,
        //Methods
        addNewEntry,
        updateEntry,
        deleteEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};
