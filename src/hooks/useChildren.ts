import { useEffect, useState } from "react";
import { useChildrenStore } from "@/stores/childrenStore";
import {
  Child,
  CreateChildRequest,
  UpdateChildRequest,
} from "@/types/children";
import { useToast } from "@/components/ui/toast-provider";

export function useChildren() {
  const { children, isLoading, error, setChildren, setLoading, setError } =
    useChildrenStore();

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/children");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch children");
        }

        setChildren(data.children);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch children";
        setError(errorMessage);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [setChildren, setLoading, setError]);

  return { children, isLoading, error };
}

export function useCreateChild() {
  const { addChild } = useChildrenStore();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createChild = async (data: CreateChildRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create child");
      }

      addChild(result.child);
      showSuccess("Child created successfully");
      return result.child;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create child";
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createChild, isLoading };
}

export function useUpdateChild() {
  const { updateChild } = useChildrenStore();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const update = async (id: string, data: UpdateChildRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/children/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update child");
      }

      updateChild(id, result.child);
      showSuccess("Child updated successfully");
      return result.child;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update child";
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateChild: update, isLoading };
}

export function useDeleteChild() {
  const { deleteChild } = useChildrenStore();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const deleteChildById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/children/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete child");
      }

      deleteChild(id);
      showSuccess("Child deleted successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete child";
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteChild: deleteChildById, isLoading };
}
