import Home from "./views/Home.js";
import UserProfile from "./views/UserProfile.js";
import TableList from "./views/TableList.js";
import Typography from "./views/Typography.js";
import Icons from "./views/Icons.js";
import Maps from "./views/Maps.js";
import Notifications from "./views/Notifications.js";
import Upgrade from "./views/Upgrade.js";
import Login from "./views/Login";
import MyPage from "./views/MyPage";

const dashboardRoutes = [
  {
    upgrade: true,
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-key-25",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    icon: "nc-icon nc-grid-45",
    component: Home
  },
  {
    upgrade: true,
    path: "/myPage",
    name: "MyPage",
    icon: "nc-icon nc-circle-09",
    component: MyPage,
  },
  {
    path: "/table",
    name: "Table List",
    icon: "nc-icon nc-notes",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin"
  }
];

export default dashboardRoutes;
