const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/login", component: () => import("pages/LoginPage.vue") },
      { path: "/register", component: () => import("pages/RegisterPage.vue") },
      {
        path: "/dashboard",
        component: () => import("pages/DashboardPage.vue"),
      },
      { path: "/expenses", component: () => import("pages/ExpenesesPage.vue") },
      {
        path: "/management",
        component: () => import("pages/ManagementPage.vue"),
      },
      {
        path: "/list",
        component: () => import("pages/ListExpensesPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
