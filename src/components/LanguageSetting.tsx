import {
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

const LanguageSetting = ({
  settingsLanguage,
  handleLanguageChange,
}: {
  settingsLanguage?: string;
  handleLanguageChange: (event: SelectChangeEvent<string>) => void;
}) => {
  const [language, setLanguage] = useState<string>(settingsLanguage ?? "en");

  const handleLanguageChangeLocal = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value);
    handleLanguageChange(event);
  };

  return (
    <FormControl sx={{ width: "100%", maxWidth: 300 }}>
      <FormLabel>Language</FormLabel>
      <Select
        value={language}
        onChange={handleLanguageChangeLocal}
        size="small"
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
