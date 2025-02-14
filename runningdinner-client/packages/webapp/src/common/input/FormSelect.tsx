import React from 'react';
import {Controller, useFormContext} from "react-hook-form";
import {FormControl, InputLabel, FormHelperText, Select, SelectProps, styled} from "@material-ui/core";
import {isStringNotEmpty} from "@runningdinner/shared";
import {spacing} from "@material-ui/system";

export interface SelectWatchableProps extends SelectProps {
  name: string;
  label: string;
  helperText?: string;
  defaultValue?: unknown;
}

function FormSelectInternal({name, label, children, helperText, fullWidth, variant, defaultValue, ...other}: SelectWatchableProps) {

  const {errors, control} = useFormContext();

  const errorMessage = isStringNotEmpty(name) ? errors[name]?.message : "";
  const hasErrors = isStringNotEmpty(errorMessage);
  const helperTextToDisplay = hasErrors ? errorMessage : helperText;

  return (
      <>
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={(props) => (
                <>
                  <FormControl fullWidth={fullWidth} error={hasErrors} variant={variant}>
                    <InputLabel required>{label}</InputLabel>
                    <Select {...Object.assign({}, props, other)}
                            inputProps={{ 'aria-label': label }}>
                      {children}
                    </Select>
                  </FormControl>
                  { isStringNotEmpty(helperTextToDisplay) && <FormHelperText error={hasErrors}>{helperTextToDisplay}</FormHelperText> }
                </>
            )}
        />
      </>
  );
}

const FormSelect = styled(FormSelectInternal)(spacing);
export default FormSelect;
