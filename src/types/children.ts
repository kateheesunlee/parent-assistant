export interface Child {
  id: string;
  user_id: string;
  name: string;
  label_name: string;
  label_id: string | null;
  expected_senders: string[];
  keywords: string[];
  filter_id: string | null;
  created_at: string;
  updated_at: string;
  sync_status?: {
    label_deleted?: boolean;
    filter_deleted?: boolean;
  };
}

export interface ChildFormValues {
  name: string;
  label_name: string;
}

export interface CreateChildRequest {
  name: string;
  label_name: string;
  expected_senders: string[];
  keywords: string[];
}

export interface UpdateChildRequest {
  name?: string;
  label_name?: string;
  expected_senders?: string[];
  keywords?: string[];
}

export interface ChildrenResponse {
  children: Child[];
  error?: string;
}
