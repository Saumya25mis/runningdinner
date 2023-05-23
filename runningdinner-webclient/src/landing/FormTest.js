import React, {useState} from 'react'
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import {PrimaryButton} from "../common/theme/PrimaryButton";
import {Controller, useForm} from "react-hook-form";
import TextField from "@material-ui/core/TextField";

export default function FormTest() {

  const [plain, setPlain] = useState('');
  const [material, setMaterial] = useState('');
  const [f, setF] = useState({ value: ''});

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      value: 'default'
    }
  });

  const watchedValue = watch('value');

  function handleChangePlain(changeEvt) {
    setPlain(changeEvt.target.value);
  }

  function handleChangeMaterial(changeEvt) {
    setMaterial(changeEvt.target.value);
  }

  const performSubmit = (values) => {
    setF(values);
  };

  return (
      <Grid container>
      </Grid>
  );

}
