import React from "react";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  CardActions as MuiCardActions,
  CardProps as MuiCardProps,
  CardContentProps as MuiCardContentProps,
  CardHeaderProps as MuiCardHeaderProps,
  CardActionsProps as MuiCardActionsProps,
  Typography,
} from "@mui/material";

export type CardProps = MuiCardProps;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ ...props }, ref) => <MuiCard ref={ref} {...props} />
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, MuiCardHeaderProps>(
  ({ ...props }, ref) => <MuiCardHeader ref={ref} {...props} />
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  { children: React.ReactNode; className?: string }
>(({ children, className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="h6"
    component="h3"
    className={className}
    {...props}
  >
    {children}
  </Typography>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  { children: React.ReactNode; className?: string }
>(({ children, className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="body2"
    color="text.secondary"
    className={className}
    {...props}
  >
    {children}
  </Typography>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, MuiCardContentProps>(
  ({ ...props }, ref) => <MuiCardContent ref={ref} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, MuiCardActionsProps>(
  ({ ...props }, ref) => <MuiCardActions ref={ref} {...props} />
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
