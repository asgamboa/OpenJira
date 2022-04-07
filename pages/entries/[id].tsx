import { DeleteOutlined, SaveOutlined } from "@mui/icons-material";
import { Button, capitalize, Card, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Radio, RadioGroup, TextField } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { ChangeEvent, FC, useContext, useMemo, useState } from "react";

import { Layout } from "../../components/layouts";
import { EntriesContext } from "../../context/entries/EntriesContext";
import { dbEntries } from "../../database";
import { Entry, EntryStatus } from "../../interfaces";
import { dateFunctions } from "../../utils";

const validStatus: EntryStatus[] = ["pending", "in-progress", "finished"];

interface Props {
  entry: Entry;
}

const EntryPage: FC<Props> = ({ entry }) => {
  const { updateEntry, deleteEntry } = useContext(EntriesContext);
  const router = useRouter();

  const [inputValue, setInputValue] = useState(entry.description);
  const [status, setStatus] = useState<EntryStatus>(entry.status);
  const [touched, setTouched] = useState(false);

  const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched]);

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onStatusChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as EntryStatus);
  };

  const onSave = () => {
    if (inputValue.trim().length === 0) return;

    const updatedEntry: Entry = { ...entry, description: inputValue, status };

    updateEntry(updatedEntry, true);
  };

  const onDelete = () => {
    deleteEntry(entry._id);

    router.push("/");
  };

  return (
    <Layout title={inputValue.substring(0, 20) + "..."}>
      <Grid container justifyContent='center' sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardHeader title={`Entrada:`} subheader={`Creada hace: ${dateFunctions.getFormatDistanceToNow(entry.createdAt)}`} />
            <CardContent>
              <TextField
                sx={{ marginTop: 2, marginBottom: 1 }} //
                fullWidth
                placeholder='Nueva entrada'
                autoFocus
                multiline
                label='Actualizar entrada'
                value={inputValue}
                onChange={onTextChange}
                helperText={isNotValid && "Ingrese un valor"}
                onBlur={() => setTouched(true)}
                error={isNotValid}
              />

              <FormControl>
                <FormLabel>Estado:</FormLabel>
                <RadioGroup row value={status} onChange={onStatusChanged}>
                  {validStatus.map((option) => (
                    <FormControlLabel key={option} value={option} control={<Radio />} label={capitalize(option)} />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>

            <CardActions>
              <Button
                startIcon={<SaveOutlined />} //
                variant='contained'
                fullWidth
                onClick={onSave}
                disabled={inputValue.length <= 0}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <IconButton
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          backgroundColor: "error.dark",
        }}
        onClick={onDelete}
      >
        <DeleteOutlined />
      </IconButton>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };

  const entry = await dbEntries.getEntryById(id);

  if (!entry)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {
      entry,
    },
  };
};

export default EntryPage;
