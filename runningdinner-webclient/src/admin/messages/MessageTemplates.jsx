import React from "react";
import {makeStyles, Box, Grid, Chip} from "@material-ui/core";
import HelpIconTooltip from "../../common/theme/HelpIconTooltip";
import Paragraph from "../../common/theme/typography/Paragraph";
import {useTranslation} from "react-i18next";
import {isArrayEmpty} from "../../shared/Utils";

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  }
}));

function MessageTemplates({templates, onTemplateClick}) {

  const {t} = useTranslation('admin');

  if (isArrayEmpty(templates)) {
    return null;
  }

  const messageTemplateNodes = templates.map(template => <MessageTemplate key={template} template={template} onClick={onTemplateClick} />);
  return (
      <Grid container alignItems={"center"} justify={"flex-start"}>
        <Grid item><Box component={"span"} pr={1}>{t('mails_template_help')}: </Box></Grid>
        <Grid item>{messageTemplateNodes}</Grid>
        <Grid item>
          <HelpIconTooltip content={<Paragraph i18n='admin:mails_template_help_description'/>} placement='right' />
        </Grid>
      </Grid>
  );
}

function MessageTemplate({template, onClick}) {
  const classes = useStyles();
  return (
    <Chip onClick={() => onClick(template)} label={template} className={classes.chip} />
  );
}

export default React.memo(MessageTemplates);
