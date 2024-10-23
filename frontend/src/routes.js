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
import CoverList from "./views/CoverList";

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
    name: "Popular Song",
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
    path: "/coverList",
    name: "Popular Cover",
    icon: "nc-icon nc-notes",
    component: CoverList,
    layout: "/coverList"
  },
  {
    path: "",
    name: "Search",
    icon: "nc-icon nc-zoom-split",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
  }
];

export default dashboardRoutes;
