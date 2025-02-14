import React from 'react';
import {PageTitle, Span, Subtitle} from "../common/theme/typography/Tags";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {SpacingGrid} from "../common/theme/SpacingGrid";
import {
  mapExistingMealTimesToNewMeals,
  BasicDetailsNavigationStep,
  MealTimesNavigationStep,
  RunningDinnerOptions,
  useBackendIssueHandler,
  validateRunningDinnerOptions,
} from "@runningdinner/shared";
import FormTextField from "../common/input/FormTextField";
import WizardButtons from "./WizardButtons";
import {Trans, useTranslation} from "react-i18next";
import {useWizardSelector} from "@runningdinner/shared";
import {
  getGenderAspectsSelector,
  getRunningDinnerBasicDetailsSelector,
  getRunningDinnerOptionsSelector,
  setNextNavigationStep,
  setPreviousNavigationStep,
  updateRunningDinnerOptions
} from "@runningdinner/shared";
import {useDispatch} from "react-redux";
import {useNotificationHttpError} from "../common/NotificationHttpErrorHook";
import FormCheckbox from "../common/input/FormCheckbox";
import FormSelect from "../common/input/FormSelect";
import {Button, IconButton, MenuItem } from '@material-ui/core';
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from '@material-ui/icons/Delete';

export default function OptionsStep() {
  const {t} = useTranslation(['wizard', 'common']);

  const options = useWizardSelector(getRunningDinnerOptionsSelector);
  const {date} = useWizardSelector(getRunningDinnerBasicDetailsSelector);

  const dispatch = useDispatch();

  const formMethods = useForm({
    defaultValues: options,
    mode: 'onTouched'
  });

  const { clearErrors, setError, reset } = formMethods;

  const {applyValidationIssuesToForm, getIssuesTranslated} = useBackendIssueHandler({
    defaultTranslationResolutionSettings: {
      namespaces: 'wizard'
    }
  });
  const {showHttpErrorDefaultNotification} = useNotificationHttpError(getIssuesTranslated);

  React.useEffect(() => {
    reset(options);
    clearErrors();
    // eslint-disable-next-line
  }, [reset, clearErrors, options]);

  React.useEffect(() => {
    dispatch(setNextNavigationStep(MealTimesNavigationStep));
    dispatch(setPreviousNavigationStep(BasicDetailsNavigationStep));
    // eslint-disable-next-line
  }, [dispatch]);


  const submitOptionsAsync = async(values: RunningDinnerOptions) => {
    clearErrors();
    const optionsToSubmit = { ...values };
    try {
      optionsToSubmit.meals = mapExistingMealTimesToNewMeals(options.meals, optionsToSubmit.meals.map(meal => meal.label), date);
      await validateRunningDinnerOptions(optionsToSubmit, date);
      dispatch(updateRunningDinnerOptions(optionsToSubmit));
      return true;
    } catch(e) {
      applyValidationIssuesToForm(e, setError);
      showHttpErrorDefaultNotification(e);
      return false;
    }
  };

  return (
      <div>
        <PageTitle>{t('common:details')}</PageTitle>
        <FormProvider {...formMethods}>
          <form>
            <SpacingGrid container spacing={4}>
              <SpacingGrid item xs={12} md={6}>
                <TeamSettings />
              </SpacingGrid>
              <SpacingGrid item xs={12} md={6}>
                <MealSettings runningDinnerDate={date} />
              </SpacingGrid>
            </SpacingGrid>

            <WizardButtons onSubmitData={submitOptionsAsync} />

          </form>
        </FormProvider>
      </div>
  );
}

function TeamSettings() {

  const {t} = useTranslation(['wizard', 'common']);

  const {genderAspects} = useWizardSelector(getGenderAspectsSelector);

  if (!genderAspects) {
    return null;
  }

  return (
    <SpacingGrid container>
      <SpacingGrid item xs={12}>
        <FormTextField name="teamSize"
                       disabled={true}
                       label={t('wizard:team_size' )}
                       variant="outlined" />
      </SpacingGrid>
      <SpacingGrid item xs={12} mt={3}>
        <FormCheckbox name="forceEqualDistributedCapacityTeams" label={t("team_distribution_force_equl_hosting")} helperText={t("team_distribution_help")}/>
      </SpacingGrid>
      <SpacingGrid item xs={12} mt={3}>
        <FormSelect variant={"outlined"} name="genderAspects" label={t("gender_aspects")} fullWidth>
          { genderAspects.map(genderAspect => <MenuItem key={genderAspect.value} value={genderAspect.value}>{genderAspect.label}</MenuItem>) }
        </FormSelect>
      </SpacingGrid>
      <SpacingGrid item xs={12} mt={3}>
        <FormCheckbox name="teamPartnerWishDisabled" label={<Trans i18nKey="team_partner_wish_disabled" ns="common" />} helperText={t("common:team_partner_wish_disabled_help")} />
      </SpacingGrid>
    </SpacingGrid>
  )
}


interface MealSettingsProps {
  runningDinnerDate: Date
}

function MealSettings({runningDinnerDate}: MealSettingsProps) {

  const { fields, remove, append} = useFieldArray({
    name: "meals",
    keyName: "key"
  });

  const {t} = useTranslation('common');

  function handleAddMeal() {
    append({ label: "", time: runningDinnerDate });
  }

  function handleRemoveMeal(index: number) {
    remove(index);
  }

  return (
      <SpacingGrid container>
        <SpacingGrid item xs={12}>
          <Subtitle i18n={"common:meals"}/>
          <Span i18n={"wizard:meals_help"}/>
        </SpacingGrid>
        <SpacingGrid item xs={12}>
          {fields.map((field, index) => (
              <SpacingGrid container mt={3} key={field.key}>
                <SpacingGrid item xs={11}>
                  <FormTextField name={`meals[${index}].label`}
                                 variant="outlined"
                                 fullWidth
                                 label=""
                                 defaultValue={field.label}/>
                </SpacingGrid>
                { index + 1 >= fields.length && <SpacingGrid item xs={1}>
                                                  <IconButton aria-label="delete" color="secondary" onClick={() => handleRemoveMeal(index)}>
                                                    <DeleteIcon fontSize={"large"} />
                                                  </IconButton>
                                                </SpacingGrid> }
            </SpacingGrid>
          ))}
        </SpacingGrid>
        <SpacingGrid container item xs={12} mt={2}>
          <Button color={"primary"} startIcon={<AddIcon/>} onClick={handleAddMeal} style={{ paddingLeft: '0'}}>{t('add')}</Button>
        </SpacingGrid>

      </SpacingGrid>
  )
}
