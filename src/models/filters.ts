class UserFilters {
  public filters = [
    {
      name: "status",
      header: "Status",
      type: "multi-select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "invited", label: "Invited" },
      ],
    },
  ];
}

export const createFilters = () => new UserFilters();
