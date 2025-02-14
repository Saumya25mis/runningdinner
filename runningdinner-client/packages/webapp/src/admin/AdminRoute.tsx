import React from 'react';
import {DinnerRouteMessages, ParticipantMessages, TeamMessages} from "./messages/MessagesContainer";
import ParticipantsPage from "./participants/ParticipantsPage";
import TeamsContainer from "./teams/TeamsContainer";
import Dashboard from "./dashboard/Dashboard";
import {Route, Routes} from "react-router-dom";
import {getRunningDinnerFetchSelector, useAdminSelector} from "@runningdinner/shared";
import Acknowledge from "./common/Acknowledge";
import TeamDinnerRoute from "./teams/TeamDinnerRoute";
import {MessageJobDetailsList} from "./messages/messagejobs/MessageJobDetailsList";
import {SettingsPage} from "./settings/SettingsPage";
import {BrowserTitle} from "../common/mainnavigation/BrowserTitle";

export default function AdminRoute() {

  const runningDinnerFetchData = useAdminSelector(getRunningDinnerFetchSelector);
  if (!runningDinnerFetchData.data) {
    return null;
  }

  const runningDinner = runningDinnerFetchData.data;
  const {adminId} = runningDinner;

  return (
      <Routes>
        <Route path={`participants/messages`} element={<ParticipantMessages adminId={adminId} />} />

        <Route path={`participants/:participantId`} element={<ParticipantsPage runningDinner={runningDinner} />} />

        <Route path={`participants`} element={<ParticipantsPage runningDinner={runningDinner} />} />

        <Route path={`dinnerroute/messages`} element={<DinnerRouteMessages adminId={adminId} />} />

        <Route path={`teams/messages`} element={<TeamMessages adminId={adminId} />} />

        <Route path={`teams/:teamId/dinnerroute`} element={<TeamDinnerRoute />} />

        <Route path={`teams/:teamId`} element={<TeamsContainer />} />

        <Route path={`teams`} element={<TeamsContainer />} />

        <Route path={`:acknowledgeId/acknowledge`} element={<Acknowledge runningDinner={runningDinner} />} />

        <Route path={`mailprotocols/:messageJobId`} element={<MessageJobDetailsList runningDinner={runningDinner} />} />

        <Route path={`settings`} element={
          <>
            <SettingsPage runningDinner={runningDinner} />
            <BrowserTitle  namespaces={"common"} titleI18nKey={"common:settings"} />
          </>
        } />

        <Route path={"*"} element={<Dashboard runningDinner={runningDinner} />} />
      </Routes>
  );
}
