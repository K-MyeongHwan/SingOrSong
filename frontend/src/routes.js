import Home from "./views/Home.js";
import MyPage from "./views/MyPage";
import CoverList from "./views/CoverList";
import Ranking from "./views/Ranking";
import Login from "./views/Login";

const dashboardRoutes = [
  {
    upgrade: true,
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-key-25",
    component: Login,
  },
  {
    upgrade: true,
    name: "Logout",
    icon: "nc-icon nc-key-25",
  },
  {
    path: "",
    name: "Main",
    icon: "nc-icon nc-bullet-list-67",
    component: Ranking
  },
  {
    path: "",
    name: "Search",
    icon: "nc-icon nc-zoom-split",
  },
  {
    path: "/home",
    name: "Popular Song",
    icon: "nc-icon nc-grid-45",
    component: Home
  },
  {
    path: "/coverList",
    name: "Popular Cover",
    icon: "nc-icon nc-notes",
    component: CoverList,
    layout: "/coverList"
  },
  {
    path: "/myPage",
    name: "MyPage",
    icon: "nc-icon nc-circle-09",
    component: MyPage,
  }
];

export default dashboardRoutes;
