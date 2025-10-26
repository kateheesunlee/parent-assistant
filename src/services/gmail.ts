interface GmailLabel {
  id: string;
  name: string;
  type: string;
}

interface GmailFilter {
  id: string;
  criteria: {
    from?: string;
    query?: string;
  };
  action: {
    addLabelIds?: string[];
  };
}

interface CreateLabelResponse {
  id: string;
  name: string;
}

interface CreateFilterResponse {
  id: string;
  criteria: {
    from?: string;
    query?: string;
  };
  action: {
    addLabelIds?: string[];
  };
}

export class GmailService {
  private accessToken: string;
  private userId: string = "me"; // Use 'me' for authenticated user

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Create a Gmail label
   * @param labelName - The name of the label to create
   * @returns The created label with its ID
   */
  async createLabel(labelName: string): Promise<CreateLabelResponse> {
    try {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/labels`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: labelName,
            labelListVisibility: "labelShow",
            messageListVisibility: "show",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to create Gmail label:", error);
        throw new Error(
          `Failed to create label: ${error.error?.message || "Unknown error"}`
        );
      }

      const label = await response.json();
      return {
        id: label.id,
        name: label.name,
      };
    } catch (error) {
      console.error("Error creating Gmail label:", error);
      throw error;
    }
  }

  /**
   * Create a Gmail filter
   *
   * Filter Logic:
   * - Any emails containing childName AND (from expectedSenders OR containing keywords)
   * - expectedSenders are OR-ed together
   * - keywords are OR-ed together
   *
   * Examples:
   * 1. ChildName="John", Senders=["school@example.com", "teacher@example.com"]
   *    → "John" AND (from:school@example.com OR from:teacher@example.com)
   * 2. ChildName="John", Keywords=["homework", "field trip"]
   *    → "John" AND ("homework" OR "field trip")
   * 3. Both → "John" AND ((from:school@example.com OR from:teacher@example.com) OR ("homework" OR "field trip"))
   *
   * @param childName - Name of the child (for query)
   * @param expectedSenders - Array of email addresses to filter from
   * @param keywords - Array of keywords to search for
   * @param labelId - The label ID to apply to matching emails
   * @returns The created filter with its ID
   */
  async createFilter(
    childName: string,
    expectedSenders: string[],
    keywords: string[],
    labelId: string
  ): Promise<CreateFilterResponse> {
    try {
      // Build the query string for Gmail filter
      // Logic: childName AND (senders OR keywords)

      if (!childName) {
        throw new Error("Child name is required for filter creation");
      }

      const conditions: string[] = [];

      // Add sender conditions if we have senders
      if (expectedSenders && expectedSenders.length > 0) {
        const fromQuery = expectedSenders
          .map((sender) => `from:${sender}`)
          .join(" OR ");
        conditions.push(`(${fromQuery})`);
      }

      // Add keyword conditions if we have keywords
      if (keywords && keywords.length > 0) {
        const keywordQuery = keywords
          .map((keyword) => `"${keyword}"`)
          .join(" OR ");
        conditions.push(`(${keywordQuery})`);
      }

      // Build the final query
      let query = `"${childName}"`;

      if (conditions.length > 0) {
        const conditionsQuery = conditions.join(" OR ");
        query = `"${childName}" AND (${conditionsQuery})`;
      }

      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/settings/filters`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            criteria: {
              query: query,
            },
            action: {
              addLabelIds: [labelId],
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to create Gmail filter:", error);
        throw new Error(
          `Failed to create filter: ${error.error?.message || "Unknown error"}`
        );
      }

      const filter = await response.json();
      return {
        id: filter.id,
        criteria: filter.criteria,
        action: filter.action,
      };
    } catch (error) {
      console.error("Error creating Gmail filter:", error);
      throw error;
    }
  }

  /**
   * Get a Gmail label by ID
   * @param labelId - The ID of the label to retrieve
   * @returns The label object if found, null otherwise
   */
  async getLabel(labelId: string): Promise<GmailLabel | null> {
    try {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/labels/${labelId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Label not found
        }
        const error = await response.json();
        console.error("Failed to get Gmail label:", error);
        throw new Error(
          `Failed to get label: ${error.error?.message || "Unknown error"}`
        );
      }

      const label = await response.json();
      console.log("Gmail label:", label);
      return label;
    } catch (error) {
      console.error("Error getting Gmail label:", error);
      throw error;
    }
  }

  /**
   * Get a Gmail filter by ID
   * @param filterId - The ID of the filter to retrieve
   * @returns The filter object if found, null otherwise
   */
  async getFilter(filterId: string): Promise<GmailFilter | null> {
    try {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/settings/filters/${filterId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Filter not found
        }
        const error = await response.json();
        console.error("Failed to get Gmail filter:", error);
        throw new Error(
          `Failed to get filter: ${error.error?.message || "Unknown error"}`
        );
      }

      const filter = await response.json();
      return filter;
    } catch (error) {
      console.error("Error getting Gmail filter:", error);
      throw error;
    }
  }

  /**
   * Delete a Gmail label (optional utility)
   * @param labelId - The ID of the label to delete
   */
  async deleteLabel(labelId: string): Promise<void> {
    try {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/labels/${labelId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to delete Gmail label:", error);
        throw new Error(
          `Failed to delete label: ${error.error?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting Gmail label:", error);
      throw error;
    }
  }

  /**
   * Delete a Gmail filter (optional utility)
   * @param filterId - The ID of the filter to delete
   */
  async deleteFilter(filterId: string): Promise<void> {
    try {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/settings/filters/${filterId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to delete Gmail filter:", error);
        throw new Error(
          `Failed to delete filter: ${error.error?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting Gmail filter:", error);
      throw error;
    }
  }
}
