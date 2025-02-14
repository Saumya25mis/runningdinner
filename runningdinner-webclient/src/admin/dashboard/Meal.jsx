import React from 'react'
import { ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import {Time} from "../../shared/date/Time";

export default function Meal({ meal }) {
  return (
      <ListItem>
        <ListItemText primary={meal.label} />
        <ListItemSecondaryAction><Time date={meal.time} /></ListItemSecondaryAction>
      </ListItem>

  );

}
