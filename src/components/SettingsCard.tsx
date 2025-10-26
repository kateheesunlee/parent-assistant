import { Card, CardHeader, CardContent, Box, Typography } from "@mui/material";

const SettingsCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
              bgcolor: "primary.50",
            }}
          >
            {icon}
          </Box>
        }
        title={<Typography variant="h5">{title}</Typography>}
        sx={{
          paddingBottom: 0,
        }}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default SettingsCard;
