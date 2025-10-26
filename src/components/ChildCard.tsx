"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Child } from "@/types/children";
import {
  useCreateChild,
  useUpdateChild,
  useDeleteChild,
} from "@/hooks/useChildren";
import {
  Box,
  Button,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  Stack,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import { Plus, X, Trash2, Save } from "lucide-react";

interface ChildCardProps {
  child?: Child;
  handleClose?: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .max(100, "Name must be less than 100 characters"),
  label_name: Yup.string()
    .required("Label name is required")
    .max(200, "Label name must be less than 200 characters"),
  expected_senders: Yup.array().of(Yup.string().email("Invalid email")),
  keywords: Yup.array().of(
    Yup.string().max(100, "Keyword must be less than 100 characters")
  ),
});

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function ChildCard({
  child,
  handleClose = () => {},
}: ChildCardProps) {
  const isCreateMode = !child;
  const { createChild, isLoading: isCreating } = useCreateChild();
  const { updateChild, isLoading: isUpdating } = useUpdateChild();
  const { deleteChild, isLoading: isDeleting } = useDeleteChild();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [senderInput, setSenderInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const isLoading = isCreating || isUpdating || isDeleting;

  const formik = useFormik({
    initialValues: {
      name: child?.name || "",
      label_name: child?.label_name || "",
      expected_senders: child?.expected_senders || [],
      keywords: child?.keywords || [],
    },
    validationSchema,
    enableReinitialize: !isCreateMode,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isCreateMode) {
          await createChild(values);
          resetForm();
        } else {
          await updateChild(child.id, values);
        }
      } catch (error) {
        // Error is handled by the hook with toast
      }
    },
  });

  const handleDelete = async () => {
    if (!child) return;

    try {
      await deleteChild(child.id);
      setShowDeleteModal(false);
    } catch (error) {
      // Error is handled by the hook with toast
    }
  };

  const handleAddSender = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && senderInput.trim()) {
      e.preventDefault();
      // validate email
      if (!isValidEmail(senderInput.trim())) {
        return;
      }
      const newSenders = [
        ...formik.values.expected_senders,
        senderInput.trim(),
      ];
      formik.setFieldValue("expected_senders", newSenders);
      setSenderInput("");
    }
  };

  const handleRemoveSender = (senderToRemove: string) => {
    const newSenders = formik.values.expected_senders.filter(
      (s) => s !== senderToRemove
    );
    formik.setFieldValue("expected_senders", newSenders);
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      const newKeywords = [...formik.values.keywords, keywordInput.trim()];
      formik.setFieldValue("keywords", newKeywords);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    const newKeywords = formik.values.keywords.filter(
      (k) => k !== keywordToRemove
    );
    formik.setFieldValue("keywords", newKeywords);
  };

  const hasChanges = isCreateMode
    ? formik.values.name || formik.values.label_name
    : formik.values.name !== child.name ||
      formik.values.label_name !== child.label_name ||
      JSON.stringify(formik.values.expected_senders.sort()) !==
        JSON.stringify([...(child?.expected_senders || [])].sort()) ||
      JSON.stringify(formik.values.keywords.sort()) !==
        JSON.stringify([...(child?.keywords || [])].sort());

  const canSave = isCreateMode
    ? formik.isValid && (formik.values.name || formik.values.label_name)
    : hasChanges;

  return (
    <>
      <Card
        sx={
          isCreateMode
            ? { borderStyle: "dashed", borderWidth: 1, borderColor: "grey.300" }
            : {}
        }
      >
        <CardHeader
          sx={{
            paddingBottom: 0,
            "& .MuiCardHeader-action": {
              margin: 0,
            },
          }}
          action={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                size="small"
                variant={!canSave ? "outlined" : "contained"}
                onClick={() => formik.handleSubmit()}
                disabled={isLoading || !canSave}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Save size={16} />
                  )
                }
              >
                {isCreateMode ? "Create Child" : "Save Changes"}
              </Button>
              <Button
                size="small"
                color="error"
                onClick={
                  isCreateMode ? handleClose : () => setShowDeleteModal(true)
                }
                disabled={isLoading || isDeleting}
                startIcon={
                  isDeleting ? (
                    <CircularProgress size={16} />
                  ) : isCreateMode ? (
                    <X size={16} />
                  ) : (
                    <Trash2 size={16} />
                  )
                }
              >
                {isCreateMode ? "Close" : "Delete"}
              </Button>
            </Box>
          }
          title={
            isCreateMode ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Plus size={16} />
                <Typography variant="h6">Add new child</Typography>
              </Box>
            ) : (
              <Typography variant="h5">{child.name}</Typography>
            )
          }
        />
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl required>
              <FormLabel htmlFor="name">Name</FormLabel>
              <OutlinedInput
                id="name"
                name="name"
                size="small"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                placeholder={isCreateMode ? "Enter child's name" : child.name}
                disabled={isLoading}
              />
              <FormHelperText>
                {formik.touched.name && formik.errors.name}
              </FormHelperText>
            </FormControl>
            <FormControl
              required
              disabled={isLoading}
              error={
                formik.touched.label_name && Boolean(formik.errors.label_name)
              }
            >
              <FormLabel htmlFor="label-name">Label name</FormLabel>
              <OutlinedInput
                id="label-name"
                name="label_name"
                size="small"
                value={formik.values.label_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.label_name && Boolean(formik.errors.label_name)
                }
                disabled={isLoading}
                placeholder={isCreateMode ? "Enter label name" : undefined}
              />
              <FormHelperText>
                {formik.touched.label_name && formik.errors.label_name}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Expected senders</FormLabel>
              {formik.values.expected_senders.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 1, flexWrap: "wrap", gap: 0.5 }}
                >
                  {formik.values.expected_senders.map((sender, index) => (
                    <Chip
                      key={index}
                      label={sender}
                      onDelete={() => handleRemoveSender(sender)}
                      size="medium"
                      disabled={isLoading}
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </Stack>
              )}
              <OutlinedInput
                name="expected_senders"
                type="email"
                value={senderInput}
                onChange={(e) => setSenderInput(e.target.value)}
                onKeyDown={handleAddSender}
                disabled={isLoading}
                placeholder={isCreateMode ? "Type and press Enter to add" : ""}
                inputProps={{
                  size: "small",
                }}
                endAdornment={
                  senderInput && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSenderInput("")}
                        edge="end"
                      >
                        <X size={16} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Keywords</FormLabel>
              {formik.values.keywords.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 1, flexWrap: "wrap", gap: 0.5 }}
                >
                  {formik.values.keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      onDelete={() => handleRemoveKeyword(keyword)}
                      size="medium"
                      disabled={isLoading}
                      color="primary"
                      sx={{
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Stack>
              )}
              <OutlinedInput
                name="keywords"
                size="small"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                disabled={isLoading}
                placeholder={isCreateMode ? "Type and press Enter to add" : ""}
                inputProps={{
                  size: "small",
                }}
                endAdornment={
                  keywordInput && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setKeywordInput("")}
                        edge="end"
                      >
                        <X size={16} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              />
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {!isCreateMode && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Child"
          message={`Are you sure you want to delete "${child.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      )}
    </>
  );
}
