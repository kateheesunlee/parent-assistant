import {
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useSettings, useUpdateLanguage } from "@/hooks/useSettings";

const LanguageSetting = () => {
  const { settings, isLoading: isSettingsLoading } = useSettings();
  const { updateLanguage } = useUpdateLanguage();

  const handleLanguageChange = async (event: SelectChangeEvent<string>) => {
    await updateLanguage({
      preferred_language: event.target.value,
    });
  };

  return (
    <FormControl sx={{ width: "100%", maxWidth: 300 }}>
      <FormLabel>Language</FormLabel>
      <Select
        value={settings?.preferred_language ?? "en"}
        onChange={handleLanguageChange}
        size="small"
        disabled={isSettingsLoading}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Spanish</MenuItem>
        <MenuItem value="fr">French</MenuItem>
        <MenuItem value="de">German</MenuItem>
        <MenuItem value="it">Italian</MenuItem>
        <MenuItem value="pt">Portuguese</MenuItem>
        <MenuItem value="ru">Russian</MenuItem>
        <MenuItem value="zh">Chinese</MenuItem>
        <MenuItem value="ja">Japanese</MenuItem>
        <MenuItem value="ko">Korean</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSetting;
