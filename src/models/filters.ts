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
    {
      name: "role",
      header: "Role",
      type: "multi-select",
      options: [
        { value: "admin", label: "Admin" },
        { value: "instructor", label: "UserNameAndAvatar" },
        { value: "student", label: "Student" },
      ],
    },
  ];
}

export const createFilters = () => new UserFilters();
