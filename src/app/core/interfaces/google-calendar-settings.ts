export interface GoogleCalendarSettings {
    googleCalendarSettingsId: number; // Maps to GoogleCalendarSettingsId
    clientId?: string;                // Maps to ClientId
    secretId?: string;                // Maps to SecretId
    accessToken?: string;             // Maps to access_token
    expiresIn?: string;               // Maps to expires_in
    refreshToken?: string;            // Maps to refresh_token
    tokenType?: string;               // Maps to token_type
  }