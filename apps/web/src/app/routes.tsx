import { Navigate, Route, Routes } from "react-router-dom";

import type { Pair } from "@slow-dating/contracts";

import {
  AccountPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from "../features/account/AccountPages";
import { GamePage } from "../features/games/GamePage";
import { KennismakenPage } from "../features/matching/KennismakenPage";
import { ProfielschetsPage } from "../features/profile/ProfielschetsPage";
import { ProfilePage } from "../features/profile/ProfilePage";
import { WorldPage } from "../features/worlds/WorldPage";

export function AppRoutes({
  developerPartnerArriving,
  developerPartnerPresent,
  onDeveloperPartnerArrivalComplete,
  pair,
}: {
  developerPartnerArriving: boolean;
  developerPartnerPresent: boolean;
  onDeveloperPartnerArrivalComplete(): void;
  pair: Pair | null | undefined;
}) {
  return (
    <Routes>
      <Route path="/" element={<WorldPage />} />
      <Route path="/worlds/:worldId" element={<WorldPage />} />
      <Route
        path="/games/:gameId"
        element={
          <GamePage
            developerPartnerArriving={developerPartnerArriving}
            developerPartnerPresent={developerPartnerPresent}
            onDeveloperPartnerArrivalComplete={
              onDeveloperPartnerArrivalComplete
            }
            pair={pair}
          />
        }
      />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profielschets" element={<ProfielschetsPage />} />
      <Route path="/kennismaken" element={<KennismakenPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
