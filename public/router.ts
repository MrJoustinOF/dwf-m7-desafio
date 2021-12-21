import {
  initHome,
  initSignIn,
  initMe,
  initMyPets,
  initReportPet,
} from "./views";

export function initRouter(root: Element) {
  function goTo(path) {
    history.pushState({}, "", path);
    handleRoute(path);
  }

  function handleRoute(route) {
    const routes = [
      {
        path: "/",
        component: initHome,
      },
      {
        path: "/signin",
        component: initSignIn,
      },
      {
        path: "/me",
        component: initMe,
      },
      {
        path: "/mypets",
        component: initMyPets,
      },
      {
        path: "/reportpet",
        component: initReportPet,
      },
    ];

    for (const r of routes) {
      if (r.path === route) {
        const el = r.component({ goTo: goTo });
        root.firstChild?.remove();

        root.appendChild(el);
      }
    }
  }

  handleRoute(location.pathname);
}
