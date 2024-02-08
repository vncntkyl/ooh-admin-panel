export const sampleRoles = [
  {
    role_name: "superadmin",
    role_description: "the admin of the system",
    permissions: [
      {
        admin: true,
        modules: {
          sites: {
            view: true,
            edit: true,
            delete: true,
          },
          analytics: {
            view: true,
            edit: false,
            delete: false,
          },
          users: {
            view: true,
            edit: true,
            delete: true,
          },
          roles: {
            view: true,
            edit: true,
            delete: true,
          },
        },
      },
      {
        client: true,
      },
    ],
  },
  {
    role_name: "admin",
    role_description: "the admin of the data platform",
    permissions: [
      {
        admin: true,
        modules: {
          sites: {
            view: true,
            edit: true,
            delete: true,
          },
          analytics: {
            view: true,
            edit: true,
            delete: false,
          },
          users: {
            view: false,
            edit: false,
            delete: false,
          },
          roles: {
            view: false,
            edit: false,
            delete: false,
          },
        },
      },
      {
        client: true,
      },
    ],
  },
];
